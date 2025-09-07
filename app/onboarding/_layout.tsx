import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Prevent swipe back during onboarding
      }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="verify-email" />
    </Stack>
  );
}

