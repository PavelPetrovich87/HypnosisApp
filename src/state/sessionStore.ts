import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { HypnosisGoal } from './userStore';

// Types
export interface Session {
  id: string;
  title: string;
  description?: string;
  config: SessionConfig;
  script?: string;
  audioFile?: AudioFile;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
  playCount: number;
  rating?: number; // 1-5 stars
  isFavorite: boolean;
  tags: string[];
}

export interface SessionConfig {
  goals: HypnosisGoal[];
  duration: number; // in minutes
  style: HypnosisStyle;
  voiceId: string;
  backgroundMusic: boolean;
  musicVolume: number;
  fadeInOut: boolean;
  customPrompt?: string;
}

export interface AudioFile {
  id: string;
  url: string;
  localPath?: string;
  duration: number; // in seconds
  fileSize: number; // in bytes
  isDownloaded: boolean;
  downloadProgress?: number; // 0-100
}

export interface GenerationProgress {
  sessionId: string;
  stage: GenerationStage;
  progress: number; // 0-100
  message: string;
  startTime: Date;
  estimatedTimeRemaining?: number; // in seconds
}

export type SessionStatus = 
  | 'draft' 
  | 'generating' 
  | 'script-ready' 
  | 'synthesizing' 
  | 'complete' 
  | 'failed' 
  | 'archived';

export type HypnosisStyle = 
  | 'guided-meditation'
  | 'progressive-relaxation'
  | 'visualization'
  | 'affirmations'
  | 'breathwork'
  | 'body-scan'
  | 'sleep-induction'
  | 'confidence-building';

export type GenerationStage = 
  | 'initializing'
  | 'analyzing-goals'
  | 'generating-script'
  | 'optimizing-content'
  | 'synthesizing-audio'
  | 'post-processing'
  | 'finalizing'
  | 'complete';

export interface SessionFilters {
  goals?: HypnosisGoal[];
  styles?: HypnosisStyle[];
  duration?: { min: number; max: number };
  status?: SessionStatus[];
  favorites?: boolean;
  dateRange?: { start: Date; end: Date };
}

export interface SessionState {
  current: Session | null;
  recent: Session[];
  suggested: Session[];
  favorites: Session[];
  generationProgress: GenerationProgress | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  filters: SessionFilters;
}

export interface SessionActions {
  // Session CRUD
  createSession: (config: SessionConfig) => Promise<Session>;
  loadSession: (sessionId: string) => Promise<void>;
  updateSession: (sessionId: string, updates: Partial<Session>) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  
  // Session lists
  loadRecentSessions: () => Promise<void>;
  loadSuggestedSessions: () => Promise<void>;
  loadFavorites: () => Promise<void>;
  
  // Generation
  startGeneration: (sessionId: string) => Promise<void>;
  cancelGeneration: (sessionId: string) => Promise<void>;
  retryGeneration: (sessionId: string) => Promise<void>;
  
  // Interactions
  toggleFavorite: (sessionId: string) => Promise<void>;
  rateSession: (sessionId: string, rating: number) => Promise<void>;
  incrementPlayCount: (sessionId: string) => void;
  
  // Audio management
  downloadAudio: (sessionId: string) => Promise<void>;
  deleteAudio: (sessionId: string) => Promise<void>;
  
  // Filtering and search
  setFilters: (filters: SessionFilters) => void;
  searchSessions: (query: string) => Promise<Session[]>;
  
  // Utility
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setCurrentSession: (session: Session | null) => void;
}

// Default session configuration
const defaultSessionConfig: SessionConfig = {
  goals: ['relaxation'],
  duration: 15,
  style: 'guided-meditation',
  voiceId: 'default',
  backgroundMusic: true,
  musicVolume: 0.3,
  fadeInOut: true
};

