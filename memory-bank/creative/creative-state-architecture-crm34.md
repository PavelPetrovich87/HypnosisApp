# Creative Phase Documentation: CRM-34 State Architecture & Error Handling

**Date**: September 7, 2024  
**Task**: CRM-34 - MVVM State Management Architecture Implementation  
**Phase**: Creative Phase Complete ✅  
**Complexity**: Level 3 (Intermediate Feature)

## 🎨🎨🎨 CREATIVE PHASE SUMMARY

### Design Challenge
Implement a comprehensive MVVM (Model-View-ViewModel) architecture with centralized state management for a React Native hypnosis app, including robust error handling strategies for offline scenarios, API failures, and optimal user experience.

### Key Design Decisions

#### ✅ **State Architecture: Domain-Separated Stores**
**Selected**: Modular Zustand stores by domain (Auth, User, Session, Playback, App)  
**Rationale**: 
- **Performance**: Targeted re-renders improve mobile app performance
- **Scalability**: Clear domain boundaries support future feature development  
- **Testability**: Individual stores are easier to unit test and mock
- **Maintainability**: Separation of concerns reduces coupling

#### ✅ **Error Handling: Layered Error Strategy**  
**Selected**: Multi-level error handling with escalation from context-specific to global
**Rationale**:
- **User Experience**: Context-specific error handling provides better user feedback
- **Robustness**: Multiple layers ensure no errors go unhandled
- **Flexibility**: Supports both immediate recovery and global error policies
- **Mobile Considerations**: Handles network instability and offline scenarios

## 🏗️ DETAILED ARCHITECTURE DESIGN

### State Management Architecture

#### Core Store Structure
```typescript
// Domain-separated stores with TypeScript
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  verificationStatus: VerificationStatus;
  error: string | null;
}

interface UserState {
  current: User | null;
  profile: UserProfile;
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}

interface SessionState {
  current: Session | null;
  recent: Session[];
  suggested: Session[];
  generationStatus: GenerationStatus;
  quota: QuotaInfo;
  isLoading: boolean;
  error: string | null;
}

interface PlaybackState {
  currentSession: Session | null;
  audioFile: AudioFile | null;
  isPlaying: boolean;
  progress: number;
  isBuffering: boolean;
  error: string | null;
}

interface AppState {
  theme: 'light' | 'dark';
  networkStatus: NetworkStatus;
  permissions: PermissionState;
  isOffline: boolean;
  syncStatus: SyncStatus;
}
```

#### Store Implementation Pattern
```typescript
const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        isAuthenticated: false,
        token: null,
        isLoading: false,
        verificationStatus: 'pending',
        error: null,
        
        // Actions with error handling
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const result = await authService.login(email, password);
            set({ 
              isAuthenticated: true, 
              token: result.token,
              isLoading: false 
            });
          } catch (error) {
            set({ 
              error: error.message, 
              isLoading: false 
            });
            ErrorService.handleError(error, 'auth.login', {
              showUser: true,
              retry: true
            });
          }
        },
        
        logout: async () => {
          try {
            await authService.logout();
            set({ 
              isAuthenticated: false, 
              token: null,
              error: null 
            });
          } catch (error) {
            // Even if logout fails, clear local state
            set({ 
              isAuthenticated: false, 
              token: null 
            });
          }
        }
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({ 
          token: state.token, 
          isAuthenticated: state.isAuthenticated 
        })
      }
    )
  )
);
```

#### Performance Optimizations
```typescript
// Selective subscriptions to prevent unnecessary re-renders
const useAuthStatus = () => useAuthStore(state => state.isAuthenticated);
const useAuthLoading = () => useAuthStore(state => state.isLoading);
const useAuthError = () => useAuthStore(state => state.error);

// Computed selectors for complex state derivations
const useSessionStats = () => useSessionStore(state => ({
  totalSessions: state.recent.length,
  totalDuration: state.recent.reduce((sum, session) => sum + session.duration, 0),
  streak: calculateStreak(state.recent)
}));
```

### Service Layer Architecture

