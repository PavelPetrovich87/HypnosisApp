import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Link, router } from 'expo-router';

export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => router.replace('/onboarding/welcome')
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✅ Verified</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4.2h</Text>
          <Text style={styles.statLabel}>Total Time</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>7</Text>
          <Text style={styles.statLabel}>Days Streak</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          <Link href="/edit-profile" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>✏️</Text>
              <Text style={styles.menuText}>Edit Profile</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/preferences" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={styles.menuText}>Preferences</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]}>
            <Link href="/quota" asChild>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuIcon}>📊</Text>
                <Text style={styles.menuText}>Usage & Quota</Text>
                <View style={styles.quotaBadge}>
                  <Text style={styles.quotaBadgeText}>3 left</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </View>
            </Link>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goals</Text>
        <View style={styles.goalsCard}>
          <View style={styles.goalsContainer}>
            <View style={styles.goalChip}>
              <Text style={styles.goalText}>😌 Reduce Stress</Text>
            </View>
            <View style={styles.goalChip}>
              <Text style={styles.goalText}>😴 Better Sleep</Text>
            </View>
            <View style={styles.goalChip}>
              <Text style={styles.goalText}>💪 Build Confidence</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editGoalsButton}>
            <Text style={styles.editGoalsText}>Edit Goals</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>❓</Text>
            <Text style={styles.menuText}>Help & FAQ</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>💬</Text>
            <Text style={styles.menuText}>Contact Support</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]}>
            <Text style={styles.menuIcon}>⭐</Text>
            <Text style={styles.menuText}>Rate App</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📄</Text>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]}>
            <Text style={styles.menuIcon}>📋</Text>
            <Text style={styles.menuText}>Terms of Service</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Figma-aligned white background
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DEE1E6', // Figma-aligned light gray
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
  },
  name: {
    fontSize: 20, // Archivo font specifications
    fontWeight: '600', // Figma weight 600
    color: '#171A1F', // Figma primary text color
    marginBottom: 5,
  },
  email: {
    fontSize: 14, // Inter font specifications
    color: '#565D6D', // Figma secondary text color
    marginBottom: 10,
  },
  verifiedBadge: {
    backgroundColor: '#67AAF9', // Figma blue accent
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6, // Figma border radius system
  },
  verifiedText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24, // Figma screen padding
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    borderRadius: 10, // Figma card border radius
    // Figma shadow specifications
    shadowColor: 'rgba(23, 26, 31, 0.07)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18, // Figma large text specifications
    fontWeight: '500',
    color: '#67AAF9', // Figma blue accent for numbers
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14, // Inter body text
    color: '#565D6D', // Figma secondary text
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 24, // Figma screen padding
  },
  sectionTitle: {
    fontSize: 20, // Archivo section header
    fontWeight: '600',
    color: '#171A1F', // Figma primary text
    marginBottom: 8,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10, // Figma card border radius
    // Figma shadow specifications
    shadowColor: 'rgba(23, 26, 31, 0.07)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16, // 48px minimum touch target
    borderBottomWidth: 1,
    borderBottomColor: '#DEE1E6', // Figma border color
  },
  lastMenuItem: {
    borderBottomWidth: 0, // Remove border for last item
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12, // Figma spacing
    width: 25,
  },
  menuText: {
    flex: 1,
    fontSize: 16, // Inter form label size
    fontWeight: '500',
    color: '#171A1F', // Figma primary text
  },
  menuArrow: {
    fontSize: 20,
    color: '#565D6D', // Figma secondary color for arrows
  },
  quotaBadge: {
    backgroundColor: '#67AAF9', // Figma blue accent
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6, // Figma border radius
    marginRight: 10,
  },
  quotaBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  goalsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10, // Figma card border radius
    padding: 16,
    // Figma shadow specifications
    shadowColor: 'rgba(23, 26, 31, 0.07)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  goalChip: {
    backgroundColor: '#FAFAFB', // Figma secondary background
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6, // Figma border radius system
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DEE1E6', // Figma border color
  },
  goalText: {
    fontSize: 14, // Inter body text
    color: '#171A1F', // Figma primary text
    fontWeight: '400',
  },
  editGoalsButton: {},
  editGoalsText: {
    fontSize: 16,
    color: '#67AAF9', // Figma blue accent
    fontWeight: '500', // Inter weight
  },
  logoutButton: {
    backgroundColor: '#ff3b30', // Keep existing red for destructive action
    marginHorizontal: 24, // Figma screen padding
    marginTop: 30,
    paddingVertical: 13, // Figma button padding
    paddingHorizontal: 24,
    borderRadius: 6, // Figma button border radius
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 14, // Inter button text
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
});

