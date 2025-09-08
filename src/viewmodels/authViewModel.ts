// Auth ViewModel - MVVM Pattern Implementation
// Following creative phase specifications for ViewModels coordinating business logic
// CRM-35: Integrated with AuthService for backend registration

import { useAuthStore, useUserStore } from '../state';
import { Services, ErrorService, AuthError, NetworkError } from '../services';
import { authService } from '../services/authService';
import { AuthError as ServiceAuthError, RegisterRequest } from '../services/types/auth.types';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
    voicePreference?: string; // CRM-35: Voice preference integration
}

export interface EmailVerificationData {
  email: string;
  verificationToken: string;
}

export interface PasswordResetData {
  email: string;
  resetToken: string;
  newPassword: string;
}

export interface AuthValidationResult {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
    general?: string;
  };
}

// Auth ViewModel - Coordinates authentication flow
export class AuthViewModel {
  // ViewModel methods coordinate between UI, stores, and services
  
  // Email/password validation
  validateLoginCredentials(credentials: LoginCredentials): AuthValidationResult {
    const errors: { email?: string; password?: string } = {};
    
    // Email validation
    if (!credentials.email.trim()) {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(credentials.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!credentials.password) {
      errors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  validateRegistrationData(data: RegisterData): AuthValidationResult {
    const errors: { email?: string; password?: string } = {};
    
    // Email validation (same as login)
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation (stricter for registration)
    if (!data.password) {
      errors.password = 'Password is required';
    } else if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!this.isStrongPassword(data.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  private isStrongPassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber;
  }
  
  // Login flow coordination
  async login(credentials: LoginCredentials): Promise<void> {
    console.log('🔐 AuthViewModel: Starting login flow');
    
    try {
      // Step 1: Validate credentials
      const validation = this.validateLoginCredentials(credentials);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join(', ');
        throw new Error(errorMessage);
      }
      
      // Step 2: Attempt login through auth store
      await useAuthStore.getState().login(credentials.email, credentials.password);
      
      // Step 3: Load user profile after successful authentication
      if (useAuthStore.getState().isAuthenticated) {
        console.log('✅ AuthViewModel: Login successful, loading profile');
        await this.loadUserProfile();
        
        // Step 4: Navigate to appropriate screen
        await this.handlePostLoginNavigation();
      }
      
    } catch (error) {
      console.error('❌ AuthViewModel: Login failed:', error);
      this.handleAuthError(error as Error, 'login');
      throw error;
    }
  }
  
    // Registration flow coordination - CRM-35: Updated to use AuthService
  async register(data: RegisterData): Promise<void> {
      console.log('📝 AuthViewModel: Starting registration flow with AuthService');

      // Prevent multiple submissions
      if (useAuthStore.getState().isLoading) {
          console.log('⚠️ AuthViewModel: Registration already in progress');
          return;
      }
    
    try {
        // Step 1: Set loading state
        useAuthStore.getState().setLoading(true);
        useAuthStore.getState().clearError();

        // Step 2: Validate registration data using existing validation
      const validation = this.validateRegistrationData(data);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join(', ');
          throw new ServiceAuthError('VALIDATION_ERROR', errorMessage, 'general');
      }
      
        // Step 3: Prepare registration request for AuthService
        const registerRequest: RegisterRequest = {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            voicePreference: data.voicePreference // CRM-35: Include voice preference
        };
      
        // Step 4: Call AuthService.register()
        console.log('🔐 AuthViewModel: Calling AuthService.register()');
        const response = await authService.register(registerRequest);

        // Step 5: Update GlobalState with auth result
        console.log('✅ AuthViewModel: Registration successful, updating stores');

        // Update auth store with token and authentication status
        const authStore = useAuthStore.getState();
        (authStore as any).isAuthenticated = true;
        (authStore as any).token = response.token;
        (authStore as any).verificationStatus = response.requiresVerification ? 'required' : 'verified';

        // Update user store with user data
        const userStore = useUserStore.getState();
        (userStore as any).current = response.user;

        // Step 6: Set up initial user profile with additional data
        await this.setupInitialProfile(data);

        // Step 7: Handle navigation flow
        if (response.requiresVerification) {
            console.log('📧 AuthViewModel: Email verification required');
            await this.handleEmailVerificationRequired();
        } else {
            await this.handlePostLoginNavigation();
        }

        console.log('✅ AuthViewModel: Registration flow completed successfully');
      
    } catch (error) {
      console.error('❌ AuthViewModel: Registration failed:', error);
        this.handleRegistrationError(error as ServiceAuthError);
      throw error;
    } finally {
        // Always clear loading state
        useAuthStore.getState().setLoading(false);
    }
  }
  
  // Register or login flow (convenience method for seamless UX)
  async registerOrLogin(credentials: LoginCredentials): Promise<void> {
    console.log('🔄 AuthViewModel: Attempting register or login flow');
    
    try {
      // First try login
      await this.login(credentials);
      
    } catch (error) {
      const errorMessage = (error as Error).message.toLowerCase();
      
      // If user not found, try registration
      if (errorMessage.includes('user not found') || 
          errorMessage.includes('no account found') ||
          errorMessage.includes('invalid email')) {
        
        console.log('👤 AuthViewModel: User not found, attempting registration');
        
        try {
          await this.register({
            email: credentials.email,
            password: credentials.password
          });
        } catch (registerError) {
          // If registration also fails, show original login error
          throw error;
        }
      } else {
        // Re-throw original login error
        throw error;
      }
    }
  }
  
  // Email verification flow
  async verifyEmail(verificationToken: string): Promise<void> {
    console.log('📧 AuthViewModel: Starting email verification');
    
    try {
      await useAuthStore.getState().verifyEmail(verificationToken);
      
      if (useAuthStore.getState().verificationStatus === 'verified') {
        console.log('✅ AuthViewModel: Email verification successful');
        await this.handlePostLoginNavigation();
      }
      
    } catch (error) {
      console.error('❌ AuthViewModel: Email verification failed:', error);
      this.handleAuthError(error as Error, 'verifyEmail');
      throw error;
    }
  }
  
  // Logout flow
  async logout(): Promise<void> {
    console.log('👋 AuthViewModel: Starting logout flow');
    
    try {
      // Step 1: Clear auth state
      await useAuthStore.getState().logout();
      
      // Step 2: Clear user state
      useUserStore.getState().logout();
      
      // Step 3: Clear any cached data and reset app state
      await this.handlePostLogoutCleanup();
      
      // Step 4: Navigate to welcome screen
      // This will be integrated when NavigationService is available
      // NavigationService.reset('Welcome');
      
      console.log('✅ AuthViewModel: Logout successful');
      
    } catch (error) {
      console.error('❌ AuthViewModel: Logout error:', error);
      // Even if logout fails on server, clear local state
      useAuthStore.getState().clearError();
      useUserStore.getState().clearError();
    }
  }
  
  // Token refresh coordination
  async refreshAuthToken(): Promise<void> {
    console.log('🔄 AuthViewModel: Refreshing auth token');
    
    try {
      await useAuthStore.getState().refreshToken();
      console.log('✅ AuthViewModel: Token refresh successful');
      
    } catch (error) {
      console.error('❌ AuthViewModel: Token refresh failed:', error);
      
      // If token refresh fails, logout user
      await this.logout();
      throw error;
    }
  }
  
  // Private helper methods
  private async loadUserProfile(): Promise<void> {
    try {
      await useUserStore.getState().loadProfile();
      console.log('✅ AuthViewModel: User profile loaded');
      
    } catch (error) {
      console.warn('⚠️ AuthViewModel: Failed to load user profile:', error);
      // Don't throw - user is still authenticated even if profile load fails
    }
  }
  
  private async setupInitialProfile(registrationData: RegisterData): Promise<void> {
    try {
      // Load profile first
      await this.loadUserProfile();
      
      // Update profile with registration data if provided
      if (registrationData.firstName || registrationData.lastName) {
        const userStore = useUserStore.getState();
        const currentUser = userStore.current;
        
        if (currentUser) {
          // This would update the user profile with additional data
          console.log('📝 AuthViewModel: Updating initial profile data');
        }
      }
      
    } catch (error) {
      console.warn('⚠️ AuthViewModel: Failed to setup initial profile:', error);
      // Don't throw - registration was still successful
    }
  }
  
    // CRM-35: Enhanced email verification navigation
  private async handleEmailVerificationRequired(): Promise<void> {
      const userStore = useUserStore.getState();
      const userEmail = userStore.current?.email;

      console.log('📧 AuthViewModel: Email verification required', { email: userEmail });
    
    // This will be integrated when NavigationService is available
    // NavigationService.navigate('VerifyEmail', {
      //   email: userEmail
    // });
    
      // For now, emit navigation intent that can be captured by UI
      console.log('📱 AuthViewModel: Navigation intent - VerifyEmail', { email: userEmail });

      // Store the navigation intent in auth store for UI consumption
      const authStore = useAuthStore.getState();
      (authStore as any).navigationIntent = {
          target: 'VerifyEmail',
          params: { email: userEmail }
      };
  }
  
  private async handlePostLoginNavigation(): Promise<void> {
    console.log('🧭 AuthViewModel: Handling post-login navigation');
    
    const userStore = useUserStore.getState();
    const profile = userStore.profile;
    
    // Determine where to navigate based on user state
    if (!profile) {
      // New user - go to onboarding
      // NavigationService.navigate('OnboardingStack');
      console.log('📱 Should navigate to onboarding');
    } else {
      // Existing user - go to main app
      // NavigationService.navigate('TabStack');
      console.log('📱 Should navigate to main app');
    }
  }
  
  private async handlePostLogoutCleanup(): Promise<void> {
    console.log('🧹 AuthViewModel: Performing post-logout cleanup');
    
    // Clear any app-wide cached data
    // await CacheService.clearUserData();
    
    // Reset any background tasks
    // BackgroundTaskService.cancelUserTasks();
    
    // Clear any stored credentials
    // await CredentialStorage.clear();
    
    console.log('✅ AuthViewModel: Post-logout cleanup complete');
  }
  
    // CRM-35: Enhanced error handling for AuthService errors
    private handleRegistrationError(error: ServiceAuthError): void {
        console.error('🚨 AuthViewModel: Handling registration error', {
            code: error.code,
            message: error.message,
            field: error.field
        });

        // Set the error message in the auth store for UI display
        const authStore = useAuthStore.getState();

        switch (error.code) {
            case 'DUPLICATE_EMAIL':
                // Field-specific error for email
                (authStore as any).error = error.message;
                console.log('📧 AuthViewModel: Duplicate email error - suggest login flow');
                break;

            case 'WEAK_PASSWORD':
                // Field-specific error for password
                (authStore as any).error = error.message;
                console.log('🔒 AuthViewModel: Weak password error - show password requirements');
                break;

            case 'NETWORK_ERROR':
                // General retry message for network issues
                (authStore as any).error = error.message;
                console.log('🌐 AuthViewModel: Network error - suggest retry');
                break;

            case 'VALIDATION_ERROR':
                // Validation errors - usually field-specific
                (authStore as any).error = error.message;
                console.log('✅ AuthViewModel: Validation error - highlight field');
                break;

            default:
                // Generic fallback error message
                (authStore as any).error = error.message || 'Registration failed. Please try again.';
                console.log('❓ AuthViewModel: Unknown error - show generic message');
        }

        // Also use the error service for consistent error handling
        Services.handleError(error, 'auth.register');
    }

  private handleAuthError(error: Error, context: string): void {
    // Use the error service for consistent error handling
    Services.handleError(error, `auth.${context}`);
  }
  
  // Public getters for UI state
  get isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated;
  }
  
  get isLoading(): boolean {
    return useAuthStore.getState().isLoading || useUserStore.getState().isLoading;
  }
  
  get error(): string | null {
    return useAuthStore.getState().error || useUserStore.getState().error;
  }
  
  get verificationStatus(): string {
    return useAuthStore.getState().verificationStatus;
  }
  
  get currentUser(): any {
    return useUserStore.getState().current;
  }
  
  // Actions for UI
  clearError(): void {
    useAuthStore.getState().clearError();
    useUserStore.getState().clearError();
  }
  
  // Auto-refresh token before expiry (if token service is available)
  startTokenRefreshTimer(): void {
    // This would start a timer to refresh token before expiry
    console.log('🔄 AuthViewModel: Token refresh timer started');
    
    // Implementation would check token expiry and refresh automatically
    // setInterval(() => {
    //   const token = useAuthStore.getState().token;
    //   if (token && this.isTokenNearExpiry(token)) {
    //     this.refreshAuthToken();
    //   }
    // }, 60000); // Check every minute
  }
  
  stopTokenRefreshTimer(): void {
    // This would stop the token refresh timer
    console.log('⏹️ AuthViewModel: Token refresh timer stopped');
  }
}

// Export singleton instance
export const authViewModel = new AuthViewModel();
export default authViewModel;
