// Voice Preview Component - CRM-35: Voice Preview Integration
// Feature-flagged voice preview for onboarding flow

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FEATURE_FLAGS, FeatureFlagUtils } from '../services/featureFlags';

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
  language: string;
  accent?: string;
}

const VOICE_OPTIONS: VoiceOption[] = [
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
    language: 'en-UK',
    accent: 'British'
  },
  {
    id: 'male_english_2',
    name: 'Michael',
    description: 'Confident & Clear',
    gender: 'male',
    language: 'en-US'
  }
];

interface VoicePreviewProps {
  selectedVoice?: string;
  onVoiceSelect?: (voiceId: string) => void;
  onVoicePreview?: (voiceId: string) => void;
  showTitle?: boolean;
  compact?: boolean;
}

export const VoicePreview: React.FC<VoicePreviewProps> = ({
  selectedVoice,
  onVoiceSelect,
  onVoicePreview,
  showTitle = true,
  compact = false
}) => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  // Don't render if feature flag is disabled
  if (!FeatureFlagUtils.isVoicePreviewEnabled()) {
    console.log('🏳️ VoicePreview: Feature disabled, not rendering');
    return null;
  }

  const handleVoiceSelect = (voiceId: string) => {
    console.log('🎤 VoicePreview: Voice selected', { voiceId });
    onVoiceSelect?.(voiceId);
  };

  const handleVoicePreview = async (voiceId: string) => {
    const voice = VOICE_OPTIONS.find(v => v.id === voiceId);
    if (!voice) return;

    console.log('🎵 VoicePreview: Starting preview', { voiceId, voiceName: voice.name });
    
    try {
      setIsPlaying(voiceId);
      
      // Simulate voice preview (in real implementation, this would play audio)
      Alert.alert(
        'Voice Preview', 
        `Playing 10-second preview of ${voice.name} (${voice.description}).\n\nIn a real implementation, this would play a sample hypnosis session introduction.`,
        [
          {
            text: 'Stop Preview',
            style: 'cancel',
            onPress: () => setIsPlaying(null)
          },
          {
            text: 'Select This Voice',
            onPress: () => {
              setIsPlaying(null);
              handleVoiceSelect(voiceId);
            }
          }
        ]
      );

      // Simulate preview duration
      setTimeout(() => {
        setIsPlaying(null);
        console.log('🎵 VoicePreview: Preview completed', { voiceId });
      }, 10000); // 10 seconds

      // Callback for parent component
      onVoicePreview?.(voiceId);
      
    } catch (error) {
      console.error('❌ VoicePreview: Preview failed', error);
      setIsPlaying(null);
      Alert.alert('Preview Error', 'Unable to play voice preview. Please try again.');
    }
  };

  const stopPreview = () => {
    console.log('⏹️ VoicePreview: Stopping preview');
    setIsPlaying(null);
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactTitle}>Voice Preview Available</Text>
        <Text style={styles.compactSubtitle}>
          Choose your preferred voice for hypnosis sessions
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showTitle && (
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Voice</Text>
          <Text style={styles.subtitle}>
            Select the voice for your personalized hypnosis sessions
          </Text>
        </View>
      )}

      <View style={styles.voiceList}>
        {VOICE_OPTIONS.map((voice) => (
          <TouchableOpacity
            key={voice.id}
            style={[
              styles.voiceOption,
              selectedVoice === voice.id && styles.voiceOptionSelected
            ]}
            onPress={() => handleVoiceSelect(voice.id)}
            activeOpacity={0.7}
          >
            <View style={styles.voiceInfo}>
              <View style={styles.voiceHeader}>
                <Text style={styles.voiceName}>
                  {voice.gender === 'female' ? '👩' : '👨'} {voice.name}
                </Text>
                {voice.accent && (
                  <Text style={styles.voiceAccent}>{voice.accent}</Text>
                )}
              </View>
              <Text style={styles.voiceDescription}>
                {voice.description} • {voice.language}
              </Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.previewButton,
                isPlaying === voice.id && styles.previewButtonPlaying
              ]}
              onPress={() => 
                isPlaying === voice.id 
                  ? stopPreview() 
                  : handleVoicePreview(voice.id)
              }
              disabled={isPlaying !== null && isPlaying !== voice.id}
            >
              <Text style={[
                styles.previewButtonText,
                isPlaying === voice.id && styles.previewButtonTextPlaying
              ]}>
                {isPlaying === voice.id ? '⏹️ Stop' : '▶️ Preview'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {isPlaying && (
        <View style={styles.nowPlaying}>
          <Text style={styles.nowPlayingText}>
            🎵 Playing preview...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  compactContainer: {
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginVertical: 10,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  compactSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  voiceList: {
    gap: 12,
  },
  voiceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  voiceOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  voiceInfo: {
    flex: 1,
    marginRight: 12,
  },
  voiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  voiceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  voiceAccent: {
    fontSize: 12,
    color: '#007AFF',
    marginLeft: 8,
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  voiceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  previewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  previewButtonPlaying: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  previewButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  previewButtonTextPlaying: {
    color: '#f44336',
  },
  nowPlaying: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    alignItems: 'center',
  },
  nowPlayingText: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '500',
  },
});

export default VoicePreview;
