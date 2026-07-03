import { ThemedText } from '@/components/themed-text';
import { TimerText } from '@/components/ui/timer-text';
import { backgroundColors, elementColors, globalStyles, iconSize } from '@/constants/styles';
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useDatabaseCooking } from '@/hooks/use-database-cooking';
import { useDatabaseRecipes } from '@/hooks/use-database-recipes';
import { useDatabaseTimers } from '@/hooks/use-database-timers';
import { Recipe, Timer } from '@/types/recipe.types';
import FontAwesomeFreeSolid from '@react-native-vector-icons/fontawesome-free-solid';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import strftime from 'strftime';


export default function ViewCooking() {

    const { cookingRecipes, fetchCookingRecipes } = useDatabaseCooking();
    const { changeRecipeCooking } = useDatabaseRecipes();
    const { allTimers, fetchAllTimers, deleteTimerById, deleteTimerByRecipe } = useDatabaseTimers();

    const [now, setNow] = useState(Date.now());

    useFocusEffect(
        useCallback(() => {
            fetchCookingRecipes();
            fetchAllTimers();
        }, [])
    );

    useEffect(() => {
        if (allTimers.length === 0) return;

        const interval = setInterval(() => {
            setNow(Date.parse(strftime('%Y-%m-%dT%H:%M:%SZ')));
        }, 1000);

        return () => clearInterval(interval);
    }, [allTimers]);

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
        await changeRecipeCooking(recipeId, false);
        await fetchCookingRecipes();
    }

    const handleClearAllTimers = (recipeId: string) => {
        deleteTimerByRecipe(recipeId);
    }

    const handleClearTimer = (timer: Timer) => {
        deleteTimerById(timer);
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
                            

                            { allTimers.map((timer, index) => {
                                    if(timer.recipe_id !== item.id) { return null; }

                                    return (
                                        <View key={index} style={ recipeStyles.timerContainer }>
                                            <FontAwesomeFreeSolid name="clock" size={ iconSize.smaller } color={ elementColors.black } />
                                    
                                            <TimerText timer={timer} duration={timer.duration} nowMs={now} style={recipeStyles.timerText}/>
                                        
                                            <Pressable onPress={() => handleClearTimer(timer)}>
                                                <FontAwesomeFreeSolid 
                                                    name={ "stop" } 
                                                    size={ iconSize.smaller } 
                                                    color={ elementColors.red } />
                                            </Pressable> 
                                        </View>
                                    )
                            })}
                            
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
    timerContainer: {
        flexDirection: 'row',
        gap: Spacing.two,
        paddingLeft: Spacing.three
    },
    timerText: {
        width: '40%',
        paddingRight: Spacing.three
    }
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