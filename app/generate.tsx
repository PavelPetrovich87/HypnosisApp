import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

const DURATIONS = [
  { id: '10', label: '10 min', subtitle: 'Quick session' },
  { id: '15', label: '15 min', subtitle: 'Standard' },
  { id: '20', label: '20 min', subtitle: 'Deep dive' },
  { id: '30', label: '30 min', subtitle: 'Extended' },
];

const BACKGROUNDS = [
  { id: 'nature', label: 'Nature Sounds', icon: '🌿' },
  { id: 'ocean', label: 'Ocean Waves', icon: '🌊' },
  { id: 'rain', label: 'Rain', icon: '🌧️' },
  { id: 'silence', label: 'Silence', icon: '🔇' },
];

const ENDINGS = [
  { id: 'gentle', label: 'Gentle Wake', subtitle: 'Slow and peaceful' },
  { id: 'energized', label: 'Energized Wake', subtitle: 'Ready for action' },
  { id: 'sleep', label: 'Sleep Transition', subtitle: 'Stay asleep' },
];

export default function GenerateScreen() {
  const [selectedDuration, setSelectedDuration] = useState('15');
  const [selectedBackground, setSelectedBackground] = useState('nature');
  const [selectedEnding, setSelectedEnding] = useState('gentle');

  const handleQuickGenerate = () => {
    console.log('Quick generate with:', { selectedDuration, selectedBackground, selectedEnding });
    router.push('/review');
  };

  const handleAdvancedMode = () => {
    router.push('/advanced-generate');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Generate Session</Text>
        <Text style={styles.subtitle}>Create your personalized hypnosis session</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Duration</Text>
        <View style={styles.optionsGrid}>
          {DURATIONS.map((duration) => (
            <TouchableOpacity
              key={duration.id}
              style={[
                styles.optionCard,
                selectedDuration === duration.id && styles.optionCardSelected
              ]}
              onPress={() => setSelectedDuration(duration.id)}
            >
              <Text style={[
                styles.optionLabel,
                selectedDuration === duration.id && styles.optionLabelSelected
              ]}>
                {duration.label}
              </Text>
              <Text style={[
                styles.optionSubtitle,
                selectedDuration === duration.id && styles.optionSubtitleSelected
              ]}>
                {duration.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Background Sound</Text>
        <View style={styles.optionsGrid}>
          {BACKGROUNDS.map((background) => (
            <TouchableOpacity
              key={background.id}
              style={[
                styles.optionCard,
                selectedBackground === background.id && styles.optionCardSelected
              ]}
              onPress={() => setSelectedBackground(background.id)}
            >
              <Text style={styles.optionIcon}>{background.icon}</Text>
              <Text style={[
                styles.optionLabel,
                selectedBackground === background.id && styles.optionLabelSelected
              ]}>
                {background.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session Ending</Text>
        <View style={styles.optionsColumn}>
          {ENDINGS.map((ending) => (
            <TouchableOpacity
              key={ending.id}
              style={[
                styles.endingCard,
                selectedEnding === ending.id && styles.endingCardSelected
              ]}
              onPress={() => setSelectedEnding(ending.id)}
            >
              <View style={styles.endingInfo}>
                <Text style={[
                  styles.endingLabel,
                  selectedEnding === ending.id && styles.endingLabelSelected
                ]}>
                  {ending.label}
                </Text>
                <Text style={[
                  styles.endingSubtitle,
                  selectedEnding === ending.id && styles.endingSubtitleSelected
                ]}>
                  {ending.subtitle}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedEnding === ending.id && styles.radioButtonSelected
              ]}>
                {selectedEnding === ending.id && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleQuickGenerate}>
          <Text style={styles.primaryButtonText}>⚡ Quick Generate</Text>
          <Text style={styles.primaryButtonSubtext}>Generate with current settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleAdvancedMode}>
          <Text style={styles.secondaryButtonText}>🔧 Advanced Mode</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionsColumn: {
    flexDirection: 'column',
  },
  optionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  optionCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: '#007AFF',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  optionSubtitleSelected: {
    color: '#007AFF',
  },
  endingCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  endingCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  endingInfo: {
    flex: 1,
  },
  endingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  endingLabelSelected: {
    color: '#007AFF',
  },
  endingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  endingSubtitleSelected: {
    color: '#007AFF',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#007AFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  actions: {
    padding: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  primaryButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

