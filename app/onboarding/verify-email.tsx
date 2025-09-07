import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';

export default function VerifyEmailScreen() {
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [email] = useState('j***@g***.com'); // Masked email

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = () => {
    if (canResend) {
      setCountdown(45);
      setCanResend(false);
      // Simulate resend verification email
      console.log('Resending verification email...');
    }
  };

  const handleVerificationComplete = () => {
    // Simulate email verification
    router.replace('/(tabs)');
  };

  const handleChangeEmail = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>📧</Text>
        <Text style={styles.title}>Verify Your Email</Text>
        
        <Text style={styles.description}>
          We've sent a verification link to:
        </Text>
        <Text style={styles.email}>{email}</Text>
        
        <Text style={styles.instruction}>
          Click the link in your email to verify your account and start using HypnosisApp.
        </Text>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.resendButton, !canResend && styles.resendButtonDisabled]}
            onPress={handleResend}
            disabled={!canResend}
          >
            <Text style={[styles.resendButtonText, !canResend && styles.resendButtonTextDisabled]}>
              {canResend ? 'Resend Email' : `Resend in ${countdown}s`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.changeEmailButton} onPress={handleChangeEmail}>
            <Text style={styles.changeEmailButtonText}>Change Email Address</Text>
          </TouchableOpacity>
        </View>

        {/* Debug button for demo purposes */}
        <View style={styles.debugSection}>
          <Text style={styles.debugText}>Demo: Simulate email verification</Text>
          <TouchableOpacity style={styles.debugButton} onPress={handleVerificationComplete}>
            <Text style={styles.debugButtonText}>✅ Mark as Verified</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 40,
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
  },
  resendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  resendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  resendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButtonTextDisabled: {
    color: '#999',
  },
  changeEmailButton: {
    paddingVertical: 12,
  },
  changeEmailButtonText: {
    color: '#007AFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  debugSection: {
    marginTop: 60,
    padding: 20,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    alignItems: 'center',
  },
  debugText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 10,
    textAlign: 'center',
  },
  debugButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  debugButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

