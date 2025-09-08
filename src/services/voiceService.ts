// Voice Service - CRM-35: Voice Preview Integration
// Provides voice management and preference storage

import { VoiceOption } from '../components/VoicePreview';

export interface VoicePreference {
  userId: string;
  selectedVoiceId: string;
  voiceName: string;
  language: string;
  gender: 'male' | 'female';
  lastUpdated: string;
}

export interface VoicePlaybackResult {
  success: boolean;
  duration?: number;
  error?: string;
}

export interface VoiceServiceConfig {
  enablePreview: boolean;
  previewDuration: number;
  audioQuality: 'low' | 'medium' | 'high';
  cacheEnabled: boolean;
}

const DEFAULT_CONFIG: VoiceServiceConfig = {
  enablePreview: true,
  previewDuration: 10000, // 10 seconds
  audioQuality: 'medium',
  cacheEnabled: true
};

export class VoiceService {
  private config: VoiceServiceConfig;
  private preferences: Map<string, VoicePreference> = new Map();

  constructor(config: Partial<VoiceServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    console.log('🎤 VoiceService initialized', this.config);
  }

  /**
   * Get available voice options
   */
  async getAvailableVoices(): Promise<VoiceOption[]> {
    console.log('🎤 VoiceService: Getting available voices');
    
    // In a real implementation, this would fetch from a backend or local storage
    // For now, return the hardcoded options
    const voices: VoiceOption[] = [
      {
        id: 'female_english_1',
        name: 'Sarah',
        description: 'Calm & Soothing',
        gender: 'female',
        language: 'en-US'
      },
      {
        id: 'male_english_1',
        name: 'David',
        description: 'Deep & Relaxing',
        gender: 'male',
        language: 'en-US'
      },
      {
        id: 'female_english_2',
        name: 'Emma',
        description: 'Gentle & Warm',
        gender: 'female',
        language: 'en-UK'
      },
      {
        id: 'male_english_2',
        name: 'Michael',
        description: 'Confident & Clear',
        gender: 'male',
        language: 'en-US'
      }
    ];

    return voices;
  }

  /**
   * Save user's voice preference
   */
  async saveVoicePreference(userId: string, voiceId: string): Promise<void> {
    console.log('🎤 VoiceService: Saving voice preference', { userId, voiceId });
    
    try {
      const voices = await this.getAvailableVoices();
      const selectedVoice = voices.find(v => v.id === voiceId);
      
      if (!selectedVoice) {
        throw new Error(`Voice with ID ${voiceId} not found`);
      }

      const preference: VoicePreference = {
        userId,
        selectedVoiceId: voiceId,
        voiceName: selectedVoice.name,
        language: selectedVoice.language,
        gender: selectedVoice.gender,
        lastUpdated: new Date().toISOString()
      };

      // Store in memory (in real implementation, would save to backend/storage)
      this.preferences.set(userId, preference);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ VoiceService: Voice preference saved', preference);
      
    } catch (error) {
      console.error('❌ VoiceService: Failed to save voice preference', error);
      throw error;
    }
  }

  /**
   * Get user's voice preference
   */
  async getVoicePreference(userId: string): Promise<VoicePreference | null> {
    console.log('🎤 VoiceService: Getting voice preference for user', userId);
    
    try {
      // Get from memory (in real implementation, would fetch from backend/storage)
      const preference = this.preferences.get(userId) || null;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log('📖 VoiceService: Voice preference retrieved', preference);
      return preference;
      
    } catch (error) {
      console.error('❌ VoiceService: Failed to get voice preference', error);
      return null;
    }
  }

  /**
   * Play voice preview
   */
  async playVoicePreview(voiceId: string): Promise<VoicePlaybackResult> {
    console.log('🎵 VoiceService: Playing voice preview', { voiceId });
    
    try {
      if (!this.config.enablePreview) {
        throw new Error('Voice preview is disabled');
      }

      const voices = await this.getAvailableVoices();
      const voice = voices.find(v => v.id === voiceId);
      
      if (!voice) {
        throw new Error(`Voice with ID ${voiceId} not found`);
      }

      // Simulate loading/playing audio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ VoiceService: Voice preview started', { 
        voiceId, 
        voiceName: voice.name,
        duration: this.config.previewDuration 
      });

      return {
        success: true,
        duration: this.config.previewDuration
      };
      
    } catch (error) {
      console.error('❌ VoiceService: Voice preview failed', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Stop voice preview
   */
  async stopVoicePreview(): Promise<void> {
    console.log('⏹️ VoiceService: Stopping voice preview');
    
    // In a real implementation, this would stop audio playback
    // For now, just log
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('✅ VoiceService: Voice preview stopped');
  }

  /**
   * Get recommended voices based on user preferences
   */
  async getRecommendedVoices(userId: string): Promise<VoiceOption[]> {
    console.log('🎯 VoiceService: Getting recommended voices for user', userId);
    
    try {
      const allVoices = await this.getAvailableVoices();
      const userPreference = await this.getVoicePreference(userId);
      
      // Simple recommendation logic: prioritize same gender and language
      if (userPreference) {
        const recommended = allVoices.sort((a, b) => {
          let scoreA = 0;
          let scoreB = 0;
          
          // Prefer same gender
          if (a.gender === userPreference.gender) scoreA += 2;
          if (b.gender === userPreference.gender) scoreB += 2;
          
          // Prefer same language
          if (a.language === userPreference.language) scoreA += 1;
          if (b.language === userPreference.language) scoreB += 1;
          
          return scoreB - scoreA;
        });
        
        return recommended.slice(0, 2); // Return top 2 recommendations
      }
      
      // If no preference, return first two voices
      return allVoices.slice(0, 2);
      
    } catch (error) {
      console.error('❌ VoiceService: Failed to get recommendations', error);
      return [];
    }
  }

  /**
   * Update service configuration
   */
  updateConfig(config: Partial<VoiceServiceConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('⚙️ VoiceService: Configuration updated', this.config);
  }

  /**
   * Get current configuration
   */
  getConfig(): VoiceServiceConfig {
    return { ...this.config };
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    console.log('🧹 VoiceService: Clearing cache');
    this.preferences.clear();
    console.log('✅ VoiceService: Cache cleared');
  }

  /**
   * Health check for voice service
   */
  async healthCheck(): Promise<{ healthy: boolean; message: string }> {
    try {
      // Basic health check - verify we can get voices
      const voices = await this.getAvailableVoices();
      
      if (voices.length === 0) {
        return { healthy: false, message: 'No voices available' };
      }
      
      return { healthy: true, message: `${voices.length} voices available` };
      
    } catch (error) {
      return { 
        healthy: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// Export singleton instance
export const voiceService = new VoiceService();

// Export default for easy importing
export default voiceService;
