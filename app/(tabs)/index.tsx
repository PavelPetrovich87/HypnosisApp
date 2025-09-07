import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning! 🌅</Text>
        <Text style={styles.name}>Welcome back</Text>
        
        <View style={styles.quotaBadge}>
          <Text style={styles.quotaText}>🎯 3 sessions remaining</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <Link href="/generate" asChild>
          <TouchableOpacity style={styles.primaryAction}>
            <Text style={styles.primaryActionIcon}>⚡</Text>
            <Text style={styles.primaryActionText}>Generate New Session</Text>
            <Text style={styles.primaryActionSubtext}>Create a personalized hypnosis session</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.secondaryActions}>
          <Link href="/playback?sessionId=recent" asChild>
            <TouchableOpacity style={styles.secondaryAction}>
              <Text style={styles.secondaryActionIcon}>▶️</Text>
              <Text style={styles.secondaryActionText}>Continue Last Session</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/library" asChild>
            <TouchableOpacity style={styles.secondaryAction}>
              <Text style={styles.secondaryActionIcon}>📚</Text>
              <Text style={styles.secondaryActionText}>Browse Library</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View style={styles.recentSessions}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        
        <Link href="/playback?sessionId=1" asChild>
          <TouchableOpacity style={styles.sessionCard}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>Deep Relaxation</Text>
              <Text style={styles.sessionMeta}>15 min • Yesterday</Text>
            </View>
            <Text style={styles.sessionIcon}>▶️</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/playback?sessionId=2" asChild>
          <TouchableOpacity style={styles.sessionCard}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>Confidence Boost</Text>
              <Text style={styles.sessionMeta}>20 min • 2 days ago</Text>
            </View>
            <Text style={styles.sessionIcon}>▶️</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.suggestions}>
        <Text style={styles.sectionTitle}>Suggested for You</Text>
        
        <TouchableOpacity style={styles.suggestionCard}>
          <Text style={styles.suggestionIcon}>😴</Text>
          <View style={styles.suggestionInfo}>
            <Text style={styles.suggestionTitle}>Better Sleep</Text>
            <Text style={styles.suggestionDescription}>Based on your goals</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.suggestionCard}>
          <Text style={styles.suggestionIcon}>🎯</Text>
          <View style={styles.suggestionInfo}>
            <Text style={styles.suggestionTitle}>Focus Enhancement</Text>
            <Text style={styles.suggestionDescription}>Popular this week</Text>
          </View>
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
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  quotaBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  quotaText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '600',
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
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
    flex: 0.48,
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
    textAlign: 'center',
  },
  recentSessions: {
    padding: 20,
  },
  sessionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sessionMeta: {
    fontSize: 14,
    color: '#666',
  },
  sessionIcon: {
    fontSize: 20,
  },
  suggestions: {
    padding: 20,
    paddingBottom: 40,
  },
  suggestionCard: {
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
    fontSize: 24,
    marginRight: 12,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  suggestionDescription: {
    fontSize: 14,
    color: '#666',
  },
});

