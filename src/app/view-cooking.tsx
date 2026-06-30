import { ThemedText } from '@/components/themed-text';
import { globalStyles } from '@/constants/styles';
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useDatabaseCooking } from '@/hooks/use-database-cooking';
import { Recipe } from '@/types/recipe.types';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function ViewCooking() {

    const { cookingRecipes, fetchCookingRecipes } = useDatabaseCooking();

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


    return (
        <View style={[globalStyles.topLevelContainer, contentPlatformStyle]}>
            <View style={ globalStyles.viewTitleContainer }>
                <ThemedText type="subtitle">Cooking</ThemedText>
            </View>

            {/*<ScrollView 
                style={ globalStyles.flatListContainer } 
                contentContainerStyle={ [styles.scrollView, {paddingBottom: 300}] } >

                {cookingRecipes.map((item, index) => (
                    <View style={styles.recipeContainer}>
                        <ThemedText type='default' style={styles.recipeName}>{item.name}</ThemedText>
                        
                        TODO show active timers here
                        
                        <View style={ styles.separationLine } />
                    </View>
                ))}   
            </ScrollView>*/}

            { cookingRecipes.length > 0 && 
                <FlatList
                    style={ globalStyles.flatListContainer }
                    contentContainerStyle={ styles.listContainer }
                    ListFooterComponentStyle={ globalStyles.flatListSafeArea }
                    data={cookingRecipes}
                    renderItem={({ item }) => (
                        <View style={styles.recipeContainer}>
                            <Pressable onPress={ () => handleRecipeCallback(item) }>
                                <ThemedText type='default' style={styles.recipeName}>{item.name}</ThemedText>
                            </Pressable>
                            
                            
                            {/*TODO show active timers here*/}
                            
                            <View style={ styles.separationLine } />
                        </View>
                    )}
                />
            }

        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        gap: Spacing.five
    },

    listContainer: {
        maxWidth: MaxContentWidth,
    },

    recipeContainer: {
        flexDirection: 'column'
    },
    recipeName: {
        flexShrink: 1,
        lineHeight: 20
    },

    separationLine: {
        borderBottomColor: 'black', 
        borderBottomWidth: StyleSheet.hairlineWidth, 
        marginHorizontal: Spacing.one, 
        paddingBottom: Spacing.two
    }
    
});