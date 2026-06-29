import { ThemedText } from '@/components/themed-text';
import { globalStyles } from '@/constants/styles';
import { BottomTabInset, Spacing } from "@/constants/theme";
import { setupDatabase } from '@/database/setup';
import * as SQLite from 'expo-sqlite';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function ViewSettings() {

    const DEBUG_OPTIONS_AVAILABLE = true;

    /**
     * Platform safe area
     */
    const safeAreaInsets = useSafeAreaInsets();
    const insets = {
        ...safeAreaInsets,
        bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
    };
    
    const contentPlatformStyle = Platform.select({
        android: {
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: insets.bottom,
        },
        web: {
            paddingTop: Spacing.six,
            paddingBottom: Spacing.four,
        },
    });

    const sendToDeviceNotification = () => {
        console.log("[Nt] Not implemented : sendToDeviceNotification");
    }

    const resetDatabase = async () => {
        try {
            const db = await SQLite.openDatabaseAsync('recipebook.db', { useNewConnection: true });
            // Deletes rows from all tables (cannot simply delete database as the SQL Provider is keeping it open)
            await db.execAsync(`
                DELETE FROM recipes;
                DELETE FROM tags;
                DELETE FROM recipe_tags;
                DELETE FROM ingredients;
                DELETE FROM recipe_ingredients;
                DELETE FROM instructions;
                DELETE FROM notes;
                VACUUM;
            `);
            await db.execAsync('PRAGMA user_version = 0');
            await setupDatabase(db);

            console.log('Database cleared successfully.');
        } catch (error) {
            console.error('Failed to clear database:', error);
        }
    }

    return (
        <View style={[globalStyles.topLevelContainer, contentPlatformStyle]}>
            <View style={ globalStyles.viewTitleContainer }>
                <ThemedText type="subtitle">Recipe Book</ThemedText>
            </View>

            <ScrollView 
                style={ globalStyles.flatListContainer } 
                contentContainerStyle={ [styles.scrollView, {paddingBottom: 300}] } >

                { DEBUG_OPTIONS_AVAILABLE &&
                    <View style={ styles.sectionContainer }>
                        <View>
                            <ThemedText type='section' style={ styles.sectionTitle }>DEBUG</ThemedText>
                            <View style={ styles.titleLine } />
                        </View>
 
                        <Pressable onPress={ resetDatabase }>
                            <ThemedText>Reset local database</ThemedText>
                        </Pressable>
                    </View>
                }

                <View style={ styles.sectionContainer }>
                    <View>
                        <ThemedText type='section' style={ styles.sectionTitle }>NOTIFICATIONS</ThemedText>
                        <View style={ styles.titleLine } />
                    </View>

                    <Pressable onPress={ sendToDeviceNotification }>
                        <ThemedText>Enable notifications</ThemedText>
                    </Pressable>
                </View>
                    
            </ScrollView>
            
            
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        gap: Spacing.five
    },

    sectionContainer: {
        flexDirection: 'column',
        gap: Spacing.two
    },
    sectionTitle: {
        paddingLeft: Spacing.three
    },
    titleLine: { 
        borderBottomColor: 'black', 
        borderBottomWidth: StyleSheet.hairlineWidth, 
        width: '50%',
        marginLeft: Spacing.one, 
        //paddingTop: Spacing.one, 
        paddingBottom: Spacing.one
    },

    
});