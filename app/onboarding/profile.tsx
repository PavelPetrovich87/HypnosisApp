import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

const VOICES = [
  { id: 'female1', name: 'Sarah', description: 'Calm & Soothing', gender: 'female' },
  { id: 'male1', name: 'David', description: 'Deep & Relaxing', gender: 'male' },
  { id: 'female2', name: 'Emma', description: 'Gentle & Warm', gender: 'female' },
  { id: 'male2', name: 'Michael', description: 'Confident & Clear', gender: 'male' },
];

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleVoicePreview = (voiceId: string) => {
    Alert.alert('Voice Preview', `Playing 10-second preview of ${VOICES.find(v => v.id === voiceId)?.name}`);
  };

  const handleRegister = () => {
    if (!name.trim() || !selectedVoice || !email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    
    // Save profile data (would normally save to state/storage)
    console.log('Profile data:', { name, selectedVoice, email });
    router.push('/onboarding/verify-email');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Profile</Text>
      
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Choose Your Voice</Text>
          <Text style={styles.sublabel}>Select the voice for your hypnosis sessions</Text>
          
          {VOICES.map((voice) => (
            <TouchableOpacity
              key={voice.id}
              style={[
                styles.voiceOption,
                selectedVoice === voice.id && styles.voiceOptionSelected
              ]}
              onPress={() => setSelectedVoice(voice.id)}
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
      </View>

      <TouchableOpacity 
        style={[styles.button, (!name.trim() || !selectedVoice || !email.trim() || !password.trim()) && styles.buttonDisabled]} 
        onPress={handleRegister}
        disabled={!name.trim() || !selectedVoice || !email.trim() || !password.trim()}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 30,
    color: '#333',
  },
  form: {
    flex: 1,
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
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

