// AuthService Implementation - Main service for authentication operations
// CRM-35: Backend Registration Integration with AuthService

import {
  AuthService,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  AuthError,
  AuthServiceConfig,
  AUTH_ERROR_MESSAGES
} from './types/auth.types';

import { MockAuthAdapter } from './adapters/mockAuthAdapter';
import NetworkService from './networkService';

export class AuthServiceImpl implements AuthService {
  private adapter: AuthService;
  private config: AuthServiceConfig;

  constructor(config: AuthServiceConfig = {}) {
    this.config = {
      enableMockMode: true, // Default to mock mode for development
      timeout: 10000,
      ...config
    };

    // Initialize with mock adapter for development
    // In production, this would be replaced with real HTTP adapter
    this.adapter = new MockAuthAdapter();
    
    console.log('🚀 AuthService initialized:', { 
      mockMode: this.config.enableMockMode,
      timeout: this.config.timeout 
    });
  }

  /**
   * Register a new user
   */
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    console.log('🔐 AuthService: Starting registration', { email: request.email });
    
    try {
      // Input validation
      this.validateRegisterRequest(request);
      
      // Call adapter (mock or real)
      const response = await this.adapter.register(request);
      
      console.log('✅ AuthService: Registration successful', { 
        userId: response.user.id, 
        email: response.user.email,
        requiresVerification: response.requiresVerification
      });
      
      return response;
      
    } catch (error) {
      console.error('❌ AuthService: Registration failed', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Login user
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    console.log('🔐 AuthService: Starting login', { email: request.email });
    
    try {
      // Input validation
      this.validateLoginRequest(request);
      
      // Call adapter
      const response = await this.adapter.login(request);
      
      console.log('✅ AuthService: Login successful', { 
        userId: response.user.id, 
        email: response.user.email 
      });
      
      return response;
      
    } catch (error) {
      console.error('❌ AuthService: Login failed', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    console.log('🔄 AuthService: Refreshing token');
    
    try {
      if (!request.refreshToken) {
        throw new AuthError(
          'VALIDATION_ERROR',
          'Refresh token is required',
          'general'
        );
      }
      
      const response = await this.adapter.refreshToken(request);
      
      console.log('✅ AuthService: Token refresh successful');
      return response;
      
    } catch (error) {
      console.error('❌ AuthService: Token refresh failed', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Verify user email
   */
  async verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    console.log('📧 AuthService: Verifying email', { email: request.email });
    
    try {
      // Input validation
      if (!request.email || !request.verificationToken) {
        throw new AuthError(
          'VALIDATION_ERROR',
          'Email and verification token are required',
          'general'
        );
      }
      
      const response = await this.adapter.verifyEmail(request);
      
      console.log('✅ AuthService: Email verification successful', { email: request.email });
      return response;
      
    } catch (error) {
      console.error('❌ AuthService: Email verification failed', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    console.log('👋 AuthService: Logging out');
    
    try {
      await this.adapter.logout();
      console.log('✅ AuthService: Logout successful');
      
    } catch (error) {
      console.error('❌ AuthService: Logout failed', error);
      throw this.normalizeError(error);
    }
  }

  // Private validation methods
  private validateRegisterRequest(request: RegisterRequest): void {
    const errors: string[] = [];
    
    if (!request.email?.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(request.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!request.password) {
      errors.push('Password is required');
    } else if (request.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (errors.length > 0) {
      throw new AuthError(
        'VALIDATION_ERROR',
        errors.join(', '),
        'general'
      );
    }
  }

  private validateLoginRequest(request: LoginRequest): void {
    const errors: string[] = [];
    
    if (!request.email?.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(request.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!request.password) {
      errors.push('Password is required');
    }
    
    if (errors.length > 0) {
      throw new AuthError(
        'VALIDATION_ERROR',
        errors.join(', '),
        'general'
      );
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Normalize different types of errors into AuthError instances
   */
  private normalizeError(error: any): AuthError {
    // If it's already an AuthError, return as-is
    if (error instanceof AuthError) {
      return error;
    }
    
    // Check for network-related errors
    if (error.message?.includes('network') || 
        error.message?.includes('connection') ||
        error.message?.includes('timeout') ||
        error.code === 'NETWORK_ERROR') {
      return new AuthError(
        'NETWORK_ERROR',
        AUTH_ERROR_MESSAGES.NETWORK_ERROR,
        'general',
        error
      );
    }
    
    // Check for validation errors
    if (error.message?.includes('validation') || 
        error.code === 'VALIDATION_ERROR') {
      return new AuthError(
        'VALIDATION_ERROR',
        error.message || AUTH_ERROR_MESSAGES.VALIDATION_ERROR,
        'general',
        error
      );
    }
    
    // Check for specific error patterns
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('duplicate') || message.includes('already exists')) {
      return new AuthError(
        'DUPLICATE_EMAIL',
        AUTH_ERROR_MESSAGES.DUPLICATE_EMAIL,
        'email',
        error
      );
    }
    
    if (message.includes('password') && message.includes('weak')) {
      return new AuthError(
        'WEAK_PASSWORD',
        AUTH_ERROR_MESSAGES.WEAK_PASSWORD,
        'password',
        error
      );
    }
    
    if (message.includes('invalid credentials') || 
        message.includes('wrong password')) {
      return new AuthError(
        'INVALID_CREDENTIALS',
        AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
        'password',
        error
      );
    }
    
    if (message.includes('user not found') || 
        message.includes('no account found')) {
      return new AuthError(
        'USER_NOT_FOUND',
        AUTH_ERROR_MESSAGES.USER_NOT_FOUND,
        'email',
        error
      );
    }
    
    if (message.includes('token expired')) {
      return new AuthError(
        'TOKEN_EXPIRED',
        AUTH_ERROR_MESSAGES.TOKEN_EXPIRED,
        'general',
        error
      );
    }
    
    if (message.includes('token invalid')) {
      return new AuthError(
        'TOKEN_INVALID',
        AUTH_ERROR_MESSAGES.TOKEN_INVALID,
        'general',
        error
      );
    }
    
    // Default to unknown error
    return new AuthError(
      'UNKNOWN_ERROR',
      AUTH_ERROR_MESSAGES.UNKNOWN_ERROR,
      'general',
      error
    );
  }

  // Configuration methods for dependency injection
  setAdapter(adapter: AuthService): void {
    this.adapter = adapter;
    console.log('🔧 AuthService: Adapter updated');
  }

  getConfig(): AuthServiceConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<AuthServiceConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('⚙️ AuthService: Configuration updated', this.config);
  }

  // Development utilities
  getMockAdapter(): MockAuthAdapter | null {
    return this.adapter instanceof MockAuthAdapter ? this.adapter : null;
  }

  isInMockMode(): boolean {
    return this.config.enableMockMode === true;
  }
}

// Export singleton instance for easy use throughout the app
export const authService = new AuthServiceImpl();

// Export class for testing and custom configurations
export default authService;
