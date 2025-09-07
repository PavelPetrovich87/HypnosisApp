import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function ReviewScreen() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mock session data
  const sessionData = {
    title: 'Deep Relaxation Session',
    duration: '15 min',
    goals: ['Reduce Stress', 'Better Sleep'],
    voice: 'Sarah - Calm & Soothing',
    background: 'Nature Sounds',
    ending: 'Gentle Wake',
    script: `Welcome to your personalized hypnosis session. Find a comfortable position and allow yourself to relax completely.

Take a deep breath in... and slowly let it out. Feel your body beginning to relax as you focus on the sound of my voice.

With each breath you take, you're becoming more and more relaxed. Your shoulders are dropping, your jaw is unclenching, and your entire body is settling into a state of deep peace.

Imagine yourself in a beautiful, serene place. Perhaps it's a peaceful garden, a quiet beach, or a cozy room filled with soft light. This is your safe space, where you can let go of all stress and tension.

As you continue to breathe deeply and naturally, you're becoming more aware of your inner strength and resilience. You have the power to overcome challenges and find peace within yourself.

[Content continues for full 15-minute session...]`,
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
      router.push('/success');
    }, 3000);
  };

  const handleEdit = () => {
    router.back();
  };

  if (isGenerating) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🧠✨</Text>
        <Text style={styles.loadingTitle}>Generating Your Session</Text>
        <Text style={styles.loadingSubtitle}>Creating personalized script and audio...</Text>
        
        <View style={styles.progressSteps}>
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <Text style={styles.progressText}>Analyzing goals</Text>
          </View>
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <Text style={styles.progressText}>Generating script</Text>
          </View>
          <View style={styles.progressStep}>
            <View style={styles.progressDot} />
            <Text style={styles.progressText}>Creating audio</Text>
          </View>
        </View>
        
        <Text style={styles.estimatedTime}>Estimated time: 2-3 minutes</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Review Session</Text>
        <Text style={styles.subtitle}>Preview your personalized session</Text>
      </View>

      <View style={styles.sessionInfo}>
        <Text style={styles.sessionTitle}>{sessionData.title}</Text>
        <Text style={styles.sessionDuration}>{sessionData.duration}</Text>
        
        <View style={styles.sessionDetails}>
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
        </View>
      </View>

      <View style={styles.scriptPreview}>
        <Text style={styles.scriptTitle}>Script Preview</Text>
        <View style={styles.scriptContainer}>
          <Text style={styles.scriptText} numberOfLines={10}>
            {sessionData.script}
          </Text>
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Read Full Script</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.quotaInfo}>
        <Text style={styles.quotaText}>💡 This will use 1 of your 3 remaining sessions</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>✏️ Edit Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
          <Text style={styles.generateButtonText}>🎵 Generate Audio</Text>
          <Text style={styles.generateButtonSubtext}>Create your hypnosis session</Text>
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loadingEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  progressSteps: {
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    marginRight: 12,
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
  },
  progressText: {
    fontSize: 16,
    color: '#333',
  },
  estimatedTime: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
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
  sessionInfo: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    marginBottom: 20,
  },
  sessionDetails: {},
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
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
  scriptPreview: {
    margin: 20,
    marginTop: 0,
  },
  scriptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  scriptContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  scriptText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  quotaInfo: {
    backgroundColor: '#fff3cd',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  quotaText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  actions: {
    padding: 20,
  },
  editButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  generateButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  bottomPadding: {
    height: 40,
  },
});

