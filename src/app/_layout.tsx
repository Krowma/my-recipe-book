import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Platform, StatusBar, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { setupDatabase } from '@/database/setup';
import { SQLiteProvider } from 'expo-sqlite';
import FlashMessage from 'react-native-flash-message';

const SAFE_AREA_OFFSET = Platform.OS === 'ios' ? 45 : (StatusBar.currentHeight || 40);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SQLiteProvider databaseName="recipebook.db" onInit={setupDatabase} useSuspense>
            <AnimatedSplashOverlay />
            <AppTabs />
            <FlashMessage 
                position={{ top: SAFE_AREA_OFFSET }} 
                statusBarHeight={Platform.OS === 'android' ? StatusBar.currentHeight : undefined} />
        </SQLiteProvider>
    </ThemeProvider>
  );
}