#### Core Services Design
```typescript
class AuthService {
  private apiClient: ApiClient;
  private cacheService: CacheService;
  
  constructor(apiClient: ApiClient, cacheService: CacheService) {
    this.apiClient = apiClient;
    this.cacheService = cacheService;
  }
  
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const response = await this.apiClient.post('/auth/login', {
        email,
        password
      });
      
      // Cache auth result
      await this.cacheService.set('auth.lastLogin', Date.now());
      
      return response.data;
    } catch (error) {
      if (error.code === 'NETWORK_ERROR') {
        throw new NetworkError('Unable to connect. Please check your internet connection.');
      }
      throw error;
    }
  }
  
  async refreshToken(): Promise<string> {
    const currentToken = useAuthStore.getState().token;
    if (!currentToken) {
      throw new AuthError('No token to refresh');
    }
    
    try {
      const response = await this.apiClient.post('/auth/refresh', {
        token: currentToken
      });
      return response.data.token;
    } catch (error) {
      // Clear invalid token
      useAuthStore.getState().logout();
      throw error;
    }
  }
}

class SessionService {
  private apiClient: ApiClient;
  private syncService: SyncService;
  
  async createSession(params: SessionParams): Promise<Session> {
    // Check quota before creation
    const quotaInfo = useUserStore.getState().current?.quotaInfo;
    if (quotaInfo?.isExhausted) {
      throw new QuotaError('Session quota exhausted');
    }
    
    try {
      const response = await this.apiClient.post('/sessions', params);
      
      // Update session store
      useSessionStore.getState().addSession(response.data);
      
      return response.data;
    } catch (error) {
      if (NetworkService.isOffline()) {
        // Queue for later sync
        this.syncService.queueOperation({
          type: 'CREATE_SESSION',
          data: params,
          timestamp: Date.now()
        });
        throw new OfflineError('Session queued for creation when online');
      }
      throw error;
    }
  }
}
```

#### Audio Service with Comprehensive Error Handling
```typescript
class AudioService {
  private llmClient: LLMClient;
  private ttsClient: TTSClient;
  private storageService: StorageService;
  
  async generateScript(session: Session): Promise<string> {
    try {
      const response = await this.llmClient.generateScript({
        goals: session.config.goals,
        duration: session.config.duration,
        style: session.config.style
      });
      
      return response.script;
    } catch (error) {
      if (error.code === 'RATE_LIMIT') {
        throw new RateLimitError('Too many requests. Please try again later.');
      }
      if (error.code === 'QUOTA_EXCEEDED') {
        throw new QuotaError('AI generation quota exceeded');
      }
      throw error;
    }
  }
  
  async synthesizeAudio(script: string, voice: VoicePreference): Promise<AudioFile> {
    try {
      const response = await this.ttsClient.synthesize({
        text: script,
        voice: voice.id,
        settings: voice.settings
      });
      
      // Save audio file locally
      const localPath = await this.storageService.saveAudio(
        response.audioData,
        `session-${Date.now()}.mp3`
      );
      
      return {
        id: response.id,
        url: response.url,
        localPath,
        duration: response.duration,
        isDownloaded: true
      };
    } catch (error) {
      if (error.code === 'VOICE_NOT_AVAILABLE') {
        throw new VoiceError('Selected voice is temporarily unavailable');
      }
      throw error;
    }
  }
}
```

### ViewModel Layer Design

#### MVVM Pattern Implementation
```typescript
class AuthViewModel {
  private authStore = useAuthStore;
  private userStore = useUserStore;
  private authService: AuthService;
  private userService: UserService;
  
  constructor(authService: AuthService, userService: UserService) {
    this.authService = authService;
    this.userService = userService;
  }
  
  async login(email: string, password: string): Promise<void> {
    try {
      // Coordinate multiple services through ViewModel
      await this.authStore.getState().login(email, password);
      await this.userStore.getState().loadProfile();
      
      // Navigate after successful login
      NavigationService.navigate('Home');
    } catch (error) {
      this.handleError(error, 'login');
    }
  }
  
  async registerOrLogin(email: string, password: string): Promise<void> {
    try {
      // Try login first
      await this.login(email, password);
    } catch (error) {
      if (error.code === 'USER_NOT_FOUND') {
        // Auto-register if user doesn't exist
        await this.register(email, password);
      } else {
        throw error;
      }
    }
  }
  
  private handleError(error: Error, context: string): void {
    ErrorService.handleError(error, `auth.${context}`, {
      showUser: true,
      report: true,
      retry: context === 'login'
    });
  }
}

class SessionCreationViewModel {
  private sessionStore = useSessionStore;
  private quotaStore = useUserStore;
  private sessionService: SessionService;
  private quotaService: QuotaService;
  
  async createQuickSession(params: QuickSessionParams): Promise<void> {
    try {
      // Check quota before creation
      const quotaValid = await this.quotaService.validateQuota();
      if (!quotaValid) {
        NavigationService.navigate('Quota');
        return;
      }
      
      // Create session
      const session = await this.sessionService.createSession(params);
      
      // Start audio generation
      await this.generateAudio(session.id);
      
    } catch (error) {
      this.handleError(error, 'createQuickSession');
    }
  }
  
  private async generateAudio(sessionId: string): Promise<void> {
    const audioGenerationVM = new AudioGenerationViewModel();
    await audioGenerationVM.generateAudio(sessionId);
  }
}
```

