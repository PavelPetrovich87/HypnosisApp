import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types
export interface AppState {
  // Theme and UI
  theme: ThemeMode;
  colorScheme: ColorScheme;
  fontSize: FontSize;
  
  // Network and connectivity
  networkStatus: NetworkStatus;
  isOffline: boolean;
  lastOnlineTime: Date | null;
  
  // Permissions
  permissions: PermissionState;
  
  // Loading states
  globalLoading: LoadingState;
  
  // Error handling
  globalError: ErrorState;
  
  // Sync and background
  syncStatus: SyncStatus;
  backgroundTaskStatus: BackgroundTaskStatus;
  
  // App lifecycle
  appState: AppLifecycleState;
  isFirstLaunch: boolean;
  lastActiveTime: Date | null;
  
  // Feature flags
  featureFlags: FeatureFlags;
  
  // Notifications
  notificationState: NotificationState;
  
  // Developer/Debug
  isDeveloperMode: boolean;
  debugInfo: DebugInfo;
}

export interface AppActions {
  // Theme and UI
  setTheme: (theme: ThemeMode) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setFontSize: (size: FontSize) => void;
  
  // Network
  setNetworkStatus: (status: NetworkStatus) => void;
  setOfflineMode: (isOffline: boolean) => void;
  updateLastOnlineTime: () => void;
  
  // Permissions
  updatePermissions: (permissions: Partial<PermissionState>) => void;
  
  // Loading states
  setGlobalLoading: (loading: LoadingState) => void;
  clearGlobalLoading: () => void;
  
  // Error handling
  setGlobalError: (error: ErrorState) => void;
  clearGlobalError: () => void;
  addErrorToHistory: (error: ErrorHistoryItem) => void;
  
  // Sync
  setSyncStatus: (status: SyncStatus) => void;
  
  // Background tasks
  setBackgroundTaskStatus: (status: BackgroundTaskStatus) => void;
  
  // App lifecycle
  setAppState: (state: AppLifecycleState) => void;
  updateLastActiveTime: () => void;
  markFirstLaunchComplete: () => void;
  
  // Feature flags
  updateFeatureFlags: (flags: Partial<FeatureFlags>) => void;
  
  // Notifications
  setNotificationState: (state: NotificationState) => void;
  
  // Developer/Debug
  toggleDeveloperMode: () => void;
  updateDebugInfo: (info: Partial<DebugInfo>) => void;
  
  // Utility
  reset: () => void;
  exportAppState: () => AppStateExport;
}

// Enum types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'default' | 'accessibility' | 'colorblind-friendly';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

export type NetworkStatus = 'online' | 'offline' | 'limited' | 'unknown';

export type AppLifecycleState = 'active' | 'inactive' | 'background' | 'terminated';

// Complex types
export interface PermissionState {
  notifications: PermissionStatus;
  microphone: PermissionStatus;
  storage: PermissionStatus;
  backgroundRefresh: PermissionStatus;
}

export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'restricted';

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number; // 0-100
  cancellable?: boolean;
  startTime?: Date;
}

export interface ErrorState {
  error: Error | null;
  context?: string;
  timestamp?: Date;
  retryAction?: () => void;
  fallbackAction?: () => void;
  dismissible?: boolean;
  severity?: ErrorSeverity;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorHistoryItem {
  error: Error;
  context: string;
  timestamp: Date;
  resolved: boolean;
  resolution?: string;
}

export interface SyncStatus {
  isActive: boolean;
  lastSyncTime: Date | null;
  pendingOperations: number;
  failedOperations: number;
  nextSyncTime: Date | null;
  syncProgress?: number; // 0-100
}

export interface BackgroundTaskStatus {
  audioDownloads: TaskProgress[];
  syncOperations: TaskProgress[];
  notifications: TaskProgress[];
}

export interface TaskProgress {
  id: string;
  type: string;
  progress: number; // 0-100
  status: TaskStatus;
  startTime: Date;
  estimatedCompletion?: Date;
  error?: string;
}

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface FeatureFlags {
  advancedAudioControls: boolean;
  experimentalUI: boolean;
  betaFeatures: boolean;
  offlineMode: boolean;
  analytics: boolean;
  crashReporting: boolean;
}

export interface NotificationState {
  enabled: boolean;
  permissions: PermissionStatus;
  scheduledNotifications: ScheduledNotification[];
  badgeCount: number;
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: Date;
  type: NotificationType;
  data?: any;
}

export type NotificationType = 'reminder' | 'streak' | 'achievement' | 'update' | 'system';

export interface DebugInfo {
  version: string;
  buildNumber: string;
  platform: string;
  device: string;
  memoryUsage?: number;
  storageUsage?: number;
  lastErrorTime?: Date;
  sessionCount: number;
}

export interface AppStateExport {
  version: string;
  timestamp: Date;
  settings: {
    theme: ThemeMode;
    fontSize: FontSize;
    permissions: PermissionState;
    featureFlags: FeatureFlags;
  };
  stats: {
    lastActiveTime: Date | null;
    sessionCount: number;
    isFirstLaunch: boolean;
  };
}

// Default values
const defaultPermissions: PermissionState = {
  notifications: 'undetermined',
  microphone: 'undetermined',
  storage: 'undetermined',
  backgroundRefresh: 'undetermined'
};

const defaultLoadingState: LoadingState = {
  isLoading: false
};

const defaultErrorState: ErrorState = {
  error: null
};

const defaultSyncStatus: SyncStatus = {
  isActive: false,
  lastSyncTime: null,
  pendingOperations: 0,
  failedOperations: 0,
  nextSyncTime: null
};

const defaultBackgroundTaskStatus: BackgroundTaskStatus = {
  audioDownloads: [],
  syncOperations: [],
  notifications: []
};

const defaultFeatureFlags: FeatureFlags = {
  advancedAudioControls: true,
  experimentalUI: false,
  betaFeatures: false,
  offlineMode: true,
  analytics: false,
  crashReporting: true
};

const defaultNotificationState: NotificationState = {
  enabled: false,
  permissions: 'undetermined',
  scheduledNotifications: [],
  badgeCount: 0
};

const defaultDebugInfo: DebugInfo = {
  version: '1.0.0',
  buildNumber: '1',
  platform: 'unknown',
  device: 'unknown',
  sessionCount: 0
};

// Store implementation
export const useAppStore = create<AppState & AppActions>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        theme: 'system',
        colorScheme: 'default',
        fontSize: 'medium',
        networkStatus: 'unknown',
        isOffline: false,
        lastOnlineTime: new Date(),
        permissions: defaultPermissions,
        globalLoading: defaultLoadingState,
        globalError: defaultErrorState,
        syncStatus: defaultSyncStatus,
        backgroundTaskStatus: defaultBackgroundTaskStatus,
        appState: 'active',
        isFirstLaunch: true,
        lastActiveTime: new Date(),
        featureFlags: defaultFeatureFlags,
        notificationState: defaultNotificationState,
        isDeveloperMode: false,
        debugInfo: defaultDebugInfo,
        
