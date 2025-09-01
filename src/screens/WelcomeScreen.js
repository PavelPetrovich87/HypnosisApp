import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const handleContinue = () => {
    // TODO: Navigate to goals screen when navigation is implemented
    console.log('Continue pressed');
  };

  const handlePrivacyTerms = () => {
    // TODO: Navigate to privacy & terms screen when navigation is implemented
    console.log('Privacy & Terms pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>✨</Text>
            </View>
            <Text style={styles.appName}>ZenithMind</Text>
          </View>
          
          <Text style={styles.mainTitle}>Your Path to Inner Calm</Text>
          <Text style={styles.subtitle}>
            Personalized sessions for relaxation, sleep, anxiety relief, and focus.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>🌙</Text>
            </View>
            <Text style={styles.featureTitle}>Achieve restful sleep</Text>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>🛡️</Text>
            </View>
            <Text style={styles.featureTitle}>Relieve daily stress & anxiety</Text>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>🎯</Text>
            </View>
            <Text style={styles.featureTitle}>Enhance focus and productivity</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleContinue}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={handlePrivacyTerms}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Privacy & Terms</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F7FE',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#F1F7FE',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#67AAF9',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontSize: 24,
  },
  appName: {
    fontSize: 38,
    fontWeight: '700',
    color: '#19191F',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#19191F',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#19191F',
    textAlign: 'center',
    lineHeight: 29,
    paddingHorizontal: 30,
    fontWeight: '400',
  },
  featuresSection: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: '#FAFAFB',
    marginTop: 20,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(103, 170, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#171A1F',
    lineHeight: 26,
    flex: 1,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  primaryButton: {
    backgroundColor: '#67AAF9',
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#67AAF9',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 28,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  secondaryButtonText: {
    color: '#565D6D',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
  },
});
