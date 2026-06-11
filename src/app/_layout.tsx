import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { setupDatabase } from '@/database/setup';
import { SQLiteProvider } from 'expo-sqlite';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SQLiteProvider databaseName="recipebook.db" onInit={setupDatabase} useSuspense>
            <AnimatedSplashOverlay />
            <AppTabs />
        </SQLiteProvider>
    </ThemeProvider>
  );
}
