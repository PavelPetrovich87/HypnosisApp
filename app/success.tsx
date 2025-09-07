import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function SuccessScreen() {
  const sessionData = {
    title: 'Deep Relaxation Session',
    duration: '15 min',
    completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const handlePlayNow = () => {
    router.push('/playback?sessionId=new');
  };

  const handleSaveForLater = () => {
    router.push('/(tabs)');
  };

  const handleShare = () => {
    // Implement sharing functionality
    console.log('Sharing session...');
  };

  const handleDownload = () => {
    router.push('/playback?sessionId=new&download=true');
  };

  const handleCreateAnother = () => {
    router.push('/generate');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.successEmoji}>✨🧠✨</Text>
        </View>

        <Text style={styles.title}>Session Ready!</Text>
        <Text style={styles.subtitle}>
          Your personalized hypnosis session has been created successfully
        </Text>

        <View style={styles.sessionCard}>
          <Text style={styles.sessionTitle}>{sessionData.title}</Text>
          <Text style={styles.sessionDuration}>{sessionData.duration}</Text>
          <Text style={styles.sessionTime}>Created at {sessionData.completedAt}</Text>
          
          <View style={styles.sessionFeatures}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🎵</Text>
              <Text style={styles.featureText}>High-quality audio</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureText}>Personalized content</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureText}>Ready for offline use</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryAction} onPress={handlePlayNow}>
            <Text style={styles.primaryActionIcon}>▶️</Text>
            <Text style={styles.primaryActionText}>Play Now</Text>
            <Text style={styles.primaryActionSubtext}>Start your session immediately</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryAction} onPress={handleDownload}>
              <Text style={styles.secondaryActionIcon}>⬇️</Text>
              <Text style={styles.secondaryActionText}>Download</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryAction} onPress={handleShare}>
              <Text style={styles.secondaryActionIcon}>📤</Text>
              <Text style={styles.secondaryActionText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryAction} onPress={handleSaveForLater}>
              <Text style={styles.secondaryActionIcon}>💾</Text>
              <Text style={styles.secondaryActionText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quotaUpdate}>
          <Text style={styles.quotaText}>
            💡 You have 2 sessions remaining this month
          </Text>
        </View>

        <View style={styles.suggestions}>
          <Text style={styles.suggestionsTitle}>What's Next?</Text>
          
          <TouchableOpacity style={styles.suggestionItem} onPress={handleCreateAnother}>
            <Text style={styles.suggestionIcon}>⚡</Text>
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionText}>Create Another Session</Text>
              <Text style={styles.suggestionSubtext}>Try a different goal or duration</Text>
            </View>
            <Text style={styles.suggestionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.suggestionItem} onPress={() => router.push('/(tabs)/library')}>
            <Text style={styles.suggestionIcon}>📚</Text>
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionText}>Browse Your Library</Text>
              <Text style={styles.suggestionSubtext}>View all your sessions</Text>
            </View>
            <Text style={styles.suggestionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.suggestionItem} onPress={() => router.push('/(tabs)/profile')}>
            <Text style={styles.suggestionIcon}>🎯</Text>
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionText}>Update Your Goals</Text>
              <Text style={styles.suggestionSubtext}>Refine your preferences</Text>
            </View>
            <Text style={styles.suggestionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.homeButtonText}>🏠 Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    paddingTop: 80,
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successEmoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  sessionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sessionDuration: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  sessionTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  sessionFeatures: {
    width: '100%',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 10,
    width: 20,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
  },
  actions: {
    marginBottom: 30,
  },
  primaryAction: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  primaryActionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  primaryActionSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryAction: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 0.3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  secondaryActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  quotaUpdate: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  quotaText: {
    fontSize: 14,
    color: '#1976d2',
    textAlign: 'center',
    fontWeight: '500',
  },
  suggestions: {
    marginBottom: 30,
  },
  suggestionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  suggestionItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  suggestionIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  suggestionSubtext: {
    fontSize: 14,
    color: '#666',
  },
  suggestionArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  homeButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  homeButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