        // Actions
        setTheme: (theme: ThemeMode) => {
          set({ theme });
        },
        
        setColorScheme: (scheme: ColorScheme) => {
          set({ colorScheme: scheme });
        },
        
        setFontSize: (size: FontSize) => {
          set({ fontSize: size });
        },
        
        setNetworkStatus: (status: NetworkStatus) => {
          const currentTime = new Date();
          const isOffline = status === 'offline';
          
          set({ 
            networkStatus: status,
            isOffline,
            lastOnlineTime: isOffline ? get().lastOnlineTime : currentTime
          });
          
          // Handle sync when coming back online
          if (!isOffline && get().isOffline) {
            const syncStatus = get().syncStatus;
            if (syncStatus.pendingOperations > 0) {
              get().setSyncStatus({
                ...syncStatus,
                isActive: true,
                nextSyncTime: currentTime
              });
            }
          }
        },
        
        setOfflineMode: (isOffline: boolean) => {
          set({ 
            isOffline,
            networkStatus: isOffline ? 'offline' : 'online',
            lastOnlineTime: isOffline ? get().lastOnlineTime : new Date()
          });
        },
        
        updateLastOnlineTime: () => {
          set({ lastOnlineTime: new Date() });
        },
        
        updatePermissions: (permissions: Partial<PermissionState>) => {
          const currentPermissions = get().permissions;
          set({ 
            permissions: { ...currentPermissions, ...permissions }
          });
        },
        
        setGlobalLoading: (loading: LoadingState) => {
          set({ 
            globalLoading: { 
              ...loading, 
              startTime: loading.isLoading && !get().globalLoading.isLoading 
                ? new Date() 
                : get().globalLoading.startTime 
            }
          });
        },
        
        clearGlobalLoading: () => {
          set({ globalLoading: defaultLoadingState });
        },
        
        setGlobalError: (error: ErrorState) => {
          set({ 
            globalError: { 
              ...error, 
              timestamp: new Date() 
            }
          });
          
          // Add to error history
          if (error.error) {
            get().addErrorToHistory({
              error: error.error,
              context: error.context || 'unknown',
              timestamp: new Date(),
              resolved: false
            });
          }
        },
        
        clearGlobalError: () => {
          const currentError = get().globalError;
          if (currentError.error) {
            // Mark current error as resolved in history
            const debugInfo = get().debugInfo;
            get().updateDebugInfo({
              lastErrorTime: currentError.timestamp
            });
          }
          
          set({ globalError: defaultErrorState });
        },
        
        addErrorToHistory: (error: ErrorHistoryItem) => {
          const debugInfo = get().debugInfo;
          get().updateDebugInfo({
            lastErrorTime: error.timestamp
          });
        },
        
        setSyncStatus: (status: SyncStatus) => {
          set({ syncStatus: status });
        },
        
        setBackgroundTaskStatus: (status: BackgroundTaskStatus) => {
          set({ backgroundTaskStatus: status });
        },
        
        setAppState: (appState: AppLifecycleState) => {
          set({ appState });
          
          if (appState === 'active') {
            get().updateLastActiveTime();
          }
        },
        
