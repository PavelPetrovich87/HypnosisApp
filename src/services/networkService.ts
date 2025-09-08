// Network Service - Network connectivity and offline management
// Following creative phase specifications for network resilience
// CRM-35: Fixed for React Native compatibility

import { ErrorService, NetworkError, OfflineError } from './errorService';

// React Native NetInfo would be imported here in a real implementation
// For now, we'll use a fallback approach without external dependencies
let NetInfo: any = null;

// Note: In a real React Native app, you would install and import:
// import NetInfo from '@react-native-netinfo/netinfo';
// For this implementation, we'll use a simple fallback approach

// Types
export interface OfflineOperation {
  id: string;
  type: OfflineOperationType;
  data: any;
  timestamp: Date;
  retries: number;
  maxRetries: number;
  priority: OperationPriority;
  context: string;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export type OfflineOperationType = 
  | 'CREATE_SESSION'
  | 'UPDATE_PROFILE' 
  | 'UPDATE_PREFERENCES'
  | 'RATE_SESSION'
  | 'TOGGLE_FAVORITE'
  | 'DOWNLOAD_AUDIO'
  | 'SYNC_STATISTICS'
  | 'UPLOAD_DATA';

export type OperationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface NetworkStatusInfo {
  isOnline: boolean;
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  exponentialBase: number;
  jitter: boolean;
}

// Default retry configuration
const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  exponentialBase: 2,
  jitter: true
};

// Offline operations queue
class OperationQueue {
  private operations: Map<string, OfflineOperation> = new Map();
  private isProcessing = false;
  
  add(operation: OfflineOperation): void {
    this.operations.set(operation.id, operation);
    console.log(`📥 Queued ${operation.type} operation:`, operation.id);
  }
  
  remove(operationId: string): void {
    this.operations.delete(operationId);
  }
  
  getOperations(): OfflineOperation[] {
    return Array.from(this.operations.values())
      .sort((a, b) => {
        // Sort by priority (critical first) then by timestamp (oldest first)
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.timestamp.getTime() - b.timestamp.getTime();
      });
  }
  
  clear(): void {
    this.operations.clear();
  }
  
  hasOperations(): boolean {
    return this.operations.size > 0;
  }
  
  size(): number {
    return this.operations.size;
  }
  
  setProcessing(processing: boolean): void {
    this.isProcessing = processing;
  }
  
  getProcessingStatus(): boolean {
    return this.isProcessing;
  }
}

