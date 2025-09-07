import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
  lastActive: Date;
}

export interface UserProfile {
  goals: HypnosisGoal[];
  experience: ExperienceLevel;
  preferences: UserPreferences;
  statistics: UserStatistics;
}

export interface UserPreferences {
  voiceSettings: VoiceSettings;
  sessionDefaults: SessionDefaults;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface VoiceSettings {
  selectedVoiceId: string;
  voiceName: string;
  speed: number; // 0.5 to 2.0
  pitch: number; // 0.5 to 2.0
  volume: number; // 0.0 to 1.0
}

export interface SessionDefaults {
  defaultDuration: number; // in minutes
  backgroundMusic: boolean;
  fadeInOut: boolean;
  autoPlay: boolean;
}

export interface NotificationSettings {
  dailyReminders: boolean;
  reminderTime: string; // HH:MM format
  streakReminders: boolean;
  achievementNotifications: boolean;
}

export interface PrivacySettings {
  shareStatistics: boolean;
  personalisedRecommendations: boolean;
  analyticsOptOut: boolean;
}

export interface UserStatistics {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  averageSessionLength: number;
  sessionsThisWeek: number;
  minutesThisWeek: number;
  favoriteGoals: HypnosisGoal[];
  lastSessionDate?: Date;
}

export interface QuotaInfo {
  dailyUsed: number;
  dailyLimit: number;
  monthlyUsed: number;
  monthlyLimit: number;
  isExhausted: boolean;
  resetTime: Date;
  subscriptionTier: SubscriptionTier;
}

export type HypnosisGoal = 
  | 'relaxation' 
  | 'sleep' 
  | 'confidence' 
  | 'focus' 
  | 'anxiety' 
  | 'habit-change' 
  | 'pain-relief' 
  | 'creativity';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type SubscriptionTier = 'free' | 'premium' | 'pro';

export interface UserState {
  current: User | null;
  profile: UserProfile | null;
  quotaInfo: QuotaInfo | null;
  isLoading: boolean;
  error: string | null;
}

export interface UserActions {
  loadProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  updateVoiceSettings: (voiceSettings: VoiceSettings) => Promise<void>;
  loadQuotaInfo: () => Promise<void>;
  incrementSessionStats: (duration: number, goals: HypnosisGoal[]) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

// Default values
const defaultVoiceSettings: VoiceSettings = {
  selectedVoiceId: 'default',
  voiceName: 'Sarah',
  speed: 1.0,
  pitch: 1.0,
  volume: 0.8
};

const defaultSessionDefaults: SessionDefaults = {
  defaultDuration: 15,
  backgroundMusic: true,
  fadeInOut: true,
  autoPlay: false
};

const defaultNotificationSettings: NotificationSettings = {
  dailyReminders: true,
  reminderTime: '20:00',
  streakReminders: true,
  achievementNotifications: true
};

const defaultPrivacySettings: PrivacySettings = {
  shareStatistics: false,
  personalisedRecommendations: true,
  analyticsOptOut: false
};

// Store implementation
export const useUserStore = create<UserState & UserActions>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        current: null,
        profile: null,
        quotaInfo: null,
        isLoading: false,
        error: null,
        
        // Actions
        loadProfile: async () => {
          set({ isLoading: true, error: null });
          try {
            // This will be implemented when userService is available
            // const profileData = await userService.getProfile();
            
            // Mock profile data for now
            const mockUser: User = {
              id: '1',
              email: 'user@example.com',
              firstName: 'John',
              lastName: 'Doe',
              avatar: undefined,
              createdAt: new Date('2024-01-01'),
              lastActive: new Date()
            };
            
            const mockProfile: UserProfile = {
              goals: ['relaxation', 'sleep'],
              experience: 'beginner',
              preferences: {
                voiceSettings: defaultVoiceSettings,
                sessionDefaults: defaultSessionDefaults,
                notifications: defaultNotificationSettings,
                privacy: defaultPrivacySettings
              },
              statistics: {
                totalSessions: 5,
                totalMinutes: 75,
                currentStreak: 2,
                longestStreak: 4,
                averageSessionLength: 15,
                sessionsThisWeek: 3,
                minutesThisWeek: 45,
                favoriteGoals: ['relaxation'],
                lastSessionDate: new Date()
              }
            };
            
            const mockQuotaInfo: QuotaInfo = {
              dailyUsed: 2,
              dailyLimit: 5,
              monthlyUsed: 15,
              monthlyLimit: 100,
              isExhausted: false,
              resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
              subscriptionTier: 'free'
            };
            
            set({ 
              current: mockUser,
              profile: mockProfile,
              quotaInfo: mockQuotaInfo,
              isLoading: false,
              error: null
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to load profile', 
              isLoading: false 
            });
            throw error;
          }
        },
        
        updateProfile: async (updates: Partial<UserProfile>) => {
          set({ isLoading: true, error: null });
          try {
            const currentProfile = get().profile;
            if (!currentProfile) {
              throw new Error('No profile loaded');
            }
            
            // This will be implemented when userService is available
            // await userService.updateProfile(updates);
            
            const updatedProfile = { ...currentProfile, ...updates };
            set({ 
              profile: updatedProfile,
              isLoading: false,
              error: null
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to update profile', 
              isLoading: false 
            });
            throw error;
          }
        },
        
