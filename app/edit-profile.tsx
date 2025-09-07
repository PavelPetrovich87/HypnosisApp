import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

const VOICES = [
  { id: 'female1', name: 'Sarah', description: 'Calm & Soothing', gender: 'female' },
  { id: 'male1', name: 'David', description: 'Deep & Relaxing', gender: 'male' },
  { id: 'female2', name: 'Emma', description: 'Gentle & Warm', gender: 'female' },
  { id: 'male2', name: 'Michael', description: 'Confident & Clear', gender: 'male' },
];

export default function EditProfileScreen() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [selectedVoice, setSelectedVoice] = useState('female1');
  const [hasChanges, setHasChanges] = useState(false);

  const handleVoicePreview = (voiceId: string) => {
    Alert.alert('Voice Preview', `Playing 10-second preview of ${VOICES.find(v => v.id === voiceId)?.name}`);
  };

  const handleSave = () => {
    // Save profile changes
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  const updateField = (field: string, value: string) => {
    setHasChanges(true);
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'voice') setSelectedVoice(value);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity 
          style={[styles.saveButton, hasChanges && styles.saveButtonActive]} 
          onPress={handleSave}
          disabled={!hasChanges}
        >
          <Text style={[styles.saveButtonText, hasChanges && styles.saveButtonTextActive]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.avatarCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name test</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Enter your name"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.inputNote}>
              ✅ Verified • Used for account recovery and notifications
            </Text>
          </View>
        </View>

        <View style={styles.voiceSection}>
          <Text style={styles.sectionTitle}>Preferred Voice</Text>
          <Text style={styles.sectionSubtitle}>Choose the voice for your hypnosis sessions</Text>
          
          {VOICES.map((voice) => (
            <TouchableOpacity
              key={voice.id}
              style={[
                styles.voiceOption,
                selectedVoice === voice.id && styles.voiceOptionSelected
              ]}
              onPress={() => updateField('voice', voice.id)}
            >
              <View style={styles.voiceInfo}>
                <Text style={styles.voiceName}>
                  {voice.gender === 'female' ? '👩' : '👨'} {voice.name}
                </Text>
                <Text style={styles.voiceDescription}>{voice.description}</Text>
              </View>
              <TouchableOpacity
                style={styles.previewButton}
                onPress={() => handleVoicePreview(voice.id)}
              >
                <Text style={styles.previewButtonText}>▶️ Preview</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dangerZoneCard}>
          <Text style={styles.dangerZoneTitle}>Account Actions</Text>
          
          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Change Password</Text>
            <Text style={styles.dangerButtonArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Export Data</Text>
            <Text style={styles.dangerButtonArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.dangerButton, styles.deleteButton]}>
            <Text style={[styles.dangerButtonText, styles.deleteButtonText]}>Delete Account</Text>
            <Text style={styles.dangerButtonArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Figma-aligned white background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24, // Figma screen padding
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {},
  cancelButtonText: {
    fontSize: 14, // Inter button text
    fontWeight: '500',
    color: '#67AAF9', // Figma blue accent
  },
  title: {
    fontSize: 20, // Archivo section header
    fontWeight: '600',
    color: '#171A1F', // Figma primary text
  },
  saveButton: {},
  saveButtonActive: {},
  saveButtonText: {
    fontSize: 14, // Inter button text
    fontWeight: '500',
    color: '#565D6D', // Figma secondary color for disabled
  },
  saveButtonTextActive: {
    color: '#67AAF9', // Figma blue accent
  },
  avatarCard: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 30,
    marginHorizontal: 24, // Figma screen padding
    marginTop: 20,
    borderRadius: 10, // Figma card border radius
    // Figma shadow specifications
    shadowColor: 'rgba(23, 26, 31, 0.07)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  avatar: {
    width: 80, // Match profile screen avatar size
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DEE1E6', // Figma input background color
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32, // Keep consistent with profile screen
  },
  changePhotoButton: {},
  changePhotoText: {
    fontSize: 16,
    color: '#67AAF9', // Figma blue accent
    fontWeight: '500', // Inter weight
  },
  formContainer: {
    paddingHorizontal: 24, // Figma screen padding
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10, // Figma card border radius
    marginTop: 20,
    // Figma shadow specifications
    shadowColor: 'rgba(23, 26, 31, 0.07)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16, // Inter form label
    fontWeight: '500',
    marginBottom: 8,
    color: '#171A1F', // Figma primary text
  },
  input: {
    backgroundColor: '#DEE1E6', // Figma input background
    paddingHorizontal: 12, // Figma input padding
    paddingVertical: 11,
    borderRadius: 6, // Figma border radius system
    borderWidth: 1,
    borderColor: '#DEE1E6', // Figma border color
    fontSize: 14, // Inter body text
    color: '#171A1F', // Figma primary text
  },
  inputNote: {
    fontSize: 12,
    color: '#565D6D', // Figma secondary text
    marginTop: 5,
  },
  voiceSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20, // Archivo section header
    fontWeight: '600',
    color: '#171A1F', // Figma primary text
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14, // Inter body text
    color: '#565D6D', // Figma secondary text
    marginBottom: 16,
  },
  voiceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10, // Figma selection container radius
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DEE1E6', // Figma default border
    // Figma shadow specifications
    shadowColor: 'rgba(23, 26, 31, 0.07)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  voiceOptionSelected: {
    borderColor: '#67AAF9', // Figma selected border
    backgroundColor: '#FAFAFB', // Figma secondary background for selection
  },
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontSize: 16, // Inter form label size
    fontWeight: '500',
    color: '#171A1F', // Figma primary text
    marginBottom: 4,
  },
  voiceDescription: {
    fontSize: 14, // Inter body text
    color: '#565D6D', // Figma secondary text
  },
  previewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEE1E6', // Figma border color
    borderRadius: 6, // Figma border radius
  },
  previewButtonText: {
    fontSize: 12,
    color: '#67AAF9', // Figma blue accent
    fontWeight: '500',
  },
  dangerZoneCard: {
    marginTop: 30,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10, // Figma card border radius
    // Figma shadow specifications
    shadowColor: 'rgba(23, 26, 31, 0.07)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  dangerZoneTitle: {
    fontSize: 20, // Archivo section header
    fontWeight: '600',
    color: '#171A1F', // Figma primary text
    marginBottom: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16, // 48px minimum touch target
    borderRadius: 6, // Figma border radius
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DEE1E6', // Figma border color
    backgroundColor: '#FAFAFB', // Figma secondary background
  },
  deleteButton: {
    borderColor: '#ff3b30',
    backgroundColor: '#fff5f5',
  },
  dangerButtonText: {
    fontSize: 16, // Inter form label size
    fontWeight: '500',
    color: '#171A1F', // Figma primary text
  },
  deleteButtonText: {
    color: '#ff3b30',
  },
  dangerButtonArrow: {
    fontSize: 18,
    color: '#565D6D', // Figma secondary color
  },
  bottomPadding: {
    height: 40,
  },
});

