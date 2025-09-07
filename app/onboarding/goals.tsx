import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

const GOALS = [
  { id: 'stress', name: 'Reduce Stress', icon: '😌' },
  { id: 'sleep', name: 'Better Sleep', icon: '😴' },
  { id: 'confidence', name: 'Build Confidence', icon: '💪' },
  { id: 'focus', name: 'Improve Focus', icon: '🎯' },
  { id: 'anxiety', name: 'Manage Anxiety', icon: '🧘' },
  { id: 'habits', name: 'Break Bad Habits', icon: '🚫' },
  { id: 'motivation', name: 'Increase Motivation', icon: '🚀' },
  { id: 'healing', name: 'Emotional Healing', icon: '💚' },
];

export default function GoalsScreen() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = () => {
    // Save selected goals (would normally save to state/storage)
    console.log('Selected goals:', selectedGoals);
    router.push('/onboarding/permissions');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What are your goals?</Text>
        <Text style={styles.subtitle}>Select all that apply (you can change these later)</Text>
      </View>

      <ScrollView style={styles.goalsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.goalsGrid}>
          {GOALS.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalChip,
                selectedGoals.includes(goal.id) && styles.goalChipSelected
              ]}
              onPress={() => toggleGoal(goal.id)}
            >
              <Text style={styles.goalIcon}>{goal.icon}</Text>
              <Text style={[
                styles.goalText,
                selectedGoals.includes(goal.id) && styles.goalTextSelected
              ]}>
                {goal.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.button, selectedGoals.length === 0 && styles.buttonDisabled]} 
        onPress={handleContinue}
        disabled={selectedGoals.length === 0}
      >
        <Text style={styles.buttonText}>
          Continue ({selectedGoals.length} selected)
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  goalsContainer: {
    flex: 1,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalChip: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  goalChipSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  goalIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  goalText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  goalTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

