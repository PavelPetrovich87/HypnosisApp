import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

const DOWNLOADED_SESSIONS = [
  {
    id: '1',
    title: 'Deep Relaxation',
    duration: '15 min',
    fileSize: '12.3 MB',
    downloadedAt: 'Yesterday',
    lastPlayed: '2 hours ago',
  },
  {
    id: '3',
    title: 'Sleep Better',
    duration: '25 min',
    fileSize: '21.7 MB',
    downloadedAt: '1 week ago',
    lastPlayed: '3 days ago',
  },
];

export default function DownloadsScreen() {
  const [storageUsed] = useState(34.0); // MB
  const [storageLimit] = useState(500); // MB

  const handlePlaySession = (sessionId: string) => {
    router.push(`/playback?sessionId=${sessionId}&offline=true`);
  };

  const handleDeleteDownload = (sessionId: string, title: string) => {
    Alert.alert(
      'Remove Download',
      `Remove "${title}" from offline storage?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Removed', 'Session removed from offline storage.');
          }
        }
      ]
    );
  };

  const handleManageStorage = () => {
    Alert.alert(
      'Manage Storage',
      'Storage management options:\n\n• Auto-delete old downloads\n• Compress audio quality\n• Set download limits',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => console.log('Open storage settings') }
      ]
    );
  };

  const storagePercentage = (storageUsed / storageLimit) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>‹ Library</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Downloads</Text>
        <TouchableOpacity style={styles.manageButton} onPress={handleManageStorage}>
          <Text style={styles.manageButtonText}>Manage</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.storageInfo}>
        <Text style={styles.storageTitle}>Storage Usage</Text>
        
        <View style={styles.storageBar}>
          <View style={[styles.storageUsed, { width: `${storagePercentage}%` }]} />
        </View>
        
        <View style={styles.storageStats}>
          <Text style={styles.storageText}>{storageUsed} MB used</Text>
          <Text style={styles.storageText}>{storageLimit} MB total</Text>
        </View>
        
        <Text style={styles.storageSubtext}>
          {DOWNLOADED_SESSIONS.length} sessions available offline
        </Text>
      </View>

      <View style={styles.offlineFeatures}>
        <Text style={styles.featuresTitle}>Offline Benefits</Text>
        
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>Listen without internet connection</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Instant playback, no loading time</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔋</Text>
            <Text style={styles.featureText}>Saves battery and mobile data</Text>
          </View>
        </View>
      </View>

      <View style={styles.sessionsList}>
        <Text style={styles.sessionsTitle}>Downloaded Sessions</Text>
        
        {DOWNLOADED_SESSIONS.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📥</Text>
            <Text style={styles.emptyTitle}>No Downloads Yet</Text>
            <Text style={styles.emptySubtext}>
              Download sessions from your library to listen offline
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/(tabs)/library')}
            >
              <Text style={styles.browseButtonText}>Browse Library</Text>
            </TouchableOpacity>
          </View>
        ) : (
          DOWNLOADED_SESSIONS.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <TouchableOpacity 
                style={styles.sessionMain}
                onPress={() => handlePlaySession(session.id)}
              >
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionTitle}>{session.title}</Text>
                  <Text style={styles.sessionMeta}>
                    {session.duration} • {session.fileSize}
                  </Text>
                  <Text style={styles.sessionDownloadInfo}>
                    Downloaded {session.downloadedAt} • Played {session.lastPlayed}
                  </Text>
                </View>
                
                <View style={styles.sessionActions}>
                  <View style={styles.offlineBadge}>
                    <Text style={styles.offlineBadgeText}>📱</Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              <View style={styles.sessionControls}>
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => handlePlaySession(session.id)}
                >
                  <Text style={styles.playButtonText}>▶️ Play Offline</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteDownload(session.id, session.title)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>💡 Download Tips</Text>
        <Text style={styles.tipsText}>
          • Download sessions on Wi-Fi to save mobile data{'\n'}
          • Keep 3-5 sessions for the best experience{'\n'}
          • Downloaded sessions sync across your devices{'\n'}
          • Auto-delete feature keeps storage optimized
        </Text>
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
  backButton: {},
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  manageButton: {},
  manageButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  storageInfo: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  storageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  storageBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 10,
  },
  storageUsed: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  storageStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  storageText: {
    fontSize: 14,
    color: '#666',
  },
  storageSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  offlineFeatures: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featuresList: {},
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  sessionsList: {
    padding: 20,
  },
  sessionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  browseButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sessionMain: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 4,
  },
  sessionDownloadInfo: {
    fontSize: 12,
    color: '#999',
  },
  sessionActions: {},
  offlineBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offlineBadgeText: {
    fontSize: 12,
  },
  sessionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  playButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  playButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  tips: {
    backgroundColor: '#fff3cd',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40,
  },
});