// Main Network Service
export class NetworkService {
  private static instance: NetworkService;
  private static operationQueue: OperationQueue = new OperationQueue();
  private static listeners: ((status: NetworkStatusInfo) => void)[] = [];
  private static currentStatus: NetworkStatusInfo = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
  };
  
  // Initialize network service - React Native compatible
  static initialize(): void {
    console.log('🌐 NetworkService.initialize() called');
    console.log('🔍 Environment check:', {
      hasWindow: typeof window !== 'undefined',
      hasGlobal: typeof global !== 'undefined',
      hasNavigator: typeof navigator !== 'undefined'
    });

    // Check if we're in React Native environment
    if (typeof window === 'undefined' && typeof global !== 'undefined') {
      // React Native environment
      console.log('📱 Detected React Native environment');
      this.initializeReactNative();
    } else if (typeof window !== 'undefined') {
      // Web environment
      console.log('🌐 Detected Web environment');
      this.initializeWeb();
    } else {
      // Fallback for other environments
      console.log('🌐 NetworkService: Using fallback initialization');
    }

    console.log('✅ NetworkService initialized');
  }

  // React Native initialization
  private static initializeReactNative(): void {
    console.log('📱 NetworkService: Initializing for React Native');

    // For now, assume we're online in React Native
    // TODO: In a real implementation, install and use @react-native-netinfo/netinfo:
    // 
    // npm install @react-native-netinfo/netinfo
    // 
    // Then use:
    // const unsubscribe = NetInfo.addEventListener(state => {
    //   this.currentStatus.isOnline = state.isConnected;
    //   this.notifyListeners();
    // });

    this.currentStatus.isOnline = true;

    // Simulate network status updates for development
    setInterval(() => {
      this.updateNetworkStatus();
    }, 30000); // Check every 30 seconds
  }

  // Web initialization  
  private static initializeWeb(): void {
    console.log('🌐 NetworkService: Initializing for Web');

    // Safety check for window APIs
    if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') {
      console.error('❌ NetworkService: window.addEventListener not available in web initialization');
      return;
    }
    
    // Listen to online/offline events
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    
    // Listen to network connection changes (if supported)
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', this.handleConnectionChange);
      this.updateNetworkInfo();
    }
  }
  
  // Network status monitoring
  static getCurrentStatus(): NetworkStatusInfo {
    return { ...this.currentStatus };
  }
  
  static isOnline(): boolean {
    return this.currentStatus.isOnline;
  }
  
  static isOffline(): boolean {
    return !this.currentStatus.isOnline;
  }
  
  // Network status change listeners
  static onNetworkStatusChange(callback: (status: NetworkStatusInfo) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  private static notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getCurrentStatus());
      } catch (error) {
        console.error('Network listener error:', error);
      }
    });
  }
  
  // Network event handlers
  private static handleOnline = (): void => {
    console.log('🟢 Network: Back online');
    this.currentStatus.isOnline = true;
    this.updateNetworkInfo();
    this.notifyListeners();
    
    // Process offline queue
    if (this.operationQueue.hasOperations()) {
      this.processOfflineQueue();
    }
  };
  
  private static handleOffline = (): void => {
    console.log('🔴 Network: Gone offline');
    this.currentStatus.isOnline = false;
    this.notifyListeners();
  };
  
  private static handleConnectionChange = (): void => {
    this.updateNetworkInfo();
    this.notifyListeners();
  };
  
  private static updateNetworkInfo(): void {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) return;
    
    const connection = (navigator as any).connection;
    
    this.currentStatus = {
      isOnline: navigator.onLine,
      connectionType: connection.type,
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  
  // Retry mechanism with exponential backoff
  static async withRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const retryConfig = { ...defaultRetryConfig, ...config };
    let lastError: Error;
    
    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on final attempt
        if (attempt === retryConfig.maxRetries) {
          break;
        }
        
        // Don't retry if we're offline
        if (this.isOffline()) {
          throw new OfflineError('Cannot retry operation while offline', false);
        }
        
        // Calculate delay with exponential backoff
        let delay = retryConfig.baseDelay * Math.pow(retryConfig.exponentialBase, attempt);
        
        // Cap the delay
        delay = Math.min(delay, retryConfig.maxDelay);
        
        // Add jitter to prevent thundering herd
        if (retryConfig.jitter) {
          delay += Math.random() * 1000;
        }
        
        console.log(`🔄 Retrying operation in ${delay}ms (attempt ${attempt + 1}/${retryConfig.maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
  
  // Offline operation queue management
  static queueOfflineOperation(operation: Omit<OfflineOperation, 'id' | 'retries'>): string {
    const operationWithId: OfflineOperation = {
      ...operation,
      id: `offline_op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      retries: 0
    };
    
    this.operationQueue.add(operationWithId);
    
    // Show user feedback
    console.log(`📴 Operation queued for when online: ${operation.type}`);
    
    // This will be integrated when UI feedback is available
    // ToastService.show(`Operation queued for when online`, 'info');
    
    return operationWithId.id;
  }
  
  static removeQueuedOperation(operationId: string): void {
    this.operationQueue.remove(operationId);
  }
  
  static getQueuedOperations(): OfflineOperation[] {
    return this.operationQueue.getOperations();
  }
  
  static clearOfflineQueue(): void {
    this.operationQueue.clear();
  }
  
  // Process offline queue when back online
  static async processOfflineQueue(): Promise<void> {
    if (this.isOffline()) {
      console.warn('Cannot process offline queue while offline');
      return;
    }
    
    if (this.operationQueue.getProcessingStatus()) {
      console.log('Offline queue already being processed');
      return;
    }
    
    const operations = this.operationQueue.getOperations();
    if (operations.length === 0) {
      console.log('No offline operations to process');
      return;
    }
    
    console.log(`🔄 Processing ${operations.length} offline operations`);
    this.operationQueue.setProcessing(true);
    
    const results = {
      successful: 0,
      failed: 0,
      total: operations.length
    };
    
    // Process operations sequentially to avoid overwhelming the server
    for (const operation of operations) {
      try {
        await this.executeOfflineOperation(operation);
        this.operationQueue.remove(operation.id);
        results.successful++;
        
        // Call success callback if provided
        if (operation.onSuccess) {
          operation.onSuccess(null);
        }
        
      } catch (error) {
        console.error(`Failed to execute offline operation ${operation.id}:`, error);
        
        // Increment retry count
        operation.retries++;
        
        if (operation.retries >= operation.maxRetries) {
          // Remove operation after max retries
          this.operationQueue.remove(operation.id);
          results.failed++;
          
          // Call error callback if provided
          if (operation.onError) {
            operation.onError(error as Error);
          }
          
          // Report persistent failure
          ErrorService.handleError(
            error as Error, 
            `offline_operation.${operation.type}`, 
            { 
              report: true, 
              showUser: operation.priority === 'critical',
              severity: operation.priority === 'critical' ? 'high' : 'medium'
            }
          );
        }
      }
    }
    
    this.operationQueue.setProcessing(false);
    
    console.log(`✅ Offline queue processing complete: ${results.successful} successful, ${results.failed} failed`);
    
    // Show user feedback
    if (results.successful > 0) {
      console.log(`📱 ${results.successful} queued operations completed`);
      // ToastService.show(`${results.successful} queued operations completed`, 'success');
    }
    
    if (results.failed > 0) {
      console.warn(`📱 ${results.failed} operations failed and were discarded`);
      // ToastService.show(`${results.failed} operations failed`, 'warning');
    }
  }
  
  // Execute individual offline operation
  private static async executeOfflineOperation(operation: OfflineOperation): Promise<any> {
    console.log(`🔄 Executing offline operation: ${operation.type}`);
    
    // This is where we would call the appropriate service method
    // For now, we'll simulate the operation
    
    switch (operation.type) {
      case 'CREATE_SESSION':
        // return await sessionService.create(operation.data);
        console.log('📝 Simulated session creation:', operation.data);
        return { id: 'created', success: true };
        
      case 'UPDATE_PROFILE':
        // return await userService.updateProfile(operation.data);
        console.log('👤 Simulated profile update:', operation.data);
        return { success: true };
        
      case 'UPDATE_PREFERENCES':
        // return await userService.updatePreferences(operation.data);
        console.log('⚙️ Simulated preferences update:', operation.data);
        return { success: true };
        
      case 'RATE_SESSION':
        // return await sessionService.rateSession(operation.data.sessionId, operation.data.rating);
        console.log('⭐ Simulated session rating:', operation.data);
        return { success: true };
        
      case 'TOGGLE_FAVORITE':
        // return await sessionService.toggleFavorite(operation.data.sessionId);
        console.log('❤️ Simulated favorite toggle:', operation.data);
        return { success: true };
        
      case 'DOWNLOAD_AUDIO':
        // return await storageService.downloadAudio(operation.data.sessionId);
        console.log('🎵 Simulated audio download:', operation.data);
        return { success: true };
        
      case 'SYNC_STATISTICS':
        // return await userService.syncStatistics(operation.data);
        console.log('📊 Simulated statistics sync:', operation.data);
        return { success: true };
        
      case 'UPLOAD_DATA':
        // return await apiService.uploadData(operation.data);
        console.log('📤 Simulated data upload:', operation.data);
        return { success: true };
        
      default:
        throw new Error(`Unknown offline operation type: ${operation.type}`);
    }
  }
  
  // Network request wrapper with automatic retry and offline handling
  static async request<T>(
    requestFn: () => Promise<T>,
    options: {
      context: string;
      allowOfflineQueue?: boolean;
      offlineOperationType?: OfflineOperationType;
      offlineOperationData?: any;
      priority?: OperationPriority;
      retryConfig?: Partial<RetryConfig>;
    }
  ): Promise<T> {
    // Check if offline and should queue
    if (this.isOffline() && options.allowOfflineQueue && options.offlineOperationType) {
      this.queueOfflineOperation({
        type: options.offlineOperationType,
        data: options.offlineOperationData || {},
        timestamp: new Date(),
        maxRetries: 3,
        priority: options.priority || 'medium',
        context: options.context
      });
      
      throw new OfflineError('Operation queued for when online', true);
    }
    
    // If offline and can't queue, throw offline error
    if (this.isOffline()) {
      throw new OfflineError('No internet connection available');
    }
    
    try {
      // Execute with retry logic
      return await this.withRetry(requestFn, options.retryConfig);
      
    } catch (error) {
      const networkError = new NetworkError(
        `Network request failed: ${error.message}`,
        'NETWORK_REQUEST_FAILED'
      );
      
      ErrorService.handleError(networkError, options.context, {
        showUser: true,
        report: true,
        retry: true
      });
      
      throw networkError;
    }
  }
  
  // Connection quality assessment
  static getConnectionQuality(): 'excellent' | 'good' | 'fair' | 'poor' | 'offline' {
    if (this.isOffline()) {
      return 'offline';
    }
    
    const status = this.getCurrentStatus();
    
    // If we don't have detailed connection info, assume good
    if (!status.effectiveType) {
      return 'good';
    }
    
    switch (status.effectiveType) {
      case '4g':
        return 'excellent';
      case '3g':
        return 'good';
      case '2g':
        return 'fair';
      case 'slow-2g':
        return 'poor';
      default:
        return 'good';
    }
  }
  
  // Bandwidth-aware operations
  static shouldPreloadContent(): boolean {
    const quality = this.getConnectionQuality();
    const status = this.getCurrentStatus();
    
    // Don't preload on limited connections or when save data is enabled
    if (status.saveData || quality === 'poor' || quality === 'fair') {
      return false;
    }
    
    return true;
  }
  
  static shouldDownloadHighQualityAudio(): boolean {
    const quality = this.getConnectionQuality();
    return quality === 'excellent' || quality === 'good';
  }
  
  // Cleanup - React Native compatible
  static cleanup(): void {
    if (typeof window !== 'undefined') {
      // Web environment cleanup
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);

      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connection.removeEventListener('change', this.handleConnectionChange);
      }
    }
    
    // Clear any intervals or listeners
    this.listeners.length = 0;
    console.log('🌐 NetworkService cleaned up');
  }

  // Update network status for React Native
  private static updateNetworkStatus(): void {
    // In a real implementation, this would check actual network status
    // For now, we'll assume online status
    const wasOnline = this.currentStatus.isOnline;

    // Simulate occasional network changes for testing
    if (Math.random() < 0.05) { // 5% chance of status change
      this.currentStatus.isOnline = !this.currentStatus.isOnline;

      if (wasOnline !== this.currentStatus.isOnline) {
        console.log(`📱 Network status changed: ${this.currentStatus.isOnline ? 'online' : 'offline'}`);

        // Notify listeners
        this.notifyListeners();
      }
    }
  }


}

// Initialize on import - React Native compatible
// CRM-35: Fixed for React Native compatibility - Only initialize in web environment
if (typeof window !== 'undefined') {
  // Only auto-initialize in web environment
  NetworkService.initialize();
}
// React Native initialization will be handled by ServiceManager

export default NetworkService;
