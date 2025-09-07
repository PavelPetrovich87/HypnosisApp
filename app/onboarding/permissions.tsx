import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function PermissionsScreen() {
  const handleContinue = () => {
    router.push('/onboarding/profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>📱💾</Text>
        <Text style={styles.title}>Offline Downloads & Storage</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>📥 Offline Downloads</Text>
          <Text style={styles.description}>
            Download your hypnosis sessions for offline listening. Perfect for when you're traveling or have limited internet.
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>🔒 Data Usage & Privacy</Text>
          <Text style={styles.description}>
            • Sessions are stored securely on your device{'\n'}
            • No personal data is shared without consent{'\n'}
            • You control what gets downloaded{'\n'}
            • Delete sessions anytime to free up space
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>💡 Storage Tips</Text>
          <Text style={styles.description}>
            Each session is approximately 10-50MB. We recommend keeping 5-10 sessions downloaded for the best experience.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
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
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  infoSection: {
    marginBottom: 30,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
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

