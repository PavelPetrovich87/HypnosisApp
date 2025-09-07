import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  verificationStatus: VerificationStatus;
  error: string | null;
}

export type VerificationStatus = 'pending' | 'verified' | 'failed' | 'required';

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export interface AuthResult {
  token: string;
  user: any; // Will be properly typed when user service is available
  isEmailVerified: boolean;
}

// Store implementation
export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        isAuthenticated: false,
        token: null,
        isLoading: false,
        verificationStatus: 'pending',
        error: null,
        
        // Actions
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            // This will be implemented when authService is available
            // const result = await authService.login(email, password);
            
            // Mock successful login for now
            const mockResult: AuthResult = {
              token: 'mock-jwt-token-' + Date.now(),
              user: { email, id: '1' },
              isEmailVerified: true
            };
            
            set({ 
              isAuthenticated: true, 
              token: mockResult.token,
              verificationStatus: mockResult.isEmailVerified ? 'verified' : 'required',
              isLoading: false,
              error: null
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Login failed', 
              isLoading: false,
              isAuthenticated: false,
              token: null
            });
            // ErrorService.handleError will be integrated when available
            throw error;
          }
        },
        
        register: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            // This will be implemented when authService is available
            // const result = await authService.register(email, password);
            
            // Mock successful registration
            const mockResult: AuthResult = {
              token: 'mock-jwt-token-' + Date.now(),
              user: { email, id: '1' },
              isEmailVerified: false
            };
            
            set({ 
              isAuthenticated: true, 
              token: mockResult.token,
              verificationStatus: 'required',
              isLoading: false,
              error: null
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Registration failed', 
              isLoading: false 
            });
            throw error;
          }
        },
        
        verifyEmail: async (verificationToken: string) => {
          set({ isLoading: true, error: null });
          try {
            // This will be implemented when authService is available
            // await authService.verifyEmail(verificationToken);
            
            set({ 
              verificationStatus: 'verified',
              isLoading: false,
              error: null
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Email verification failed',
              verificationStatus: 'failed',
              isLoading: false 
            });
            throw error;
          }
        },
        
        refreshToken: async () => {
          const currentToken = get().token;
          if (!currentToken) {
            throw new Error('No token to refresh');
          }
          
          try {
            // This will be implemented when authService is available
            // const newToken = await authService.refreshToken();
            const newToken = 'refreshed-' + currentToken;
            
            set({ token: newToken });
          } catch (error: any) {
            // Clear invalid token and logout user
            set({ 
              isAuthenticated: false, 
              token: null,
              verificationStatus: 'pending',
              error: 'Session expired'
            });
            throw error;
          }
        },
        
        logout: async () => {
          try {
            // This will be implemented when authService is available
            // await authService.logout();
            
            // Always clear local state even if logout fails
            set({ 
              isAuthenticated: false, 
              token: null,
              verificationStatus: 'pending',
              error: null
            });
          } catch (error: any) {
            // Even if logout fails, clear local state
            set({ 
              isAuthenticated: false, 
              token: null,
              verificationStatus: 'pending'
            });
          }
        },
        
        clearError: () => {
          set({ error: null });
        },
        
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        }
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({ 
          token: state.token, 
          isAuthenticated: state.isAuthenticated,
          verificationStatus: state.verificationStatus
        })
      }
    ),
    {
      name: 'auth-store'
    }
  )
);

// Selector hooks for performance optimization
export const useAuthStatus = () => useAuthStore(state => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(state => state.error);
export const useAuthToken = () => useAuthStore(state => state.token);
export const useVerificationStatus = () => useAuthStore(state => state.verificationStatus);
