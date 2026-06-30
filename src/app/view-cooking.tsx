import { ThemedText } from '@/components/themed-text';
import { backgroundColors, globalStyles } from '@/constants/styles';
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useDatabaseCooking } from '@/hooks/use-database-cooking';
import { useDatabaseRecipes } from '@/hooks/use-database-recipes';
import { Recipe } from '@/types/recipe.types';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function ViewCooking() {

    const { cookingRecipes, fetchCookingRecipes } = useDatabaseCooking();
    const { changeRecipeCooking } = useDatabaseRecipes();

    useFocusEffect(
        useCallback(() => {
            fetchCookingRecipes();
        }, [])
    );

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

    const handleRecipeCallback = (recipe: Recipe) => {
        router.push({
            pathname: "/recipe-book/view-recipe",
            params: {recipeId: recipe.id }
        });
    }

    const handleRemoveRecipe = async (recipeId: string) => {
        await changeRecipeCooking(recipeId, 0);
        await fetchCookingRecipes();
    }

    const handleClearAllTimers = (recipeId: string) => {
        console.log(" Clear All Timers feature not implemented");
    }

    const handleClearTimer = (recipeId: string, stepId: string) => {
        console.log(" STOP TIMER feature not implemented");
    }


    return (
        <View style={[globalStyles.topLevelContainer, contentPlatformStyle]}>
            <View style={ globalStyles.viewTitleContainer }>
                <ThemedText type="subtitle">Cooking</ThemedText>
            </View>

            { cookingRecipes.length > 0 && 
                <FlatList
                    style={ globalStyles.flatListContainer }
                    contentContainerStyle={ styles.listContainer }
                    ListFooterComponentStyle={ globalStyles.flatListSafeArea }
                    data={cookingRecipes}
                    renderItem={({ item }) => (
                        <View style={styles.elementContainer}>
                            <View style={ recipeStyles.recipeContainer }>
                                <Pressable style={ recipeStyles.nameButton } onPress={ () => handleRecipeCallback(item) }>
                                    <ThemedText type='section' style={recipeStyles.nameText}>{item.name}</ThemedText>
                                </Pressable>

                                <Pressable style={ recipeStyles.button } onPress={ () => handleRemoveRecipe(item.id) }>
                                    <ThemedText type='smallBold'>Remove</ThemedText>
                                </Pressable>

                                <Pressable style={ recipeStyles.button } onPress={ () => handleClearAllTimers(item.id) }>
                                    <ThemedText type='smallBold'>Clear Timers</ThemedText>
                                </Pressable>
                            </View>
                            

                            {/*TODO show active timers here*/}
                            <View style={ timerStyles.timerContainer }>
                                <TouchableOpacity 
                                    style={timerStyles.deleteButton} 
                                    onPress={() => handleClearTimer(item.id, "1")}>
                                        <ThemedText type="smallBold">✕</ThemedText>
                                </TouchableOpacity>
                                
                                <ThemedText type='default'>Step 1. </ThemedText>
                                <ThemedText type='default'>35 mins remaining</ThemedText>
                            </View>
                            
                            <View style={ styles.separationLine } />
                        </View>
                    )}
                />
            }

        </View>
    );
}


const recipeStyles = StyleSheet.create({
    recipeContainer: {
        flexDirection: 'row',
        gap: Spacing.two,
        paddingBottom: Spacing.two,
        alignItems: 'center'
    },
    button: {
        borderRadius: 20,
        padding: Spacing.one,
        backgroundColor: backgroundColors.orange
    },
    nameText: {
        flexShrink: 1,
        lineHeight: 20,
    },
    nameButton: {
        width: '55%',
    },
});

const timerStyles = StyleSheet.create({
    timerContainer: {
        flexDirection: 'row',
        paddingLeft: Spacing.four,
        gap: Spacing.two
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        gap: Spacing.five
    },

    listContainer: {
        maxWidth: MaxContentWidth,
        gap: Spacing.five
    },
    elementContainer: {
        flexDirection: 'column'
    },
    
    separationLine: {
        borderBottomColor: 'black', 
        borderBottomWidth: StyleSheet.hairlineWidth, 
        marginHorizontal: Spacing.one, 
        paddingBottom: Spacing.two
    },
});