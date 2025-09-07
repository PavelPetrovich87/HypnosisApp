import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';

const SESSIONS = [
  {
    id: '1',
    title: 'Deep Relaxation',
    duration: '15 min',
    date: 'Yesterday',
    status: 'completed',
    isDownloaded: true,
  },
  {
    id: '2',
    title: 'Confidence Boost',
    duration: '20 min',
    date: '2 days ago',
    status: 'completed',
    isDownloaded: false,
  },
  {
    id: '3',
    title: 'Sleep Better',
    duration: '25 min',
    date: '1 week ago',
    status: 'completed',
    isDownloaded: true,
  },
  {
    id: '4',
    title: 'Focus Enhancement',
    duration: '18 min',
    date: '2 weeks ago',
    status: 'draft',
    isDownloaded: false,
  },
];

export default function LibraryScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <Text style={styles.subtitle}>All your hypnosis sessions</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Total Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Downloaded</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.2h</Text>
          <Text style={styles.statLabel}>Total Time</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Link href="/downloads" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>⬇️</Text>
            <Text style={styles.actionText}>Downloads</Text>
          </TouchableOpacity>
        </Link>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🔍</Text>
          <Text style={styles.actionText}>Search</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionText}>Stats</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sessionsList}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        
        {SESSIONS.map((session) => (
          <Link key={session.id} href={`/session/${session.id}`} asChild>
            <TouchableOpacity style={styles.sessionCard}>
              <View style={styles.sessionMain}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionTitle}>{session.title}</Text>
                  <View style={styles.sessionMeta}>
                    <Text style={styles.sessionDuration}>{session.duration}</Text>
                    <Text style={styles.sessionDate}> • {session.date}</Text>
                  </View>
                </View>
                
                <View style={styles.sessionActions}>
                  {session.isDownloaded && (
                    <View style={styles.downloadBadge}>
                      <Text style={styles.downloadBadgeText}>⬇️</Text>
                    </View>
                  )}
                  
                  <View style={[
                    styles.statusBadge,
                    session.status === 'completed' ? styles.statusCompleted : styles.statusDraft
                  ]}>
                    <Text style={[
                      styles.statusText,
                      session.status === 'completed' ? styles.statusTextCompleted : styles.statusTextDraft
                    ]}>
                      {session.status === 'completed' ? '✅' : '📝'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playButtonText}>
                  {session.status === 'completed' ? '▶️ Play' : '👁️ View'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Link>
        ))}
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
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
  stats: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 0.3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 0.3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sessionsList: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sessionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sessionMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionDuration: {
    fontSize: 14,
    color: '#666',
  },
  sessionDate: {
    fontSize: 14,
    color: '#666',
  },
  sessionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  downloadBadgeText: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#e8f5e8',
  },
  statusDraft: {
    backgroundColor: '#fff3cd',
  },
  statusText: {
    fontSize: 12,
  },
  statusTextCompleted: {
    color: '#2e7d32',
  },
  statusTextDraft: {
    color: '#f57c00',
  },
  playButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

