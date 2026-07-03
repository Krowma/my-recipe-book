import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { setupDatabase } from '@/database/setup';
import * as Notifications from 'expo-notifications';
import { AndroidNotificationPriority } from 'expo-notifications';
import { DarkTheme, DefaultTheme, Href, ThemeProvider, useRouter } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect } from 'react';
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

    const router = useRouter();

    useEffect(() => {
        // 1. Handle notifications when the app is already open/backgrounded
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const url: Href = String(response.notification.request.content.data?.url) as Href;
            if (url)
                router.push(url);
        });

        // 2. Handle notifications that caused a closed app to open (Cold Start)
        const response = Notifications.getLastNotificationResponse(); 
        if(response?.notification) {
            const url: Href = String(response?.notification.request.content.data?.url) as Href;
            if (url)
                router.push(url);
        }
        
        return () => subscription.remove();
    }, []);
    
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
