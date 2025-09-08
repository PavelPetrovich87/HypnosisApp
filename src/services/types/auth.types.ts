// Authentication Type Definitions
// CRM-35: Backend Registration Integration with AuthService

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  voicePreference?: string;
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    emailVerified: boolean;
  };
  requiresVerification: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    emailVerified: boolean;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface VerifyEmailRequest {
  email: string;
  verificationToken: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
  };
}

export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    public message: string,
    public field?: AuthErrorField,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export type AuthErrorCode =
  | 'DUPLICATE_EMAIL'
  | 'WEAK_PASSWORD'
  | 'INVALID_CREDENTIALS'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'EMAIL_NOT_VERIFIED'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'USER_NOT_FOUND'
  | 'UNKNOWN_ERROR';

export type AuthErrorField =
  | 'email'
  | 'password'
  | 'general'
  | 'verificationToken';

export interface AuthServiceConfig {
  baseUrl?: string;
  timeout?: number;
  enableMockMode?: boolean;
}

// Main AuthService interface
export interface AuthService {
  register(request: RegisterRequest): Promise<RegisterResponse>;
  login(request: LoginRequest): Promise<LoginResponse>;
  refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse>;
  verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse>;
  logout(): Promise<void>;
}

// Error message mapping for user-friendly display
export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  DUPLICATE_EMAIL: 'This email is already registered. Please use a different email or try logging in.',
  WEAK_PASSWORD: 'Password must be at least 8 characters long and contain letters and numbers.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please check your credentials and try again.',
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection and try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address before continuing.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  TOKEN_INVALID: 'Invalid session. Please log in again.',
  USER_NOT_FOUND: 'No account found with this email address.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again later.'
};
