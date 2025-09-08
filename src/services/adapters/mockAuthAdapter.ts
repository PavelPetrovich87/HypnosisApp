// Mock Auth Adapter - Provides realistic mock behavior for development
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
  AUTH_ERROR_MESSAGES
} from '../types/auth.types';

// Mock user database for development
const MOCK_USERS = new Map<string, any>();

// Mock existing users for testing duplicate email scenario
MOCK_USERS.set('existing@example.com', {
  id: 'user-existing',
  email: 'existing@example.com',
  password: 'password123',
  firstName: 'Existing',
  lastName: 'User',
  emailVerified: true
});

export class MockAuthAdapter implements AuthService {
  private simulateNetworkDelay(): Promise<void> {
    // Simulate realistic network delay (500ms - 2000ms)
    const delay = Math.random() * 1500 + 500;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private generateUserId(): string {
    return 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  private generateToken(): string {
    return 'mock-jwt-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePassword(password: string): { isValid: boolean; reason?: string } {
    if (password.length < 8) {
      return { isValid: false, reason: 'Password must be at least 8 characters long' };
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return { 
        isValid: false, 
        reason: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
      };
    }
    
    return { isValid: true };
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    console.log('🔧 MockAuthAdapter: Processing registration request', { email: request.email });
    
    // Simulate network delay
    await this.simulateNetworkDelay();
    
    // Validate email format
    if (!this.validateEmail(request.email)) {
      throw new AuthError(
        'VALIDATION_ERROR',
        'Please enter a valid email address',
        'email'
      );
    }
    
    // Check for duplicate email
    if (MOCK_USERS.has(request.email.toLowerCase())) {
      console.log('❌ MockAuthAdapter: Email already exists', request.email);
      throw new AuthError(
        'DUPLICATE_EMAIL',
        AUTH_ERROR_MESSAGES.DUPLICATE_EMAIL,
        'email'
      );
    }
    
    // Validate password strength
    const passwordValidation = this.validatePassword(request.password);
    if (!passwordValidation.isValid) {
      throw new AuthError(
        'WEAK_PASSWORD',
        passwordValidation.reason || AUTH_ERROR_MESSAGES.WEAK_PASSWORD,
        'password'
      );
    }
    
    // Simulate occasional network errors for testing (5% chance)
    if (Math.random() < 0.05) {
      throw new AuthError(
        'NETWORK_ERROR',
        AUTH_ERROR_MESSAGES.NETWORK_ERROR,
        'general'
      );
    }
    
    // Create new user
    const userId = this.generateUserId();
    const token = this.generateToken();
    
    const newUser = {
      id: userId,
      email: request.email.toLowerCase(),
      password: request.password, // In real implementation, this would be hashed
      firstName: request.firstName,
      lastName: request.lastName,
      emailVerified: false, // New users need email verification
      voicePreference: request.voicePreference,
      createdAt: new Date().toISOString()
    };
    
    // Store in mock database
    MOCK_USERS.set(request.email.toLowerCase(), newUser);
    
    console.log('✅ MockAuthAdapter: Registration successful', { userId, email: request.email });
    
    return {
      token,
      user: {
        id: userId,
        email: request.email.toLowerCase(),
        firstName: request.firstName,
        lastName: request.lastName,
        emailVerified: false
      },
      requiresVerification: true
    };
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    console.log('🔧 MockAuthAdapter: Processing login request', { email: request.email });
    
    // Simulate network delay
    await this.simulateNetworkDelay();
    
    // Validate email format
    if (!this.validateEmail(request.email)) {
      throw new AuthError(
        'VALIDATION_ERROR',
        'Please enter a valid email address',
        'email'
      );
    }
    
    // Check if user exists
    const user = MOCK_USERS.get(request.email.toLowerCase());
    if (!user) {
      console.log('❌ MockAuthAdapter: User not found', request.email);
      throw new AuthError(
        'USER_NOT_FOUND',
        AUTH_ERROR_MESSAGES.USER_NOT_FOUND,
        'email'
      );
    }
    
    // Validate password
    if (user.password !== request.password) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
        'password'
      );
    }
    
    // Generate new token
    const token = this.generateToken();
    
    console.log('✅ MockAuthAdapter: Login successful', { userId: user.id, email: request.email });
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified
      }
    };
  }

  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    console.log('🔧 MockAuthAdapter: Processing token refresh');
    
    // Simulate network delay
    await this.simulateNetworkDelay();
    
    // Simulate occasional token refresh failures (10% chance)
    if (Math.random() < 0.10) {
      throw new AuthError(
        'TOKEN_EXPIRED',
        AUTH_ERROR_MESSAGES.TOKEN_EXPIRED,
        'general'
      );
    }
    
    // Generate new tokens
    const newToken = this.generateToken();
    const newRefreshToken = 'refresh-' + this.generateToken();
    
    console.log('✅ MockAuthAdapter: Token refresh successful');
    
    return {
      token: newToken,
      refreshToken: newRefreshToken
    };
  }

  async verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    console.log('🔧 MockAuthAdapter: Processing email verification', { email: request.email });
    
    // Simulate network delay
    await this.simulateNetworkDelay();
    
    // Check if user exists
    const user = MOCK_USERS.get(request.email.toLowerCase());
    if (!user) {
      throw new AuthError(
        'USER_NOT_FOUND',
        AUTH_ERROR_MESSAGES.USER_NOT_FOUND,
        'email'
      );
    }
    
    // Simulate verification token validation (accept any 6-digit token for demo)
    if (!/^\d{6}$/.test(request.verificationToken)) {
      throw new AuthError(
        'TOKEN_INVALID',
        'Please enter a valid 6-digit verification code',
        'verificationToken'
      );
    }
    
    // Update user's email verification status
    user.emailVerified = true;
    MOCK_USERS.set(request.email.toLowerCase(), user);
    
    console.log('✅ MockAuthAdapter: Email verification successful', { email: request.email });
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        emailVerified: true
      }
    };
  }

  async logout(): Promise<void> {
    console.log('🔧 MockAuthAdapter: Processing logout');
    
    // Simulate network delay
    await this.simulateNetworkDelay();
    
    // In a real implementation, this would invalidate the token on the server
    // For mock, we just simulate the delay
    
    console.log('✅ MockAuthAdapter: Logout successful');
  }

  // Development utilities
  getMockUsers(): Map<string, any> {
    return MOCK_USERS;
  }

  addMockUser(email: string, userData: any): void {
    MOCK_USERS.set(email.toLowerCase(), userData);
  }

  clearMockUsers(): void {
    MOCK_USERS.clear();
    // Re-add the default existing user
    MOCK_USERS.set('existing@example.com', {
      id: 'user-existing',
      email: 'existing@example.com',
      password: 'password123',
      firstName: 'Existing',
      lastName: 'User',
      emailVerified: true
    });
  }
}