### Error Handling Strategy

#### Layered Error Architecture
```typescript
interface ErrorContext {
  component: string;
  action: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

interface ErrorOptions {
  showUser?: boolean;
  report?: boolean;
  retry?: boolean;
  fallback?: () => void;
}

class ErrorService {
  private static contextHandlers: Map<string, ErrorHandler> = new Map();
  
  static handleError(
    error: Error, 
    context: string, 
    options: ErrorOptions = {}
  ): void {
    // Layer 1: Context-specific handling
    const contextHandler = this.getContextHandler(context);
    if (contextHandler && contextHandler.canHandle(error)) {
      return contextHandler.handle(error, options);
    }
    
    // Layer 2: Error type handling
    if (this.handleByType(error, options)) {
      return;
    }
    
    // Layer 3: Global fallback handling
    this.globalErrorHandler(error, context, options);
  }
  
  private static handleByType(error: Error, options: ErrorOptions): boolean {
    if (error instanceof NetworkError) {
      return this.handleNetworkError(error, options);
    }
    
    if (error instanceof QuotaError) {
      return this.handleQuotaError(error, options);
    }
    
    if (error instanceof AuthError) {
      return this.handleAuthError(error, options);
    }
    
    return false;
  }
  
  private static handleNetworkError(error: NetworkError, options: ErrorOptions): boolean {
    if (NetworkService.isOffline()) {
      this.showOfflineMessage();
      return true;
    }
    
    if (options.retry) {
      this.showRetryDialog(error.retryAction);
      return true;
    }
    
    return false;
  }
  
  private static handleQuotaError(error: QuotaError, options: ErrorOptions): boolean {
    NavigationService.navigate('Quota', { error: error.message });
    return true;
  }
  
  private static handleAuthError(error: AuthError, options: ErrorOptions): boolean {
    // Clear auth state and redirect to login
    useAuthStore.getState().logout();
    NavigationService.navigate('Welcome');
    return true;
  }
}
```

#### Network Error Resilience
```typescript
class NetworkService {
  private static retryQueue: OperationQueue = new OperationQueue();
  
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          break;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
  
  static queueOfflineOperation(operation: OfflineOperation): void {
    this.retryQueue.add(operation);
    
    // Show user feedback
    ToastService.show('Operation queued for when online', 'info');
  }
  
  static onNetworkStatusChange(callback: (isOnline: boolean) => void): void {
    NetInfo.addEventListener(state => {
      const isOnline = state.isConnected && state.isInternetReachable;
      callback(isOnline);
      
      if (isOnline && this.retryQueue.hasOperations()) {
        this.processOfflineQueue();
      }
    });
  }
}
```

### User Experience Error States

#### Loading States Design
```typescript
interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
  cancellable?: boolean;
}

class LoadingStateManager {
  static showSessionGeneration(progress: number): void {
    useAppStore.getState().setLoadingState({
      isLoading: true,
      message: 'Generating your personalized session...',
      progress,
      cancellable: true
    });
  }
  
  static showAudioSynthesis(): void {
    useAppStore.getState().setLoadingState({
      isLoading: true,
      message: 'Creating audio with your selected voice...',
      cancellable: false
    });
  }
  
  static hideLoading(): void {
    useAppStore.getState().setLoadingState({
      isLoading: false
    });
  }
}
```

