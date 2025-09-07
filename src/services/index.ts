// Services Layer - Clean exports and initialization
// Following MVVM architecture from creative phase specifications

// Core services
export { default as ErrorService } from './errorService';
export { default as NetworkService } from './networkService';

// Import for internal usage
import ErrorService from './errorService';
import NetworkService from './networkService';

// Error types and utilities
export type {
  ErrorContext,
  ErrorOptions,
  ErrorSeverity,
  ErrorHandler
} from './errorService';

export {
  NetworkError,
  AuthError,
  QuotaError,
  VoiceError,
  OfflineError,
  RateLimitError,
  withErrorHandling
} from './errorService';

// Network types and utilities
export type {
  OfflineOperation,
  OfflineOperationType,
  OperationPriority,
  NetworkStatusInfo,
  RetryConfig
} from './networkService';

// Service initialization and management
export interface ServiceConfiguration {
  errorService: {
    enabled: boolean;
    reportErrors: boolean;
    showUserErrors: boolean;
  };
  networkService: {
    enabled: boolean;
    offlineQueueEnabled: boolean;
    retryAttempts: number;
  };
}

const defaultServiceConfig: ServiceConfiguration = {
  errorService: {
    enabled: true,
    reportErrors: false, // Set to true in production
    showUserErrors: true
  },
  networkService: {
    enabled: true,
    offlineQueueEnabled: true,
    retryAttempts: 3
  }
};

// Service manager for initialization and lifecycle
export class ServiceManager {
  private static initialized = false;
  private static config: ServiceConfiguration = defaultServiceConfig;
  
  // Initialize all services
  static async initialize(config?: Partial<ServiceConfiguration>): Promise<void> {
    if (this.initialized) {
      console.warn('⚠️ ServiceManager already initialized');
      return;
    }
    
    // Merge configuration
    this.config = { ...defaultServiceConfig, ...config };
    
    try {
      console.log('🚀 Initializing ServiceManager...');
      
      // Initialize ErrorService (already auto-initialized)
      if (this.config.errorService.enabled) {
        console.log('✅ ErrorService ready');
      }
      
      // Initialize NetworkService (already auto-initialized)
      if (this.config.networkService.enabled) {
        console.log('✅ NetworkService ready');
      }
      
      // Additional services will be initialized here when created
      // if (this.config.authService.enabled) {
      //   await AuthService.initialize();
      //   console.log('✅ AuthService initialized');
      // }
      
      this.initialized = true;
      console.log('🎉 ServiceManager initialization complete');
      
    } catch (error) {
      console.error('❌ ServiceManager initialization failed:', error);
      throw error;
    }
  }
  
  // Check if services are initialized
  static isInitialized(): boolean {
    return this.initialized;
  }
  
  // Get current configuration
  static getConfiguration(): ServiceConfiguration {
    return { ...this.config };
  }
  
  // Update configuration
  static updateConfiguration(updates: Partial<ServiceConfiguration>): void {
    this.config = { ...this.config, ...updates };
    console.log('⚙️ ServiceManager configuration updated');
  }
  
  // Health check for all services
  static async healthCheck(): Promise<{
    overall: 'healthy' | 'degraded' | 'unhealthy';
    services: {
      errorService: 'healthy' | 'unhealthy';
      networkService: 'healthy' | 'unhealthy';
    };
  }> {
    const results: {
      errorService: 'healthy' | 'unhealthy';
      networkService: 'healthy' | 'unhealthy';
    } = {
      errorService: 'healthy',
      networkService: 'healthy'
    };
    
    try {
      // Check ErrorService
      if (this.config.errorService.enabled) {
        // ErrorService is stateless, so always healthy if enabled
        results.errorService = 'healthy';
      }
      
      // Check NetworkService
      if (this.config.networkService.enabled) {
        const networkStatus = NetworkService.getCurrentStatus();
        // Network service is healthy if we can determine network status
        results.networkService = networkStatus ? 'healthy' : 'unhealthy';
      }
      
    } catch (error) {
      console.error('Health check failed:', error);
      results.errorService = 'unhealthy';
      results.networkService = 'unhealthy';
    }
    
    // Determine overall health
    const healthyServices = Object.values(results).filter(status => status === 'healthy').length;
    const totalServices = Object.keys(results).length;
    
    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyServices === totalServices) {
      overall = 'healthy';
    } else if (healthyServices > 0) {
      overall = 'degraded';
    } else {
      overall = 'unhealthy';
    }
    
    return {
      overall,
      services: results
    };
  }
  
  // Cleanup all services
  static cleanup(): void {
    console.log('🧹 Cleaning up ServiceManager...');
    
    try {
      // Cleanup NetworkService
      if (this.config.networkService.enabled) {
        NetworkService.cleanup();
      }
      
      // Additional service cleanup will go here
      
      this.initialized = false;
      console.log('✅ ServiceManager cleanup complete');
      
    } catch (error) {
      console.error('❌ ServiceManager cleanup failed:', error);
    }
  }
}

// Convenience functions for common service operations
export const Services = {
  // Error handling
  handleError: (error: Error, context: string, options?: Partial<ErrorOptions>) => {
    ErrorService.handleError(error, context, {
      showUser: defaultServiceConfig.errorService.showUserErrors,
      report: defaultServiceConfig.errorService.reportErrors,
      ...options
    });
  },
  
  // Network operations
  isOnline: () => NetworkService.isOnline(),
  isOffline: () => NetworkService.isOffline(),
  getNetworkStatus: () => NetworkService.getCurrentStatus(),
  withRetry: <T>(operation: () => Promise<T>, retries?: number) => 
    NetworkService.withRetry(operation, retries ? { maxRetries: retries } : undefined),
  
  // Queue offline operations
  queueOfflineOperation: (operation: any) =>
    NetworkService.queueOfflineOperation(operation),
  
  // Network-aware request wrapper
  request: <T>(
    requestFn: () => Promise<T>,
    context: string,
    options?: any
  ) => NetworkService.request(requestFn, { context, ...options }),
  
  // Service health and status
  healthCheck: () => ServiceManager.healthCheck(),
  getConnectionQuality: () => NetworkService.getConnectionQuality(),
  shouldPreloadContent: () => NetworkService.shouldPreloadContent()
};

// Auto-initialize services on import (with basic config)
if (typeof window !== 'undefined') {
  ServiceManager.initialize().catch(error => {
    console.error('Failed to auto-initialize ServiceManager:', error);
  });
}

export default Services;
