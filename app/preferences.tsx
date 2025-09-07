import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function PreferencesScreen() {
  const [notifications, setNotifications] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [backgroundPlay, setBackgroundPlay] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>‹ Profile</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Preferences</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceLabel}>Push Notifications</Text>
            <Text style={styles.preferenceDescription}>
              Session reminders and app updates
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Downloads & Storage</Text>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceLabel}>Auto-Download Sessions</Text>
            <Text style={styles.preferenceDescription}>
              Automatically download new sessions
            </Text>
          </View>
          <Switch
            value={autoDownload}
            onValueChange={setAutoDownload}
            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceLabel}>Wi-Fi Only Downloads</Text>
            <Text style={styles.preferenceDescription}>
              Only download on Wi-Fi to save mobile data
            </Text>
          </View>
          <Switch
            value={wifiOnly}
            onValueChange={setWifiOnly}
            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
          />
        </View>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>🗂️</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionLabel}>Manage Storage</Text>
            <Text style={styles.actionDescription}>34 MB used • Clear cache</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Playback</Text>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceLabel}>Background Playback</Text>
            <Text style={styles.preferenceDescription}>
              Continue playing when app is minimized
            </Text>
          </View>
          <Switch
            value={backgroundPlay}
            onValueChange={setBackgroundPlay}
            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
          />
        </View>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>🔊</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionLabel}>Audio Quality</Text>
            <Text style={styles.actionDescription}>High Quality (320kbps)</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>⏰</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionLabel}>Sleep Timer</Text>
            <Text style={styles.actionDescription}>Default: 30 minutes</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceLabel}>Dark Mode</Text>
            <Text style={styles.preferenceDescription}>
              Use dark theme for better night viewing
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
          />
        </View>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>🎨</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionLabel}>Theme</Text>
            <Text style={styles.actionDescription}>System Default</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Data</Text>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceLabel}>Usage Analytics</Text>
            <Text style={styles.preferenceDescription}>
              Help improve the app with anonymous usage data
            </Text>
          </View>
          <Switch
            value={analytics}
            onValueChange={setAnalytics}
            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
          />
        </View>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>🔒</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionLabel}>Privacy Settings</Text>
            <Text style={styles.actionDescription}>Data collection and sharing</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>📊</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionLabel}>Data Export</Text>
            <Text style={styles.actionDescription}>Download your data</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced</Text>
        
        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>🔄</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionLabel}>Sync Settings</Text>
            <Text style={styles.actionDescription}>Cloud sync and backup</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>🐛</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionLabel}>Debug Mode</Text>
            <Text style={styles.actionDescription}>Developer options</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>🔄</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionLabel}>Reset Settings</Text>
            <Text style={styles.actionDescription}>Restore default preferences</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
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
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 15,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
  },
  actionArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  bottomPadding: {
    height: 40,
  },
});

