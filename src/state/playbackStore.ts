import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Session, AudioFile } from './sessionStore';

// Types
export interface PlaybackState {
  currentSession: Session | null;
  audioFile: AudioFile | null;
  isPlaying: boolean;
  isPaused: boolean;
  isBuffering: boolean;
  progress: number; // Current playback position in seconds
  duration: number; // Total duration in seconds
  volume: number; // 0.0 to 1.0
  playbackRate: number; // 0.5 to 2.0 (normal speed = 1.0)
  isLooping: boolean;
  isMuted: boolean;
  error: string | null;
  
  // Session tracking
  sessionStartTime: Date | null;
  totalListenTime: number; // Total time listened in seconds
  completionPercentage: number; // 0-100
  hasCompletedSession: boolean;
  
  // Queue management
  playQueue: Session[];
  currentQueueIndex: number;
  isShuffling: boolean;
  repeatMode: RepeatMode;
}

export interface PlaybackActions {
  // Basic playback controls
  play: (session?: Session) => Promise<void>;
  pause: () => void;
  stop: () => void;
  resume: () => void;
  
  // Seeking and progress
  seekTo: (position: number) => void;
  seekForward: (seconds: number) => void;
  seekBackward: (seconds: number) => void;
  
  // Volume and speed
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  toggleMute: () => void;
  
  // Session management
  loadSession: (session: Session) => Promise<void>;
  completeSession: () => void;
  updateProgress: (currentTime: number) => void;
  
  // Queue management
  addToQueue: (sessions: Session[]) => void;
  removeFromQueue: (sessionId: string) => void;
  clearQueue: () => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  setQueueIndex: (index: number) => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  
  // Audio loading
  preloadAudio: (session: Session) => Promise<void>;
  
  // Error handling
  handleError: (error: string) => void;
  clearError: () => void;
  
  // Utility
  reset: () => void;
}

export type RepeatMode = 'none' | 'track' | 'queue';

export interface PlaybackProgress {
  position: number; // Current position in seconds
  duration: number; // Total duration in seconds
  percentage: number; // 0-100
  remainingTime: number; // Remaining time in seconds
}

export interface AudioLoadStatus {
  isLoaded: boolean;
  isLoading: boolean;
  error?: string;
}

