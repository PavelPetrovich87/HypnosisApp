// Error Service - Layered Error Handling Implementation
// Following creative phase specifications for comprehensive error management

// Custom Error Classes
export class NetworkError extends Error {
  public readonly code: string;
  public readonly retryAction?: () => Promise<void>;
  public readonly isRetryable: boolean;
  
  constructor(message: string, code: string = 'NETWORK_ERROR', retryAction?: () => Promise<void>) {
    super(message);
    this.name = 'NetworkError';
    this.code = code;
    this.retryAction = retryAction;
    this.isRetryable = !!retryAction;
  }
}

export class AuthError extends Error {
  public readonly code: string;
  public readonly shouldRedirectToLogin: boolean;
  
  constructor(message: string, code: string = 'AUTH_ERROR', shouldRedirect: boolean = true) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.shouldRedirectToLogin = shouldRedirect;
  }
}

export class QuotaError extends Error {
  public readonly code: string;
  public readonly remainingQuota: number;
  public readonly resetTime?: Date;
  
  constructor(message: string, remainingQuota: number = 0, resetTime?: Date) {
    super(message);
    this.name = 'QuotaError';
    this.code = 'QUOTA_EXCEEDED';
    this.remainingQuota = remainingQuota;
    this.resetTime = resetTime;
  }
}

export class VoiceError extends Error {
  public readonly code: string;
  public readonly availableVoices?: string[];
  
  constructor(message: string, availableVoices?: string[]) {
    super(message);
    this.name = 'VoiceError';
    this.code = 'VOICE_ERROR';
    this.availableVoices = availableVoices;
  }
}

export class OfflineError extends Error {
  public readonly code: string;
  public readonly queuedForSync: boolean;
  
  constructor(message: string, queuedForSync: boolean = false) {
    super(message);
    this.name = 'OfflineError';
    this.code = 'OFFLINE_ERROR';
    this.queuedForSync = queuedForSync;
  }
}

export class RateLimitError extends Error {
  public readonly code: string;
  public readonly retryAfter?: number; // seconds
  
  constructor(message: string, retryAfter?: number) {
    super(message);
    this.name = 'RateLimitError';
    this.code = 'RATE_LIMIT';
    this.retryAfter = retryAfter;
  }
}

