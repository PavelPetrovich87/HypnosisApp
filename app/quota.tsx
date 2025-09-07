import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';

export default function QuotaScreen() {
  const quotaData = {
    remaining: 3,
    total: 10,
    resetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    isBeta: false,
    usageHistory: [
      { date: '2024-01-15', sessions: 2, title: 'Deep Relaxation, Sleep Better' },
      { date: '2024-01-14', sessions: 1, title: 'Confidence Boost' },
      { date: '2024-01-12', sessions: 3, title: 'Focus, Stress Relief, Motivation' },
      { date: '2024-01-10', sessions: 1, title: 'Better Sleep' },
    ]
  };

  const usedSessions = quotaData.total - quotaData.remaining;
  const usagePercentage = (usedSessions / quotaData.total) * 100;

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to Premium',
      'Get unlimited sessions, premium voices, and exclusive content.',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'View Plans', onPress: () => console.log('Open upgrade plans') }
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatHistoryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>‹ Profile</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Usage & Quota</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.quotaOverview}>
        <Text style={styles.quotaTitle}>Monthly Sessions</Text>
        
        <View style={styles.quotaCircle}>
          <Text style={styles.quotaNumber}>{quotaData.remaining}</Text>
          <Text style={styles.quotaLabel}>remaining</Text>
        </View>
        
        <View style={styles.quotaBar}>
          <View style={[styles.quotaUsed, { width: `${usagePercentage}%` }]} />
        </View>
        
        <View style={styles.quotaStats}>
          <Text style={styles.quotaText}>{usedSessions} of {quotaData.total} sessions used</Text>
          <Text style={styles.quotaReset}>Resets on {formatDate(quotaData.resetDate)}</Text>
        </View>

        {!quotaData.isBeta && (
          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeButtonText}>⭐ Upgrade to Unlimited</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.planInfo}>
        <Text style={styles.planTitle}>Current Plan</Text>
        
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>
              {quotaData.isBeta ? '🧪 Beta Tester' : '🆓 Free Plan'}
            </Text>
            <Text style={styles.planPrice}>
              {quotaData.isBeta ? 'Unlimited' : '$0/month'}
            </Text>
          </View>
          
          <View style={styles.planFeatures}>
            <View style={styles.planFeature}>
              <Text style={styles.planFeatureIcon}>
                {quotaData.isBeta ? '✅' : '📊'}
              </Text>
              <Text style={styles.planFeatureText}>
                {quotaData.isBeta ? 'Unlimited sessions' : `${quotaData.total} sessions per month`}
              </Text>
            </View>
            <View style={styles.planFeature}>
              <Text style={styles.planFeatureIcon}>🎵</Text>
              <Text style={styles.planFeatureText}>4 voice options</Text>
            </View>
            <View style={styles.planFeature}>
              <Text style={styles.planFeatureIcon}>📱</Text>
              <Text style={styles.planFeatureText}>Offline downloads</Text>
            </View>
            <View style={styles.planFeature}>
              <Text style={styles.planFeatureIcon}>
                {quotaData.isBeta ? '✅' : '❌'}
              </Text>
              <Text style={styles.planFeatureText}>Premium voices</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.usageHistory}>
        <Text style={styles.historyTitle}>Usage History</Text>
        
        {quotaData.usageHistory.map((entry, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={styles.historyDate}>
              <Text style={styles.historyDateText}>{formatHistoryDate(entry.date)}</Text>
            </View>
            <View style={styles.historyInfo}>
              <Text style={styles.historyCount}>
                {entry.sessions} session{entry.sessions > 1 ? 's' : ''}
              </Text>
              <Text style={styles.historyTitles}>{entry.title}</Text>
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View Full History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>💡 Usage Tips</Text>
        <Text style={styles.tipsText}>
          • Sessions reset monthly on the same date you signed up{'\n'}
          • Downloaded sessions don't count toward your quota{'\n'}
          • Beta testers get unlimited access during the beta period{'\n'}
          • Upgrade anytime for unlimited sessions and premium features
        </Text>
      </View>

      {!quotaData.isBeta && quotaData.remaining <= 1 && (
        <View style={styles.lowQuotaWarning}>
          <Text style={styles.warningTitle}>⚠️ Low Quota Warning</Text>
          <Text style={styles.warningText}>
            You're running low on sessions. Consider upgrading to premium for unlimited access.
          </Text>
          <TouchableOpacity style={styles.warningButton} onPress={handleUpgrade}>
            <Text style={styles.warningButtonText}>View Upgrade Options</Text>
          </TouchableOpacity>
        </View>
      )}

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
  placeholder: {
    width: 60,
  },
  quotaOverview: {
    backgroundColor: 'white',
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  quotaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  quotaCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f8ff',
    borderWidth: 8,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  quotaNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  quotaLabel: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  quotaBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 15,
  },
  quotaUsed: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  quotaStats: {
    alignItems: 'center',
    marginBottom: 20,
  },
  quotaText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 5,
  },
  quotaReset: {
    fontSize: 14,
    color: '#666',
  },
  upgradeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  planInfo: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  planCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  planFeatures: {},
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planFeatureIcon: {
    fontSize: 16,
    marginRight: 10,
    width: 20,
  },
  planFeatureText: {
    fontSize: 16,
    color: '#333',
  },
  usageHistory: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyDate: {
    width: 60,
    marginRight: 15,
  },
  historyDateText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  historyInfo: {
    flex: 1,
  },
  historyCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  historyTitles: {
    fontSize: 14,
    color: '#666',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  viewAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
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
  lowQuotaWarning: {
    backgroundColor: '#ffebee',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c62828',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#c62828',
    lineHeight: 20,
    marginBottom: 15,
  },
  warningButton: {
    backgroundColor: '#c62828',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  warningButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

