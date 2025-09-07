// ViewModels Layer - MVVM Pattern Implementation
// Following creative phase specifications for business logic coordination

// Core ViewModels
export { AuthViewModel, authViewModel } from './authViewModel';
import { AuthViewModel, authViewModel } from './authViewModel';

// Types
export type {
  LoginCredentials,
  RegisterData,
  EmailVerificationData,
  PasswordResetData,
  AuthValidationResult
} from './authViewModel';

// ViewModel base interfaces and utilities
export interface BaseViewModel {
  isLoading: boolean;
  error: string | null;
  clearError(): void;
}

// ViewModel factory for dependency injection
export interface ViewModelDependencies {
  // Services will be injected here when available
  // authService?: AuthService;
  // userService?: UserService;
  // sessionService?: SessionService;
}

export class ViewModelFactory {
  private static dependencies: ViewModelDependencies = {};
  
  static setDependencies(deps: Partial<ViewModelDependencies>): void {
    this.dependencies = { ...this.dependencies, ...deps };
  }
  
  static getDependencies(): ViewModelDependencies {
    return { ...this.dependencies };
  }
  
  // Factory methods for creating ViewModels with dependencies
  static createAuthViewModel(): AuthViewModel {
    return new AuthViewModel();
  }
  
  // Additional ViewModels will be created here:
  // static createHomeViewModel(): HomeViewModel {
  //   return new HomeViewModel(this.dependencies.userService, this.dependencies.sessionService);
  // }
  //
  // static createSessionCreationViewModel(): SessionCreationViewModel {
  //   return new SessionCreationViewModel(this.dependencies.sessionService);
  // }
}

// ViewModel initialization and management
export const ViewModels = {
  // Singleton instances
  auth: authViewModel,
  
  // Factory methods
  createAuth: () => ViewModelFactory.createAuthViewModel(),
  
  // Utility methods
  clearAllErrors: () => {
    authViewModel.clearError();
    // Additional ViewModels will be cleared here
  },
  
  // State getters for debugging
  getAllStates: () => ({
    auth: {
      isAuthenticated: authViewModel.isAuthenticated,
      isLoading: authViewModel.isLoading,
      error: authViewModel.error
    }
    // Additional ViewModel states will be included here
  })
};

export default ViewModels;
