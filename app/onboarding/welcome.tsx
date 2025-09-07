import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    router.push('/onboarding/goals');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🧠✨</Text>
        <Text style={styles.title}>Welcome to HypnosisApp</Text>
        <Text style={styles.subtitle}>
          Transform your mind with personalized hypnosis sessions
        </Text>
        
        <View style={styles.features}>
          <Text style={styles.feature}>🎯 Personalized goals</Text>
          <Text style={styles.feature}>🎵 Custom voice selection</Text>
          <Text style={styles.feature}>📱 Offline downloads</Text>
          <Text style={styles.feature}>🔒 Privacy focused</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
    lineHeight: 24,
  },
  features: {
    alignItems: 'flex-start',
  },
  feature: {
    fontSize: 16,
    marginVertical: 8,
    color: '#555',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