// Store implementation
export const usePlaybackStore = create<PlaybackState & PlaybackActions>()(
  devtools(
    (set, get) => ({
      // State
      currentSession: null,
      audioFile: null,
      isPlaying: false,
      isPaused: false,
      isBuffering: false,
      progress: 0,
      duration: 0,
      volume: 0.8,
      playbackRate: 1.0,
      isLooping: false,
      isMuted: false,
      error: null,
      
      // Session tracking
      sessionStartTime: null,
      totalListenTime: 0,
      completionPercentage: 0,
      hasCompletedSession: false,
      
      // Queue management
      playQueue: [],
      currentQueueIndex: -1,
      isShuffling: false,
      repeatMode: 'none',
      
      // Actions
      play: async (session?: Session) => {
        try {
          set({ error: null });
          
          if (session) {
            // Load new session
            await get().loadSession(session);
          }
          
          const currentSession = get().currentSession;
          const audioFile = get().audioFile;
          
          if (!currentSession || !audioFile) {
            throw new Error('No session or audio file available');
          }
          
          // Start playback
          set({ 
            isPlaying: true, 
            isPaused: false, 
            isBuffering: true,
            sessionStartTime: get().sessionStartTime || new Date()
          });
          
          // This will be implemented when audioService is available
          // await audioService.play(audioFile);
          
          // Mock successful playback start
          setTimeout(() => {
            set({ isBuffering: false });
          }, 1000);
          
        } catch (error: any) {
          get().handleError(error.message || 'Failed to start playback');
        }
      },
      
      pause: () => {
        if (get().isPlaying) {
          set({ 
            isPlaying: false, 
            isPaused: true,
            isBuffering: false
          });
          
          // This will be implemented when audioService is available
          // audioService.pause();
        }
      },
      
      stop: () => {
        // Complete session if significant progress was made
        if (get().completionPercentage > 10) {
          get().completeSession();
        }
        
        set({ 
          isPlaying: false, 
          isPaused: false,
          isBuffering: false,
          progress: 0,
          sessionStartTime: null,
          totalListenTime: 0,
          completionPercentage: 0,
          hasCompletedSession: false
        });
        
        // This will be implemented when audioService is available
        // audioService.stop();
      },
      
      resume: () => {
        if (get().isPaused) {
          set({ 
            isPlaying: true, 
            isPaused: false,
            sessionStartTime: get().sessionStartTime || new Date()
          });
          
          // This will be implemented when audioService is available
          // audioService.resume();
        }
      },
      
      seekTo: (position: number) => {
        const duration = get().duration;
        const clampedPosition = Math.max(0, Math.min(position, duration));
        
        set({ progress: clampedPosition });
        get().updateProgress(clampedPosition);
        
        // This will be implemented when audioService is available
        // audioService.seekTo(clampedPosition);
      },
      
      seekForward: (seconds: number) => {
        const currentPosition = get().progress;
        const newPosition = currentPosition + seconds;
        get().seekTo(newPosition);
      },
      
      seekBackward: (seconds: number) => {
        const currentPosition = get().progress;
        const newPosition = currentPosition - seconds;
        get().seekTo(newPosition);
      },
      
      setVolume: (volume: number) => {
        const clampedVolume = Math.max(0, Math.min(volume, 1));
        set({ volume: clampedVolume });
        
        // This will be implemented when audioService is available
        // audioService.setVolume(clampedVolume);
      },
      
      setPlaybackRate: (rate: number) => {
        const clampedRate = Math.max(0.5, Math.min(rate, 2.0));
        set({ playbackRate: clampedRate });
        
        // This will be implemented when audioService is available
        // audioService.setPlaybackRate(clampedRate);
      },
      
      toggleMute: () => {
        const isMuted = get().isMuted;
        set({ isMuted: !isMuted });
        
        // This will be implemented when audioService is available
        // audioService.setMuted(!isMuted);
      },
      
      loadSession: async (session: Session) => {
        try {
          set({ error: null, isBuffering: true });
          
          if (!session.audioFile) {
            throw new Error('Session has no audio file');
          }
          
          // Check if audio file is downloaded for offline playback
          if (!session.audioFile.isDownloaded && !navigator.onLine) {
            throw new Error('Audio not available offline');
          }
          
          set({
            currentSession: session,
            audioFile: session.audioFile,
            duration: session.audioFile.duration,
            progress: 0,
            completionPercentage: 0,
            hasCompletedSession: false,
            totalListenTime: 0,
            isBuffering: false
          });
          
          // This will be implemented when audioService is available
          // await audioService.loadAudio(session.audioFile);
          
        } catch (error: any) {
          get().handleError(error.message || 'Failed to load session');
        }
      },
      
      completeSession: () => {
        const currentSession = get().currentSession;
        if (!currentSession) return;
        
        const totalListenTime = get().totalListenTime;
        const sessionDuration = get().duration;
        const completionPercentage = sessionDuration > 0 
          ? Math.round((totalListenTime / sessionDuration) * 100)
          : 0;
        
        set({ 
          hasCompletedSession: true,
          completionPercentage
        });
        
        // This will trigger session completion tracking
        // sessionStore.incrementPlayCount(currentSession.id);
        // userStore.incrementSessionStats(Math.round(sessionDuration / 60), currentSession.config.goals);
      },
      
      updateProgress: (currentTime: number) => {
        const duration = get().duration;
        const sessionStartTime = get().sessionStartTime;
        
        if (duration === 0) return;
        
        const completionPercentage = Math.round((currentTime / duration) * 100);
        
        // Update total listen time if session is playing
        let totalListenTime = get().totalListenTime;
        if (get().isPlaying && sessionStartTime) {
          const now = new Date();
          const timeSinceStart = (now.getTime() - sessionStartTime.getTime()) / 1000;
          totalListenTime = Math.min(totalListenTime + 1, duration); // Add 1 second, cap at duration
        }
        
        set({ 
          progress: currentTime,
          completionPercentage,
          totalListenTime
        });
        
        // Auto-complete session if reached end
        if (completionPercentage >= 95 && !get().hasCompletedSession) {
          get().completeSession();
        }
      },
      
      addToQueue: (sessions: Session[]) => {
        const currentQueue = get().playQueue;
        set({ playQueue: [...currentQueue, ...sessions] });
      },
      
      removeFromQueue: (sessionId: string) => {
        const currentQueue = get().playQueue;
        const currentIndex = get().currentQueueIndex;
        
        const newQueue = currentQueue.filter(session => session.id !== sessionId);
        let newIndex = currentIndex;
        
        // Adjust current index if necessary
        if (currentIndex >= newQueue.length) {
          newIndex = Math.max(0, newQueue.length - 1);
        }
        
        set({ 
          playQueue: newQueue,
          currentQueueIndex: newIndex
        });
      },
      
      clearQueue: () => {
        set({ 
          playQueue: [],
          currentQueueIndex: -1
        });
      },
      
      playNext: async () => {
        const queue = get().playQueue;
        const currentIndex = get().currentQueueIndex;
        const repeatMode = get().repeatMode;
        const isShuffling = get().isShuffling;
        
        let nextIndex = -1;
        
        if (repeatMode === 'track') {
          // Repeat current track
          nextIndex = currentIndex;
        } else if (isShuffling) {
          // Random next track
          const availableIndices = queue.map((_, index) => index).filter(i => i !== currentIndex);
          nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        } else {
          // Sequential next track
          nextIndex = currentIndex + 1;
          
          if (nextIndex >= queue.length) {
            if (repeatMode === 'queue') {
              nextIndex = 0; // Loop back to start
            } else {
              return; // End of queue
            }
          }
        }
        
        if (nextIndex >= 0 && nextIndex < queue.length) {
          set({ currentQueueIndex: nextIndex });
          await get().play(queue[nextIndex]);
        }
      },
      
      playPrevious: async () => {
        const queue = get().playQueue;
        const currentIndex = get().currentQueueIndex;
        
        let previousIndex = currentIndex - 1;
        
        if (previousIndex < 0) {
          previousIndex = queue.length - 1; // Loop to end
        }
        
        if (previousIndex >= 0 && previousIndex < queue.length) {
          set({ currentQueueIndex: previousIndex });
          await get().play(queue[previousIndex]);
        }
      },
      
      setQueueIndex: (index: number) => {
        const queue = get().playQueue;
        if (index >= 0 && index < queue.length) {
          set({ currentQueueIndex: index });
        }
      },
      
      toggleShuffle: () => {
        set({ isShuffling: !get().isShuffling });
      },
      
      setRepeatMode: (mode: RepeatMode) => {
        set({ repeatMode: mode });
      },
      
      preloadAudio: async (session: Session) => {
        if (!session.audioFile) return;
        
        try {
          // This will be implemented when audioService is available
          // await audioService.preload(session.audioFile);
        } catch (error: any) {
          console.warn('Failed to preload audio:', error.message);
        }
      },
      
      handleError: (error: string) => {
        set({ 
          error,
          isPlaying: false,
          isPaused: false,
          isBuffering: false
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      reset: () => {
        set({
          currentSession: null,
          audioFile: null,
          isPlaying: false,
          isPaused: false,
          isBuffering: false,
          progress: 0,
          duration: 0,
          volume: 0.8,
          playbackRate: 1.0,
          isLooping: false,
          isMuted: false,
          error: null,
          sessionStartTime: null,
          totalListenTime: 0,
          completionPercentage: 0,
          hasCompletedSession: false,
          playQueue: [],
          currentQueueIndex: -1,
          isShuffling: false,
          repeatMode: 'none'
        });
      }
    }),
    {
      name: 'playback-store'
    }
  )
);

// Selector hooks for performance optimization
export const useCurrentPlaybackSession = () => usePlaybackStore(state => state.currentSession);
export const useIsPlaying = () => usePlaybackStore(state => state.isPlaying);
export const useIsPaused = () => usePlaybackStore(state => state.isPaused);
export const useIsBuffering = () => usePlaybackStore(state => state.isBuffering);
export const usePlaybackProgress = () => usePlaybackStore(state => state.progress);
export const usePlaybackDuration = () => usePlaybackStore(state => state.duration);
export const usePlaybackVolume = () => usePlaybackStore(state => state.volume);
export const usePlaybackRate = () => usePlaybackStore(state => state.playbackRate);
export const usePlaybackError = () => usePlaybackStore(state => state.error);
export const usePlayQueue = () => usePlaybackStore(state => state.playQueue);
export const useRepeatMode = () => usePlaybackStore(state => state.repeatMode);
export const useIsShuffling = () => usePlaybackStore(state => state.isShuffling);

// Computed selectors
export const usePlaybackProgressInfo = (): PlaybackProgress => usePlaybackStore(state => ({
  position: state.progress,
  duration: state.duration,
  percentage: state.duration > 0 ? Math.round((state.progress / state.duration) * 100) : 0,
  remainingTime: Math.max(0, state.duration - state.progress)
}));

export const useSessionProgress = () => usePlaybackStore(state => ({
  completionPercentage: state.completionPercentage,
  totalListenTime: state.totalListenTime,
  hasCompleted: state.hasCompletedSession,
  sessionStartTime: state.sessionStartTime
}));

export const useCanPlayNext = () => usePlaybackStore(state => {
  const { playQueue, currentQueueIndex, repeatMode } = state;
  return playQueue.length > 0 && (
    currentQueueIndex < playQueue.length - 1 || 
    repeatMode === 'queue' || 
    repeatMode === 'track'
  );
});

export const useCanPlayPrevious = () => usePlaybackStore(state => {
  const { playQueue, currentQueueIndex } = state;
  return playQueue.length > 0 && currentQueueIndex > 0;
});

export const useCurrentQueueSession = () => usePlaybackStore(state => {
  const { playQueue, currentQueueIndex } = state;
  return currentQueueIndex >= 0 && currentQueueIndex < playQueue.length
    ? playQueue[currentQueueIndex]
    : null;
});