        updateLastActiveTime: () => {
          set({ lastActiveTime: new Date() });
        },
        
        markFirstLaunchComplete: () => {
          set({ isFirstLaunch: false });
        },
        
        updateFeatureFlags: (flags: Partial<FeatureFlags>) => {
          const currentFlags = get().featureFlags;
          set({ 
            featureFlags: { ...currentFlags, ...flags }
          });
        },
        
        setNotificationState: (notificationState: NotificationState) => {
          set({ notificationState });
        },
        
        toggleDeveloperMode: () => {
          set({ isDeveloperMode: !get().isDeveloperMode });
        },
        
        updateDebugInfo: (info: Partial<DebugInfo>) => {
          const currentInfo = get().debugInfo;
          set({ 
            debugInfo: { ...currentInfo, ...info }
          });
        },
        
        reset: () => {
          set({
            theme: 'system',
            colorScheme: 'default',
            fontSize: 'medium',
            networkStatus: 'unknown',
            isOffline: false,
            lastOnlineTime: new Date(),
            permissions: defaultPermissions,
            globalLoading: defaultLoadingState,
            globalError: defaultErrorState,
            syncStatus: defaultSyncStatus,
            backgroundTaskStatus: defaultBackgroundTaskStatus,
            appState: 'active',
            isFirstLaunch: false, // Don't reset this to true
            lastActiveTime: new Date(),
            featureFlags: defaultFeatureFlags,
            notificationState: defaultNotificationState,
            isDeveloperMode: false,
            debugInfo: defaultDebugInfo
          });
        },
        
        exportAppState: (): AppStateExport => {
          const state = get();
          return {
            version: state.debugInfo.version,
            timestamp: new Date(),
            settings: {
              theme: state.theme,
              fontSize: state.fontSize,
              permissions: state.permissions,
              featureFlags: state.featureFlags
            },
            stats: {
              lastActiveTime: state.lastActiveTime,
              sessionCount: state.debugInfo.sessionCount,
              isFirstLaunch: state.isFirstLaunch
            }
          };
        }
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          theme: state.theme,
          colorScheme: state.colorScheme,
          fontSize: state.fontSize,
          permissions: state.permissions,
          isFirstLaunch: state.isFirstLaunch,
          lastActiveTime: state.lastActiveTime,
          featureFlags: state.featureFlags,
          notificationState: {
            enabled: state.notificationState.enabled,
            permissions: state.notificationState.permissions
          },
          isDeveloperMode: state.isDeveloperMode
        })
      }
    ),
    {
      name: 'app-store'
    }
  )
);

// Selector hooks for performance optimization
export const useTheme = () => useAppStore(state => state.theme);
export const useColorScheme = () => useAppStore(state => state.colorScheme);
export const useFontSize = () => useAppStore(state => state.fontSize);
export const useNetworkStatus = () => useAppStore(state => state.networkStatus);
export const useIsOffline = () => useAppStore(state => state.isOffline);
export const usePermissions = () => useAppStore(state => state.permissions);
export const useGlobalLoading = () => useAppStore(state => state.globalLoading);
export const useGlobalError = () => useAppStore(state => state.globalError);
export const useSyncStatus = () => useAppStore(state => state.syncStatus);
export const useAppLifecycleState = () => useAppStore(state => state.appState);
export const useIsFirstLaunch = () => useAppStore(state => state.isFirstLaunch);
export const useFeatureFlags = () => useAppStore(state => state.featureFlags);
export const useNotificationState = () => useAppStore(state => state.notificationState);
export const useIsDeveloperMode = () => useAppStore(state => state.isDeveloperMode);
export const useDebugInfo = () => useAppStore(state => state.debugInfo);

// Computed selectors
export const useHasInternetConnection = () => useAppStore(state => 
  state.networkStatus === 'online' || state.networkStatus === 'limited'
);

export const useCanSync = () => useAppStore(state => 
  (state.networkStatus === 'online' || state.networkStatus === 'limited') && 
  !state.isOffline &&
  state.syncStatus.pendingOperations > 0
);

export const useHasPendingTasks = () => useAppStore(state => {
  const { audioDownloads, syncOperations, notifications } = state.backgroundTaskStatus;
  return audioDownloads.some(task => task.status === 'running' || task.status === 'pending') ||
         syncOperations.some(task => task.status === 'running' || task.status === 'pending') ||
         notifications.some(task => task.status === 'running' || task.status === 'pending');
});

export const useAppHealthStatus = () => useAppStore(state => {
  const hasError = !!state.globalError.error;
  const isOffline = state.isOffline;
  const hasPendingSync = state.syncStatus.pendingOperations > 0;
  const hasFailedSync = state.syncStatus.failedOperations > 0;
  
  if (hasError) return 'error';
  if (isOffline && hasPendingSync) return 'warning';
  if (hasFailedSync) return 'warning';
  return 'healthy';
});

export const useAccessibilitySettings = () => useAppStore(state => ({
  fontSize: state.fontSize,
  colorScheme: state.colorScheme,
  theme: state.theme
}));
