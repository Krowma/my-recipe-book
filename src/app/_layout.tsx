import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { setupDatabase } from '@/database/setup';
import * as Notifications from 'expo-notifications';
import { AndroidNotificationPriority } from 'expo-notifications';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { Platform, StatusBar, useColorScheme } from 'react-native';
import FlashMessage from 'react-native-flash-message';

const SAFE_AREA_OFFSET = Platform.OS === 'ios' ? 45 : (StatusBar.currentHeight || 40);

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
        priority: AndroidNotificationPriority.HIGH,
    }),
});

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
