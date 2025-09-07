import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function ErrorModal() {
  const { message, type, canRetry } = useLocalSearchParams();
  
  const errorData = {
    message: message as string || 'An unexpected error occurred',
    type: type as string || 'general',
    canRetry: canRetry === 'true',
  };

  const getErrorInfo = () => {
    switch (errorData.type) {
      case 'network':
        return {
          icon: '📡',
          title: 'Connection Error',
          description: 'Please check your internet connection and try again.',
        };
      case 'quota':
        return {
          icon: '🚫',
          title: 'Quota Exhausted',
          description: 'You\'ve reached your monthly session limit. Upgrade for unlimited access.',
        };
      case 'generation':
        return {
          icon: '⚠️',
          title: 'Generation Failed',
          description: 'Unable to generate your session. This might be a temporary issue.',
        };
      case 'audio':
        return {
          icon: '🔊',
          title: 'Audio Error',
          description: 'There was a problem with audio playback.',
        };
      default:
        return {
          icon: '❌',
          title: 'Error',
          description: 'Something went wrong. Please try again.',
        };
    }
  };

  const errorInfo = getErrorInfo();

  const handleRetry = () => {
    router.back();
    // In a real app, this would trigger the retry action
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const handleUpgrade = () => {
    router.replace('/quota');
  };

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.icon}>{errorInfo.icon}</Text>
        <Text style={styles.title}>{errorInfo.title}</Text>
        <Text style={styles.description}>{errorInfo.description}</Text>
        
        {errorData.message && errorData.message !== errorInfo.description && (
          <Text style={styles.technicalMessage}>{errorData.message}</Text>
        )}

        <View style={styles.actions}>
          {errorData.canRetry && (
            <TouchableOpacity style={styles.primaryButton} onPress={handleRetry}>
              <Text style={styles.primaryButtonText}>🔄 Try Again</Text>
            </TouchableOpacity>
          )}

          {errorData.type === 'quota' && (
            <TouchableOpacity style={styles.primaryButton} onPress={handleUpgrade}>
              <Text style={styles.primaryButtonText}>⭐ Upgrade Now</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
            <Text style={styles.secondaryButtonText}>🏠 Go to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dismissButton} onPress={() => router.back()}>
            <Text style={styles.dismissButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  technicalMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  actions: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  dismissButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

