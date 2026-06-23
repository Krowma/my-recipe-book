import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The main screen of the profile tab */}
      <Stack.Screen 
        name="view-recipe-book" 
        options={{ title: 'Recipes' }} 
      />
      {/* A deeper screen inside the profile tab */}
      <Stack.Screen 
        name="view-recipe" 
        options={{ title: 'Recipe' }} 
      />
      <Stack.Screen 
        name="view-recipe-form" 
        options={{ title: 'Recipe Form' }} 
      />
    </Stack>
  );
}