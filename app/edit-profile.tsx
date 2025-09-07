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

      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preferred Voice</Text>
          <Text style={styles.sublabel}>Choose the voice for your hypnosis sessions</Text>
          
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

        <View style={styles.dangerZone}>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  cancelButton: {},
  cancelButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {},
  saveButtonActive: {},
  saveButtonText: {
    fontSize: 16,
    color: '#ccc',
    fontWeight: '600',
  },
  saveButtonTextActive: {
    color: '#007AFF',
  },
  avatarSection: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
  },
  changePhotoButton: {},
  changePhotoText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  sublabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  inputNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  voiceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  voiceOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  voiceDescription: {
    fontSize: 14,
    color: '#666',
  },
  previewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  previewButtonText: {
    fontSize: 12,
    color: '#007AFF',
  },
  dangerZone: {
    marginTop: 30,
  },
  dangerZoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  dangerButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  deleteButton: {
    borderColor: '#ff3b30',
    backgroundColor: '#fff5f5',
  },
  dangerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  deleteButtonText: {
    color: '#ff3b30',
  },
  dangerButtonArrow: {
    fontSize: 18,
    color: '#ccc',
  },
  bottomPadding: {
    height: 40,
  },
});

