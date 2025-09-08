// Feature Flags Configuration
// CRM-35: Backend Registration Integration with AuthService

/**
 * Feature flags for controlling optional functionality
 * Environment variables can be set in .env files or Expo configuration
 */

export interface FeatureFlags {
  VOICE_PREVIEW: boolean;
  MOCK_AUTH_SERVICE: boolean;
  DEBUG_MODE: boolean;
  ENHANCED_LOGGING: boolean;
}

// Get feature flag value with fallback
function getFeatureFlag(key: string, defaultValue: boolean = false): boolean {
  // Check environment variable first
  const envValue = process.env[`EXPO_PUBLIC_${key}`];
  if (envValue !== undefined) {
    return envValue.toLowerCase() === 'true';
  }
  
  // Check global config (for development)
  if (typeof global !== 'undefined' && global.__FEATURE_FLAGS__) {
    const globalFlags = global.__FEATURE_FLAGS__ as Record<string, boolean>;
    if (key in globalFlags) {
      return globalFlags[key];
    }
  }
  
  return defaultValue;
}

// Feature flags configuration
export const FEATURE_FLAGS: FeatureFlags = {
  // Voice preview functionality in onboarding
  VOICE_PREVIEW: getFeatureFlag('VOICE_PREVIEW', false),
  
  // Use mock AuthService instead of real backend
  MOCK_AUTH_SERVICE: getFeatureFlag('MOCK_AUTH_SERVICE', true),
  
  // Enable debug mode for development
  DEBUG_MODE: getFeatureFlag('DEBUG_MODE', __DEV__ || false),
  
  // Enhanced logging for troubleshooting
  ENHANCED_LOGGING: getFeatureFlag('ENHANCED_LOGGING', __DEV__ || false),
};

// Helper functions for feature flag checks
export const FeatureFlagUtils = {
  /**
   * Check if voice preview is enabled
   */
  isVoicePreviewEnabled(): boolean {
    return FEATURE_FLAGS.VOICE_PREVIEW;
  },

  /**
   * Check if mock auth service should be used
   */
  shouldUseMockAuthService(): boolean {
    return FEATURE_FLAGS.MOCK_AUTH_SERVICE;
  },

  /**
   * Check if debug mode is enabled
   */
  isDebugMode(): boolean {
    return FEATURE_FLAGS.DEBUG_MODE;
  },

  /**
   * Check if enhanced logging is enabled
   */
  isEnhancedLoggingEnabled(): boolean {
    return FEATURE_FLAGS.ENHANCED_LOGGING;
  },

  /**
   * Log feature flag status (for debugging)
   */
  logFeatureFlags(): void {
    if (FEATURE_FLAGS.DEBUG_MODE) {
      console.log('🏳️ Feature Flags Status:', FEATURE_FLAGS);
    }
  },

  /**
   * Override feature flag at runtime (for testing)
   */
  overrideFlag(key: keyof FeatureFlags, value: boolean): void {
    if (FEATURE_FLAGS.DEBUG_MODE) {
      (FEATURE_FLAGS as any)[key] = value;
      console.log(`🏳️ Feature flag overridden: ${key} = ${value}`);
    }
  },

  /**
   * Get all feature flags as readonly object
   */
  getAllFlags(): Readonly<FeatureFlags> {
    return { ...FEATURE_FLAGS };
  }
};

// Development utilities
export const DevFeatureFlags = {
  /**
   * Enable voice preview for development
   */
  enableVoicePreview(): void {
    FeatureFlagUtils.overrideFlag('VOICE_PREVIEW', true);
  },

  /**
   * Disable voice preview for development
   */
  disableVoicePreview(): void {
    FeatureFlagUtils.overrideFlag('VOICE_PREVIEW', false);
  },

  /**
   * Toggle voice preview
   */
  toggleVoicePreview(): void {
    FeatureFlagUtils.overrideFlag('VOICE_PREVIEW', !FEATURE_FLAGS.VOICE_PREVIEW);
  },

  /**
   * Enable enhanced logging for debugging
   */
  enableEnhancedLogging(): void {
    FeatureFlagUtils.overrideFlag('ENHANCED_LOGGING', true);
  },

  /**
   * Reset all flags to default values
   */
  resetFlags(): void {
    if (FEATURE_FLAGS.DEBUG_MODE) {
      FEATURE_FLAGS.VOICE_PREVIEW = getFeatureFlag('VOICE_PREVIEW', false);
      FEATURE_FLAGS.MOCK_AUTH_SERVICE = getFeatureFlag('MOCK_AUTH_SERVICE', true);
      FEATURE_FLAGS.DEBUG_MODE = getFeatureFlag('DEBUG_MODE', __DEV__ || false);
      FEATURE_FLAGS.ENHANCED_LOGGING = getFeatureFlag('ENHANCED_LOGGING', __DEV__ || false);
      console.log('🏳️ Feature flags reset to defaults');
    }
  }
};

// Log initial feature flags state
if (FEATURE_FLAGS.DEBUG_MODE) {
  FeatureFlagUtils.logFeatureFlags();
}

// Export default flags for easy import
export default FEATURE_FLAGS;