#### Error Recovery UI Patterns
```typescript
interface ErrorState {
  error: Error | null;
  retryAction?: () => void;
  fallbackAction?: () => void;
  dismissible?: boolean;
}

class ErrorStateManager {
  static showRetryableError(error: Error, retryAction: () => void): void {
    useAppStore.getState().setErrorState({
      error,
      retryAction,
      dismissible: true
    });
  }
  
  static showOfflineState(queuedOperations: number): void {
    useAppStore.getState().setErrorState({
      error: new Error(`You're offline. ${queuedOperations} operations queued.`),
      fallbackAction: () => NavigationService.navigate('Offline'),
      dismissible: true
    });
  }
  
  static clearError(): void {
    useAppStore.getState().setErrorState({
      error: null
    });
  }
}
```

## 🔧 IMPLEMENTATION GUIDELINES

### File Structure
```
src/state/
├── authStore.ts              # Authentication state with persistence
├── userStore.ts              # User profile and preferences
├── sessionStore.ts           # Session management and history
├── playbackStore.ts          # Audio playback controls
├── appStore.ts               # App-wide UI state and settings
└── index.ts                  # Store exports and initialization

src/services/
├── errorService.ts           # Centralized error handling
├── authService.ts            # Authentication business logic
├── userService.ts            # User management
├── sessionService.ts         # Session CRUD operations
├── audioService.ts           # Audio generation and management
├── quotaService.ts           # Usage quota management
├── networkService.ts         # Network monitoring
├── syncService.ts            # Offline synchronization
├── storageService.ts         # Local storage abstraction
└── index.ts                  # Service exports

src/viewmodels/
├── authViewModel.ts          # Authentication flow coordination
├── onboardingViewModel.ts    # Onboarding process management
├── homeViewModel.ts          # Dashboard business logic
├── sessionCreationViewModel.ts # Session generation workflow
├── audioGenerationViewModel.ts # Audio creation coordination
├── playbackViewModel.ts      # Playback controls
└── index.ts                  # ViewModel exports
```

### Integration Strategy

#### Screen Integration Pattern
```typescript
// Before: Direct API calls
const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const userData = await fetch('/api/user');
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    loadUser();
  }, []);
  
  return <View>...</View>;
};

// After: MVVM integration
const ProfileScreen = () => {
  const user = useUserStore(state => state.current);
  const loading = useUserStore(state => state.isLoading);
  const error = useUserStore(state => state.error);
  const loadProfile = useUserStore(state => state.loadProfile);
  
  useEffect(() => {
    loadProfile();
  }, []);
  
  if (error) {
    return <ErrorBoundary error={error} retry={loadProfile} />;
  }
  
  return <View>...</View>;
};
```

### Testing Strategy

#### ViewModel Testing
```typescript
describe('AuthViewModel', () => {
  let authViewModel: AuthViewModel;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockUserService: jest.Mocked<UserService>;
  
  beforeEach(() => {
    mockAuthService = createMockAuthService();
    mockUserService = createMockUserService();
    authViewModel = new AuthViewModel(mockAuthService, mockUserService);
  });
  
  it('should handle successful login', async () => {
    mockAuthService.login.mockResolvedValue({
      token: 'test-token',
      user: mockUser
    });
    
    await authViewModel.login('test@example.com', 'password');
    
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().token).toBe('test-token');
  });
  
  it('should handle login error', async () => {
    const error = new AuthError('Invalid credentials');
    mockAuthService.login.mockRejectedValue(error);
    
    await authViewModel.login('test@example.com', 'wrong-password');
    
    expect(useAuthStore.getState().error).toBe('Invalid credentials');
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
```

## 🎯 SUCCESS CRITERIA

### Technical Success Metrics
- [ ] All ViewModels implemented with proper dependency injection
- [ ] State management working across all screens with < 100ms update times
- [ ] API services integrated with comprehensive error handling
- [ ] Offline capabilities functional with sync queue
- [ ] Error handling covers 95% of failure scenarios
- [ ] Unit test coverage > 90% for business logic
- [ ] Performance: < 16ms render times for state updates

### User Experience Success Metrics
- [ ] Seamless onboarding flow with proper state persistence
- [ ] Fast session generation (< 30 seconds for quick sessions)
- [ ] Reliable offline playback with clear status indicators
- [ ] Intuitive error recovery with actionable user feedback
- [ ] Consistent app behavior across all user flows
- [ ] Zero data loss during offline/online transitions

## 🚀 NEXT PHASE: IMPLEMENTATION

The creative phase has established a solid architectural foundation with:
- **Domain-separated state management** for optimal performance
- **Layered error handling** for robust user experience  
- **MVVM pattern compliance** with clear separation of concerns
- **Mobile-first optimizations** for React Native requirements

**Ready for IMPLEMENT Mode** to create the actual stores, services, and ViewModels based on these design specifications.
