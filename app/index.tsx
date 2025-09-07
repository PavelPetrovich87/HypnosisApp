import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';

export default function IndexScreen() {
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated' | 'unverified'>('loading');

  useEffect(() => {
    // Simulate auth check - replace with actual auth logic
    setTimeout(() => {
      // For demo purposes, always show as unauthenticated
      setAuthStatus('unauthenticated');
    }, 1000);
  }, []);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.replace('/(tabs)');
    } else if (authStatus === 'unverified') {
      router.replace('/onboarding/verify-email');
    } else if (authStatus === 'unauthenticated') {
      router.replace('/onboarding/welcome');
    }
  }, [authStatus]);

  if (authStatus === 'loading') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🧠 HypnosisApp</Text>
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 HypnosisApp</Text>
      <Text style={styles.subtitle}>App Launch Screen</Text>
      
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>Debug Navigation:</Text>
        <Link href="/onboarding/welcome" asChild>
          <TouchableOpacity style={styles.debugButton}>
            <Text style={styles.debugButtonText}>Go to Onboarding</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(tabs)" asChild>
          <TouchableOpacity style={styles.debugButton}>
            <Text style={styles.debugButtonText}>Go to Main App</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  debugContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  debugButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  debugButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