// Error handling types
export interface ErrorContext {
  component: string;
  action: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface ErrorOptions {
  showUser?: boolean;
  report?: boolean;
  retry?: boolean;
  fallback?: () => void;
  severity?: ErrorSeverity;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorHandler {
  canHandle: (error: Error) => boolean;
  handle: (error: Error, options: ErrorOptions) => void;
  priority: number; // Higher number = higher priority
}

// Context-specific error handlers
class AuthErrorHandler implements ErrorHandler {
  priority = 10;
  
  canHandle(error: Error): boolean {
    return error instanceof AuthError || 
           (error.message && (
             error.message.includes('unauthorized') ||
             error.message.includes('invalid token') ||
             error.message.includes('authentication failed')
           ));
  }
  
  handle(error: Error, options: ErrorOptions): void {
    console.warn('🔐 Auth Error:', error.message);
    
    if (error instanceof AuthError && error.shouldRedirectToLogin) {
      // Clear auth state and redirect to login
      // This will be integrated when NavigationService is available
      // useAuthStore.getState().logout();
      // NavigationService.navigate('Welcome');
    }
    
    if (options.showUser) {
      ErrorService.showUserError(error, {
        title: 'Authentication Required',
        message: 'Please log in to continue',
        actions: ['Login']
      });
    }
  }
}

class NetworkErrorHandler implements ErrorHandler {
  priority = 8;
  
  canHandle(error: Error): boolean {
    return error instanceof NetworkError ||
           (error.message && (
             error.message.includes('network') ||
             error.message.includes('connection') ||
             error.message.includes('timeout') ||
             error.message.includes('fetch')
           ));
  }
  
  handle(error: Error, options: ErrorOptions): void {
    console.warn('📡 Network Error:', error.message);
    
    // Check if device is offline
    const isOffline = !navigator.onLine;
    
    if (isOffline) {
      ErrorService.showOfflineMessage();
      return;
    }
    
    // Handle retryable network errors
    if (error instanceof NetworkError && error.isRetryable && options.retry) {
      ErrorService.showRetryDialog(error.retryAction!);
      return;
    }
    
    if (options.showUser) {
      ErrorService.showUserError(error, {
        title: 'Connection Error',
        message: 'Please check your internet connection and try again',
        actions: options.retry ? ['Retry', 'Cancel'] : ['OK']
      });
    }
  }
}

class QuotaErrorHandler implements ErrorHandler {
  priority = 9;
  
  canHandle(error: Error): boolean {
    return error instanceof QuotaError ||
           (error.message && error.message.includes('quota'));
  }
  
  handle(error: Error, options: ErrorOptions): void {
    console.warn('📊 Quota Error:', error.message);
    
    // Navigate to quota screen
    // This will be integrated when NavigationService is available
    // NavigationService.navigate('Quota', { error: error.message });
    
    if (options.showUser) {
      const quotaError = error as QuotaError;
      ErrorService.showUserError(error, {
        title: 'Usage Limit Reached',
        message: error.message,
        actions: ['Upgrade', 'Learn More'],
        metadata: {
          resetTime: quotaError.resetTime
        }
      });
    }
  }
}

class RateLimitErrorHandler implements ErrorHandler {
  priority = 7;
  
  canHandle(error: Error): boolean {
    return error instanceof RateLimitError ||
           (error.message && error.message.includes('rate limit'));
  }
  
  handle(error: Error, options: ErrorOptions): void {
    console.warn('⏱️ Rate Limit Error:', error.message);
    
    const rateLimitError = error as RateLimitError;
    const retryAfter = rateLimitError.retryAfter || 60;
    
    if (options.showUser) {
      ErrorService.showUserError(error, {
        title: 'Too Many Requests',
        message: `Please wait ${retryAfter} seconds before trying again`,
        actions: ['OK'],
        metadata: {
          retryAfter
        }
      });
    }
    
    // Auto-retry after specified time if retry is enabled
    if (options.retry && rateLimitError.retryAfter) {
      setTimeout(() => {
        // This would trigger a retry mechanism
        console.log('🔄 Auto-retrying after rate limit...');
      }, rateLimitError.retryAfter * 1000);
    }
  }
}

// Main Error Service
export class ErrorService {
  private static contextHandlers: Map<string, ErrorHandler> = new Map();
  private static typeHandlers: ErrorHandler[] = [];
  private static initialized = false;
  
  // Initialize error service with all handlers
  static initialize(): void {
    if (this.initialized) return;
    
    // Register type-based handlers
    this.typeHandlers = [
      new AuthErrorHandler(),
      new NetworkErrorHandler(),
      new QuotaErrorHandler(),
      new RateLimitErrorHandler()
    ].sort((a, b) => b.priority - a.priority); // Sort by priority (highest first)
    
    this.initialized = true;
    console.log('🛡️ ErrorService initialized with', this.typeHandlers.length, 'handlers');
  }
  
  // Main error handling entry point
  static handleError(
    error: Error,
    context: string,
    options: ErrorOptions = {}
  ): void {
    if (!this.initialized) {
      this.initialize();
    }
    
    console.error('❌ Error in', context, ':', error);
    
    // Layer 1: Context-specific handling
    const contextHandler = this.getContextHandler(context);
    if (contextHandler && contextHandler.canHandle(error)) {
      contextHandler.handle(error, options);
      this.logError(error, context, options);
      return;
    }
    
    // Layer 2: Error type handling
    const typeHandler = this.typeHandlers.find(handler => handler.canHandle(error));
    if (typeHandler) {
      typeHandler.handle(error, options);
      this.logError(error, context, options);
      return;
    }
    
    // Layer 3: Global fallback handling
    this.globalErrorHandler(error, context, options);
    this.logError(error, context, options);
  }
  
  // Register context-specific error handlers
  static registerContextHandler(context: string, handler: ErrorHandler): void {
    this.contextHandlers.set(context, handler);
  }
  
  // Get context-specific handler
  private static getContextHandler(context: string): ErrorHandler | undefined {
    return this.contextHandlers.get(context);
  }
  
  // Global error handler (fallback)
  private static globalErrorHandler(
    error: Error,
    context: string,
    options: ErrorOptions
  ): void {
    console.warn('🌐 Global error handler for:', context, error);
    
    // Report error if enabled
    if (options.report) {
      this.reportError(error, context);
    }
    
    // Show user error if enabled
    if (options.showUser) {
      this.showUserError(error, {
        title: 'Something went wrong',
        message: error.message || 'An unexpected error occurred',
        actions: ['OK']
      });
    }
    
    // Execute fallback if provided
    if (options.fallback) {
      try {
        options.fallback();
      } catch (fallbackError) {
        console.error('💥 Fallback function failed:', fallbackError);
      }
    }
  }
  
  // Network-specific error handling
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
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }
        
        // Only retry on network errors
        if (!this.isRetryableError(error as Error)) {
          throw error;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`🔄 Retrying operation in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
  
  // Check if error is retryable
  private static isRetryableError(error: Error): boolean {
    if (error instanceof NetworkError) {
      return error.isRetryable;
    }
    
    if (error instanceof RateLimitError) {
      return false; // Rate limit errors should not be retried immediately
    }
    
    // Check for common retryable network error messages
    const retryableMessages = [
      'network error',
      'connection timeout',
      'request timeout',
      'temporary failure',
      'service unavailable'
    ];
    
    return retryableMessages.some(msg => 
      error.message.toLowerCase().includes(msg)
    );
  }
  
  // User interface error display methods
  static showUserError(error: Error, options: {
    title: string;
    message: string;
    actions: string[];
    metadata?: any;
  }): void {
    // This will be implemented when UI components are available
    console.warn('📱 Show user error:', options.title, '-', options.message);
    
    // For now, just log. Later this will show modals/toasts
    // ToastService.showError(options.title, options.message);
    // or
    // ModalService.showError({
    //   title: options.title,
    //   message: options.message,
    //   actions: options.actions
    // });
  }
  
  static showRetryDialog(retryAction: () => Promise<void>): void {
    console.warn('🔄 Show retry dialog');
    
    // This will be implemented when UI components are available
    // ModalService.showRetry({
    //   title: 'Connection Failed',
    //   message: 'Would you like to try again?',
    //   onRetry: retryAction
    // });
  }
  
  static showOfflineMessage(): void {
    console.warn('📴 Show offline message');
    
    // This will be implemented when UI components are available
    // ToastService.showWarning('You are offline', 'Some features may not be available');
  }
  
  // Error reporting and logging
  private static logError(error: Error, context: string, options: ErrorOptions): void {
    // Enhanced logging for development
    const errorData = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      options,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };
    
    console.group('🐛 Error Log');
    console.error('Error:', errorData);
    console.groupEnd();
    
    // In production, this would send to logging service
    // LoggingService.error(errorData);
  }
  
  private static reportError(error: Error, context: string): void {
    console.warn('📊 Report error to crash reporting service');
    
    // This will be implemented when crash reporting service is available
    // CrashReportingService.report({
    //   error,
    //   context,
    //   userId: useAuthStore.getState().token ? 'authenticated' : 'anonymous',
    //   timestamp: new Date(),
    //   appVersion: '1.0.0'
    // });
  }
  
  // Utility methods
  static createNetworkError(message: string, retryAction?: () => Promise<void>): NetworkError {
    return new NetworkError(message, 'NETWORK_ERROR', retryAction);
  }
  
  static createAuthError(message: string, shouldRedirect: boolean = true): AuthError {
    return new AuthError(message, 'AUTH_ERROR', shouldRedirect);
  }
  
  static createQuotaError(message: string, remaining: number = 0, resetTime?: Date): QuotaError {
    return new QuotaError(message, remaining, resetTime);
  }
  
  static createOfflineError(message: string, queued: boolean = false): OfflineError {
    return new OfflineError(message, queued);
  }
  
  static createRateLimitError(message: string, retryAfter?: number): RateLimitError {
    return new RateLimitError(message, retryAfter);
  }
}

// Initialize on import
ErrorService.initialize();

// Convenience error handling decorators/wrappers
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: string,
  options: ErrorOptions = {}
): T => {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      ErrorService.handleError(error as Error, context, options);
      throw error;
    }
  }) as T;
};

export default ErrorService;