        updatePreferences: async (preferences: Partial<UserPreferences>) => {
          set({ isLoading: true, error: null });
          try {
            const currentProfile = get().profile;
            if (!currentProfile) {
              throw new Error('No profile loaded');
            }
            
            // This will be implemented when userService is available
            // await userService.updatePreferences(preferences);
            
            const updatedPreferences = { 
              ...currentProfile.preferences, 
              ...preferences 
            };
            
            set({ 
              profile: {
                ...currentProfile,
                preferences: updatedPreferences
              },
              isLoading: false,
              error: null
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to update preferences', 
              isLoading: false 
            });
            throw error;
          }
        },
        
        updateVoiceSettings: async (voiceSettings: VoiceSettings) => {
          const currentProfile = get().profile;
          if (!currentProfile) {
            throw new Error('No profile loaded');
          }
          
          try {
            await get().updatePreferences({
              voiceSettings
            });
          } catch (error: any) {
            throw error;
          }
        },
        
        loadQuotaInfo: async () => {
          set({ isLoading: true, error: null });
          try {
            // This will be implemented when quotaService is available
            // const quotaData = await quotaService.getQuotaInfo();
            
            // Mock quota data for now - will be replaced with real data
            const mockQuotaInfo: QuotaInfo = {
              dailyUsed: 2,
              dailyLimit: 5,
              monthlyUsed: 15,
              monthlyLimit: 100,
              isExhausted: false,
              resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
              subscriptionTier: 'free'
            };
            
            set({ 
              quotaInfo: mockQuotaInfo,
              isLoading: false,
              error: null
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to load quota info', 
              isLoading: false 
            });
            throw error;
          }
        },
        
        incrementSessionStats: (duration: number, goals: HypnosisGoal[]) => {
          const currentProfile = get().profile;
          if (!currentProfile) return;
          
          const updatedStats: UserStatistics = {
            ...currentProfile.statistics,
            totalSessions: currentProfile.statistics.totalSessions + 1,
            totalMinutes: currentProfile.statistics.totalMinutes + duration,
            sessionsThisWeek: currentProfile.statistics.sessionsThisWeek + 1,
            minutesThisWeek: currentProfile.statistics.minutesThisWeek + duration,
            lastSessionDate: new Date(),
            // Update average session length
            averageSessionLength: Math.round(
              (currentProfile.statistics.totalMinutes + duration) / 
              (currentProfile.statistics.totalSessions + 1)
            )
          };
          
          // Update current streak logic (simplified for now)
          const lastSession = currentProfile.statistics.lastSessionDate;
          const today = new Date();
          const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
          
          if (!lastSession || lastSession < yesterday) {
            updatedStats.currentStreak = 1;
          } else if (lastSession.toDateString() !== today.toDateString()) {
            updatedStats.currentStreak = currentProfile.statistics.currentStreak + 1;
          }
          
          // Update longest streak if necessary
          if (updatedStats.currentStreak > currentProfile.statistics.longestStreak) {
            updatedStats.longestStreak = updatedStats.currentStreak;
          }
          
          set({
            profile: {
              ...currentProfile,
              statistics: updatedStats
            }
          });
        },
        
        clearError: () => {
          set({ error: null });
        },
        
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },
        
        logout: () => {
          set({
            current: null,
            profile: null,
            quotaInfo: null,
            error: null
          });
        }
      }),
      {
        name: 'user-store',
        partialize: (state) => ({ 
          current: state.current,
          profile: state.profile,
          quotaInfo: state.quotaInfo
        })
      }
    ),
    {
      name: 'user-store'
    }
  )
);

// Selector hooks for performance optimization
export const useCurrentUser = () => useUserStore(state => state.current);
export const useUserProfile = () => useUserStore(state => state.profile);
export const useUserPreferences = () => useUserStore(state => state.profile?.preferences);
export const useVoiceSettings = () => useUserStore(state => state.profile?.preferences.voiceSettings);
export const useUserStatistics = () => useUserStore(state => state.profile?.statistics);
export const useQuotaInfo = () => useUserStore(state => state.quotaInfo);
export const useUserLoading = () => useUserStore(state => state.isLoading);
export const useUserError = () => useUserStore(state => state.error);

// Computed selectors
export const useSessionStats = () => useUserStore(state => {
  const stats = state.profile?.statistics;
  if (!stats) return null;
  
  return {
    totalSessions: stats.totalSessions,
    totalDuration: stats.totalMinutes,
    streak: stats.currentStreak,
    averageLength: stats.averageSessionLength
  };
});

export const useQuotaStatus = () => useUserStore(state => {
  const quota = state.quotaInfo;
  if (!quota) return null;
  
  return {
    dailyRemaining: quota.dailyLimit - quota.dailyUsed,
    monthlyRemaining: quota.monthlyLimit - quota.monthlyUsed,
    isExhausted: quota.isExhausted,
    canCreateSession: !quota.isExhausted && quota.dailyUsed < quota.dailyLimit
  };
});
