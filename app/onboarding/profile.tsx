import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
5 // CRM-35: Voice Preview Integration
import { VoicePreview } from '../../src/components/VoicePreview';
import { FeatureFlagUtils } from '../../src/services/featureFlags';
import { authViewModel } from '../../src/viewmodels/authViewModel';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    // Voice selection is optional if feature flag is disabled
    if (FeatureFlagUtils.isVoicePreviewEnabled() && !selectedVoice) {
      Alert.alert('Missing Information', 'Please select a voice for your sessions');
      return;
    }
    
    try {
      console.log('🚀 Profile: Starting registration with AuthViewModel');

      // Use AuthViewModel for registration - CRM-35
      await authViewModel.register({
        email: email.trim(),
        password: password.trim(),
        firstName: name.trim(),
        voicePreference: selectedVoice
      });

      console.log('✅ Profile: Registration successful');
      // Navigation will be handled by AuthViewModel based on verification status

    } catch (error: any) {
      console.error('❌ Profile: Registration failed:', error);
      Alert.alert(
        'Registration Error',
        error?.message || 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    }
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

        {/* CRM-35: Voice Preview Integration - conditionally show based on feature flag */}
        <VoicePreview
          selectedVoice={selectedVoice}
          onVoiceSelect={setSelectedVoice}
          onVoicePreview={(voiceId) => console.log('🎵 Voice preview:', voiceId)}
          showTitle={true}
        />
      </View>

      <TouchableOpacity 
        style={[
          styles.button,
          // Only require voice selection if feature flag is enabled
          (!name.trim() || !email.trim() || !password.trim() ||
            (FeatureFlagUtils.isVoicePreviewEnabled() && !selectedVoice)) && styles.buttonDisabled
        ]} 
        onPress={handleRegister}
        disabled={
          !name.trim() || !email.trim() || !password.trim() ||
          (FeatureFlagUtils.isVoicePreviewEnabled() && !selectedVoice)
        }
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

