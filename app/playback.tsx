import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';

export default function PlaybackScreen() {
  const { sessionId } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(900); // 15 minutes in seconds
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Mock session data
  const sessionData = {
    id: sessionId,
    title: 'Deep Relaxation Session',
    duration: '15 min',
    voice: 'Sarah - Calm & Soothing',
    background: 'Nature Sounds',
    createdAt: 'Today',
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          setProgress(newTime / duration);
          if (newTime >= duration) {
            setIsPlaying(false);
            handleSessionComplete();
            return duration;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newProgress: number) => {
    const newTime = newProgress * duration;
    setCurrentTime(newTime);
    setProgress(newProgress);
  };

  const handleDownload = () => {
    Alert.alert(
      'Download Session',
      'Download this session for offline listening?',
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

  const handleSessionComplete = () => {
    router.push('/success');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <Text style={styles.downloadButtonText}>
            {isDownloaded ? '✅ Downloaded' : '⬇️ Download'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>{sessionData.title}</Text>
          <Text style={styles.sessionMeta}>
            {sessionData.voice} • {sessionData.background}
          </Text>
          <Text style={styles.sessionDate}>{sessionData.createdAt}</Text>
        </View>

        <View style={styles.artwork}>
          <View style={styles.artworkContainer}>
            <Text style={styles.artworkEmoji}>🧠✨</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            <TouchableOpacity
              style={[styles.progressThumb, { left: `${progress * 100}%` }]}
              onPressIn={() => {
                // Handle drag start
              }}
            />
          </View>
          
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => handleSeek(Math.max(0, (currentTime - 30) / duration))}
          >
            <Text style={styles.controlButtonText}>⏪</Text>
            <Text style={styles.controlButtonLabel}>-30s</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
            <Text style={styles.playButtonText}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => handleSeek(Math.min(1, (currentTime + 30) / duration))}
          >
            <Text style={styles.controlButtonText}>⏩</Text>
            <Text style={styles.controlButtonLabel}>+30s</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.additionalControls}>
          <TouchableOpacity style={styles.additionalButton}>
            <Text style={styles.additionalButtonText}>🔄 Repeat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.additionalButton}>
            <Text style={styles.additionalButtonText}>⏰ Sleep Timer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.additionalButton}>
            <Text style={styles.additionalButtonText}>📤 Share</Text>
          </TouchableOpacity>
        </View>

        {isDownloaded && (
          <View style={styles.offlineIndicator}>
            <Text style={styles.offlineText}>📱 Available Offline</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {},
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
  },
  downloadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sessionInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sessionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  sessionMeta: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  artwork: {
    alignItems: 'center',
    marginBottom: 40,
  },
  artworkContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkEmoji: {
    fontSize: 64,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 10,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    marginLeft: -8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 14,
    color: '#ccc',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  controlButton: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  controlButtonText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 4,
  },
  controlButtonLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  playButtonText: {
    fontSize: 32,
    color: 'white',
  },
  additionalControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  additionalButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  additionalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  offlineIndicator: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  offlineText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
});

