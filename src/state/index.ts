// Core stores
export * from './authStore';
export * from './userStore';
export * from './sessionStore';
export * from './playbackStore';
export * from './appStore';

// Store initialization and management
import { useAuthStore } from './authStore';
import { useUserStore } from './userStore';
import { useSessionStore } from './sessionStore';
import { usePlaybackStore } from './playbackStore';
import { useAppStore } from './appStore';

// State management utilities
export interface StoreActions {
  clearAllStores: () => void;
  resetAllStores: () => void;
  exportAllState: () => ApplicationState;
}

export interface ApplicationState {
  auth: ReturnType<typeof useAuthStore.getState>;
  user: ReturnType<typeof useUserStore.getState>;
  session: ReturnType<typeof useSessionStore.getState>;
  playback: ReturnType<typeof usePlaybackStore.getState>;
  app: ReturnType<typeof useAppStore.getState>;
  timestamp: Date;
  version: string;
}

// Store management utilities
export const storeActions: StoreActions = {
  clearAllStores: () => {
    // Clear error states and loading states
    useAuthStore.getState().clearError();
    useUserStore.getState().clearError();
    useSessionStore.getState().clearError();
    usePlaybackStore.getState().clearError();
    useAppStore.getState().clearGlobalError();
    
    // Clear loading states
    useAuthStore.getState().setLoading(false);
    useUserStore.getState().setLoading(false);
    useSessionStore.getState().setLoading(false);
    useAppStore.getState().clearGlobalLoading();
    
    // Reset playback
    usePlaybackStore.getState().reset();
  },

  resetAllStores: () => {
    // Reset all stores to initial state (be careful - this clears all data)
    usePlaybackStore.getState().reset();
    useAppStore.getState().reset();
    
    // Auth and user stores should be reset through logout process
    useAuthStore.getState().logout();
    useUserStore.getState().logout();
    
    // Clear session data
    useSessionStore.getState().setCurrentSession(null);
  },

  exportAllState: (): ApplicationState => {
    return {
      auth: useAuthStore.getState(),
      user: useUserStore.getState(),
      session: useSessionStore.getState(),
      playback: usePlaybackStore.getState(),
      app: useAppStore.getState(),
      timestamp: new Date(),
      version: '1.0.0'
    };
  }
};

// Hook for accessing all store actions
export const useStoreActions = () => storeActions;

// Combined selectors for common use cases
export const useAppStatus = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading) ||
                   useUserStore(state => state.isLoading) ||
                   useSessionStore(state => state.isLoading) ||
                   useAppStore(state => state.globalLoading.isLoading);
  
  const hasError = useAuthStore(state => !!state.error) ||
                   useUserStore(state => !!state.error) ||
                   useSessionStore(state => !!state.error) ||
                   usePlaybackStore(state => !!state.error) ||
                   useAppStore(state => !!state.globalError.error);
  
  const isOffline = useAppStore(state => state.isOffline);
  const networkStatus = useAppStore(state => state.networkStatus);
  
  return {
    isAuthenticated,
    isLoading,
    hasError,
    isOffline,
    networkStatus
  };
};

// User session status
export const useUserSessionStatus = () => {
  const user = useUserStore(state => state.current);
  const profile = useUserStore(state => state.profile);
  const quotaInfo = useUserStore(state => state.quotaInfo);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  return {
    user,
    profile,
    quotaInfo,
    isAuthenticated,
    canCreateSession: quotaInfo && !quotaInfo.isExhausted && quotaInfo.dailyUsed < quotaInfo.dailyLimit,
    hasProfile: !!profile
  };
};

// Playback status
export const usePlaybackStatus = () => {
  const isPlaying = usePlaybackStore(state => state.isPlaying);
  const isPaused = usePlaybackStore(state => state.isPaused);
  const currentSession = usePlaybackStore(state => state.currentSession);
  const progress = usePlaybackStore(state => state.progress);
  const duration = usePlaybackStore(state => state.duration);
  
  return {
    isPlaying,
    isPaused,
    currentSession,
    progress,
    duration,
    hasActiveSession: !!currentSession,
    progressPercentage: duration > 0 ? Math.round((progress / duration) * 100) : 0
  };
};

// Combined error state
export const useGlobalErrorState = () => {
  const authError = useAuthStore(state => state.error);
  const userError = useUserStore(state => state.error);
  const sessionError = useSessionStore(state => state.error);
  const playbackError = usePlaybackStore(state => state.error);
  const appError = useAppStore(state => state.globalError.error);
  
  const firstError = authError || userError || sessionError || playbackError || appError;
  
  return {
    hasError: !!firstError,
    error: firstError,
    context: authError ? 'auth' : 
             userError ? 'user' : 
             sessionError ? 'session' : 
             playbackError ? 'playback' : 
             appError ? 'app' : null
  };
};

// Development and debugging utilities
export const useDevTools = () => {
  const isDeveloperMode = useAppStore(state => state.isDeveloperMode);
  
  return {
    isDeveloperMode,
    exportState: storeActions.exportAllState,
    clearStores: storeActions.clearAllStores,
    resetStores: storeActions.resetAllStores,
    
    // Individual store states for debugging
    getAuthState: () => useAuthStore.getState(),
    getUserState: () => useUserStore.getState(),
    getSessionState: () => useSessionStore.getState(),
    getPlaybackState: () => usePlaybackStore.getState(),
    getAppState: () => useAppStore.getState()
  };
};

// Store initialization helper
export const initializeStores = async () => {
  try {
    // Initialize app store first
    const appStore = useAppStore.getState();
    appStore.updateDebugInfo({
      platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
      version: '1.0.0',
      buildNumber: '1'
    });
    
    // Check if user is authenticated
    const authStore = useAuthStore.getState();
    if (authStore.isAuthenticated && authStore.token) {
      // Load user profile
      const userStore = useUserStore.getState();
      await userStore.loadProfile();
      
      // Load recent sessions
      const sessionStore = useSessionStore.getState();
      await sessionStore.loadRecentSessions();
      await sessionStore.loadSuggestedSessions();
    }
    
    // Mark first launch as complete if this is first time
    if (appStore.isFirstLaunch) {
      appStore.markFirstLaunchComplete();
    }
    
    console.log('📱 Stores initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize stores:', error);
    useAppStore.getState().setGlobalError({
      error: error as Error,
      context: 'initialization',
      severity: 'high'
    });
  }
};

// Type exports for external use
export type {
  // Auth types
  AuthState,
  AuthActions,
  VerificationStatus,
  AuthResult
} from './authStore';

export type {
  // User types
  User,
  UserProfile,
  UserPreferences,
  UserStatistics,
  QuotaInfo,
  HypnosisGoal,
  ExperienceLevel,
  SubscriptionTier
} from './userStore';

export type {
  // Session types
  Session,
  SessionConfig,
  SessionStatus,
  HypnosisStyle,
  GenerationProgress,
  GenerationStage,
  AudioFile
} from './sessionStore';

export type {
  // Playback types
  PlaybackState,
  PlaybackActions,
  RepeatMode,
  PlaybackProgress
} from './playbackStore';

export type {
  // App types
  AppState,
  AppActions,
  ThemeMode,
  ColorScheme,
  FontSize,
  NetworkStatus,
  PermissionState,
  LoadingState,
  ErrorState,
  SyncStatus,
  FeatureFlags
} from './appStore';