// Store implementation
export const useSessionStore = create<SessionState & SessionActions>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        current: null,
        recent: [],
        suggested: [],
        favorites: [],
        generationProgress: null,
        isLoading: false,
        isGenerating: false,
        error: null,
        filters: {},
        
        // Actions
        createSession: async (config: SessionConfig) => {
          set({ isLoading: true, error: null });
          try {
            // This will be implemented when sessionService is available
            // const session = await sessionService.create(config);
            
            // Mock session creation for now
            const mockSession: Session = {
              id: 'session-' + Date.now(),
              title: `${config.goals.join(', ')} Session`,
              description: `${config.duration}-minute ${config.style} session`,
              config,
              status: 'draft',
              createdAt: new Date(),
              updatedAt: new Date(),
              playCount: 0,
              isFavorite: false,
              tags: config.goals
            };
            
            const currentRecent = get().recent;
            set({ 
              current: mockSession,
              recent: [mockSession, ...currentRecent].slice(0, 20), // Keep last 20
              isLoading: false,
              error: null
            });
            
            return mockSession;
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to create session', 
              isLoading: false 
            });
            throw error;
          }
        },
        
        loadSession: async (sessionId: string) => {
          set({ isLoading: true, error: null });
          try {
            // This will be implemented when sessionService is available
            // const session = await sessionService.getById(sessionId);
            
            // Mock loading from recent sessions for now
            const session = get().recent.find(s => s.id === sessionId);
            if (!session) {
              throw new Error('Session not found');
            }
            
            set({ 
              current: session,
              isLoading: false,
              error: null
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to load session', 
              isLoading: false 
            });
            throw error;
          }
        },
        
        updateSession: async (sessionId: string, updates: Partial<Session>) => {
          set({ isLoading: true, error: null });
          try {
            // This will be implemented when sessionService is available
            // await sessionService.update(sessionId, updates);
            
            const currentSession = get().current;
            const recentSessions = get().recent;
            
            // Update current session if it matches
            if (currentSession?.id === sessionId) {
              const updatedSession = { ...currentSession, ...updates, updatedAt: new Date() };
              set({ current: updatedSession });
            }
            
            // Update in recent sessions list
            const updatedRecent = recentSessions.map(session => 
              session.id === sessionId 
                ? { ...session, ...updates, updatedAt: new Date() }
                : session
            );
            
            set({ 
              recent: updatedRecent,
              isLoading: false,
              error: null
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to update session', 
              isLoading: false 
            });
            throw error;
          }
        },
        
        deleteSession: async (sessionId: string) => {
          set({ isLoading: true, error: null });
          try {
            // This will be implemented when sessionService is available
            // await sessionService.delete(sessionId);
            
            const currentSession = get().current;
            const recentSessions = get().recent;
            const favorites = get().favorites;
            
            // Clear current session if it matches
            if (currentSession?.id === sessionId) {
              set({ current: null });
            }
            
            // Remove from lists
            set({ 
              recent: recentSessions.filter(s => s.id !== sessionId),
              favorites: favorites.filter(s => s.id !== sessionId),
              isLoading: false,
              error: null
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to delete session', 
              isLoading: false 
            });
            throw error;
          }
        },
        
        loadRecentSessions: async () => {
          set({ isLoading: true, error: null });
          try {
            // This will be implemented when sessionService is available
            // const sessions = await sessionService.getRecent();
            
            // Mock recent sessions for now
            const mockSessions: Session[] = [
              {
                id: 'recent-1',
                title: 'Evening Relaxation',
                description: '15-minute guided meditation session',
                config: { ...defaultSessionConfig, goals: ['relaxation', 'sleep'] },
                status: 'complete',
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                playCount: 3,
                rating: 5,
                isFavorite: true,
                tags: ['relaxation', 'sleep'],
                audioFile: {
                  id: 'audio-1',
                  url: 'https://example.com/audio1.mp3',
                  duration: 900,
                  fileSize: 14400000,
                  isDownloaded: true
                }
              },
              {
                id: 'recent-2',
                title: 'Confidence Boost',
                description: '20-minute affirmations session',
                config: { ...defaultSessionConfig, goals: ['confidence'], duration: 20, style: 'affirmations' },
                status: 'complete',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                playCount: 1,
                isFavorite: false,
                tags: ['confidence'],
                audioFile: {
                  id: 'audio-2',
                  url: 'https://example.com/audio2.mp3',
                  duration: 1200,
                  fileSize: 19200000,
                  isDownloaded: false
                }
              }
            ];
            
            set({ 
              recent: mockSessions,
              isLoading: false,
              error: null
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to load recent sessions', 
              isLoading: false 
            });
            throw error;
          }
        },
        
        loadSuggestedSessions: async () => {
          set({ isLoading: true, error: null });
          try {
            // This will be implemented when sessionService is available
            // const sessions = await sessionService.getSuggested();
            
            // Mock suggested sessions based on user goals
            const mockSuggested: Session[] = [
              {
                id: 'suggested-1',
                title: 'Deep Focus Session',
                description: 'Enhance concentration and mental clarity',
                config: { ...defaultSessionConfig, goals: ['focus'], style: 'visualization' },
                status: 'draft',
                createdAt: new Date(),
                updatedAt: new Date(),
                playCount: 0,
                isFavorite: false,
                tags: ['focus', 'productivity']
              }
            ];
            
            set({ 
              suggested: mockSuggested,
              isLoading: false,
              error: null
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to load suggested sessions', 
              isLoading: false 
            });
            throw error;
          }
        },
        
        loadFavorites: async () => {
          const recentSessions = get().recent;
          const favoritesSessions = recentSessions.filter(session => session.isFavorite);
          set({ favorites: favoritesSessions });
        },
        
        startGeneration: async (sessionId: string) => {
          set({ isGenerating: true, error: null });
          try {
            const session = get().recent.find(s => s.id === sessionId) || get().current;
            if (!session) {
              throw new Error('Session not found');
            }
            
            // Initialize generation progress
            const progress: GenerationProgress = {
              sessionId,
              stage: 'initializing',
              progress: 0,
              message: 'Preparing your personalized session...',
              startTime: new Date()
            };
            
            set({ generationProgress: progress });
            
            // Update session status
            await get().updateSession(sessionId, { status: 'generating' });
            
            // This will be implemented when audioService is available
            // The actual generation process will be handled by AudioGenerationViewModel
            
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to start generation', 
              isGenerating: false,
              generationProgress: null
            });
            throw error;
          }
        },
        
        cancelGeneration: async (sessionId: string) => {
          try {
            // This will be implemented when audioService is available
            // await audioService.cancelGeneration(sessionId);
            
            set({ 
              isGenerating: false,
              generationProgress: null
            });
            
            await get().updateSession(sessionId, { status: 'draft' });
          } catch (error: any) {
            set({ error: error.message || 'Failed to cancel generation' });
            throw error;
          }
        },
        
        retryGeneration: async (sessionId: string) => {
          await get().startGeneration(sessionId);
        },
        
        toggleFavorite: async (sessionId: string) => {
          try {
            const session = get().recent.find(s => s.id === sessionId) || get().current;
            if (!session) {
              throw new Error('Session not found');
            }
            
            const updatedFavoriteStatus = !session.isFavorite;
            await get().updateSession(sessionId, { isFavorite: updatedFavoriteStatus });
            
            // Update favorites list
            await get().loadFavorites();
          } catch (error: any) {
            set({ error: error.message || 'Failed to update favorite status' });
            throw error;
          }
        },
        
        rateSession: async (sessionId: string, rating: number) => {
          try {
            await get().updateSession(sessionId, { rating });
          } catch (error: any) {
            set({ error: error.message || 'Failed to rate session' });
            throw error;
          }
        },
        
        incrementPlayCount: (sessionId: string) => {
          const session = get().recent.find(s => s.id === sessionId) || get().current;
          if (session) {
            get().updateSession(sessionId, { playCount: session.playCount + 1 });
          }
        },
        
        downloadAudio: async (sessionId: string) => {
          set({ isLoading: true, error: null });
          try {
            // This will be implemented when storageService is available
            // await storageService.downloadAudio(sessionId);
            
            const session = get().recent.find(s => s.id === sessionId);
            if (session?.audioFile) {
              const updatedAudioFile = { 
                ...session.audioFile, 
                isDownloaded: true,
                localPath: `/local/storage/${sessionId}.mp3`
              };
              
              await get().updateSession(sessionId, { 
                audioFile: updatedAudioFile 
              });
            }
            
            set({ isLoading: false, error: null });
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to download audio', 
              isLoading: false 
            });
            throw error;
          }
        },
        
        deleteAudio: async (sessionId: string) => {
          try {
            // This will be implemented when storageService is available
            // await storageService.deleteAudio(sessionId);
            
            const session = get().recent.find(s => s.id === sessionId);
            if (session?.audioFile) {
              const updatedAudioFile = { 
                ...session.audioFile, 
                isDownloaded: false,
                localPath: undefined
              };
              
              await get().updateSession(sessionId, { 
                audioFile: updatedAudioFile 
              });
            }
          } catch (error: any) {
            set({ error: error.message || 'Failed to delete audio' });
            throw error;
          }
        },
        
        setFilters: (filters: SessionFilters) => {
          set({ filters });
        },
        
        searchSessions: async (query: string) => {
          try {
            // This will be implemented when sessionService is available
            // return await sessionService.search(query);
            
            // Mock search in recent sessions for now
            const recentSessions = get().recent;
            const results = recentSessions.filter(session =>
              session.title.toLowerCase().includes(query.toLowerCase()) ||
              session.description?.toLowerCase().includes(query.toLowerCase()) ||
              session.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            );
            
            return results;
          } catch (error: any) {
            set({ error: error.message || 'Search failed' });
            return [];
          }
        },
        
        clearError: () => {
          set({ error: null });
        },
        
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },
        
        setCurrentSession: (session: Session | null) => {
          set({ current: session });
        }
      }),
      {
        name: 'session-store',
        partialize: (state) => ({ 
          recent: state.recent.slice(0, 10), // Persist only last 10 recent sessions
          favorites: state.favorites,
          filters: state.filters
        })
      }
    ),
    {
      name: 'session-store'
    }
  )
);

// Selector hooks for performance optimization
export const useCurrentSession = () => useSessionStore(state => state.current);
export const useRecentSessions = () => useSessionStore(state => state.recent);
export const useSuggestedSessions = () => useSessionStore(state => state.suggested);
export const useFavoriteSessions = () => useSessionStore(state => state.favorites);
export const useGenerationProgress = () => useSessionStore(state => state.generationProgress);
export const useSessionLoading = () => useSessionStore(state => state.isLoading);
export const useSessionError = () => useSessionStore(state => state.error);
export const useSessionFilters = () => useSessionStore(state => state.filters);

// Computed selectors
export const useIsGenerating = () => useSessionStore(state => state.isGenerating);

export const useSessionsByGoal = (goal: HypnosisGoal) => useSessionStore(state => 
  state.recent.filter(session => session.config.goals.includes(goal))
);

export const useCompletedSessions = () => useSessionStore(state => 
  state.recent.filter(session => session.status === 'complete')
);

export const useDownloadedSessions = () => useSessionStore(state => 
  state.recent.filter(session => session.audioFile?.isDownloaded)
);
