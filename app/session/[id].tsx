import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Mock session data based on ID
  const getSessionData = (sessionId: string | string[]) => {
    const sessions = {
      '1': {
        title: 'Deep Relaxation',
        duration: '15 min',
        status: 'completed',
        createdAt: 'Yesterday',
        goals: ['Reduce Stress', 'Better Sleep'],
        voice: 'Sarah - Calm & Soothing',
        background: 'Nature Sounds',
        ending: 'Gentle Wake',
        playCount: 3,
        lastPlayed: 'Yesterday at 9:30 PM',
        isDownloaded: true,
        fileSize: '12.3 MB',
        script: 'Welcome to your personalized deep relaxation session...',
      },
      '2': {
        title: 'Confidence Boost',
        duration: '20 min',
        status: 'completed',
        createdAt: '2 days ago',
        goals: ['Build Confidence', 'Motivation'],
        voice: 'David - Deep & Relaxing',
        background: 'Ocean Waves',
        ending: 'Energized Wake',
        playCount: 1,
        lastPlayed: '2 days ago',
        isDownloaded: false,
        fileSize: '16.8 MB',
        script: 'You are confident, capable, and ready to take on any challenge...',
      },
    };
    
    return sessions[sessionId as keyof typeof sessions] || sessions['1'];
  };

  const sessionData = getSessionData(id);

  const handlePlay = () => {
    router.push(`/playback?sessionId=${id}`);
  };

  const handleDownload = () => {
    Alert.alert(
      'Download Session',
      `Download "${sessionData.title}" for offline listening?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Download', 
          onPress: () => {
            setIsDownloaded(true);
            Alert.alert('Success', 'Session downloaded successfully!');
          }
        }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Session',
      `Are you sure you want to delete "${sessionData.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            router.back();
            Alert.alert('Deleted', 'Session has been deleted.');
          }
        }
      ]
    );
  };

  const handleShare = () => {
    Alert.alert('Share', 'Sharing functionality would be implemented here.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>‹ Library</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreButtonText}>⋯</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sessionHeader}>
        <View style={styles.artwork}>
          <Text style={styles.artworkEmoji}>🧠</Text>
        </View>
        
        <Text style={styles.sessionTitle}>{sessionData.title}</Text>
        <Text style={styles.sessionDuration}>{sessionData.duration}</Text>
        <Text style={styles.sessionDate}>Created {sessionData.createdAt}</Text>
        
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {sessionData.status === 'completed' ? '✅ Complete' : '📝 Draft'}
          </Text>
        </View>
      </View>

      <View style={styles.playSection}>
        <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
          <Text style={styles.playButtonIcon}>▶️</Text>
          <Text style={styles.playButtonText}>Play Session</Text>
        </TouchableOpacity>
        
        <View style={styles.playStats}>
          <Text style={styles.playStatsText}>
            Played {sessionData.playCount} times • Last: {sessionData.lastPlayed}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailsTitle}>Session Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Goals:</Text>
          <Text style={styles.detailValue}>{sessionData.goals.join(', ')}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Voice:</Text>
          <Text style={styles.detailValue}>{sessionData.voice}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Background:</Text>
          <Text style={styles.detailValue}>{sessionData.background}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ending:</Text>
          <Text style={styles.detailValue}>{sessionData.ending}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>File Size:</Text>
          <Text style={styles.detailValue}>{sessionData.fileSize}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.downloadButton]} 
          onPress={handleDownload}
        >
          <Text style={styles.actionButtonIcon}>
            {sessionData.isDownloaded || isDownloaded ? '✅' : '⬇️'}
          </Text>
          <Text style={styles.actionButtonText}>
            {sessionData.isDownloaded || isDownloaded ? 'Downloaded' : 'Download'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.shareButton]} onPress={handleShare}>
          <Text style={styles.actionButtonIcon}>📤</Text>
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.actionButtonIcon}>🗑️</Text>
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scriptPreview}>
        <Text style={styles.scriptTitle}>Script Preview</Text>
        <View style={styles.scriptContainer}>
          <Text style={styles.scriptText} numberOfLines={5}>
            {sessionData.script}
          </Text>
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Read Full Script</Text>
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
  backButton: {},
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
  },
  moreButton: {},
  moreButtonText: {
    fontSize: 24,
    color: '#666',
  },
  sessionHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingBottom: 30,
  },
  artwork: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  artworkEmoji: {
    fontSize: 48,
  },
  sessionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  sessionDuration: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  sessionDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  statusBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
  },
  playSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  playButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  playButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  playStats: {},
  playStatsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  details: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 100,
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.3,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  downloadButton: {
    backgroundColor: '#e8f5e8',
  },
  shareButton: {
    backgroundColor: '#e3f2fd',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  actionButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  scriptPreview: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  scriptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  scriptContainer: {},
  scriptText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 15,
  },
  readMoreButton: {},
  readMoreText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

