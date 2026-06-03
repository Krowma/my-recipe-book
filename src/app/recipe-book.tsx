import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ViewRecipe } from '@/components/views/view-recipe';
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Recipe } from '@/types/recipe.types';
import { useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from "react-native-safe-area-context";


import { RecipeChocolateCake, RecipePancake } from '@/mocking/mock-recipes';


export default function RecipeBookScreen() {

    const theme = useTheme();
    const [isRecipeOpen, setIsRecipeOpen] = useState(false);
    const [openedRecipe, setOpenedRecipe] = useState<Recipe>();
    
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


    /**
     * Recipes data
     */
    let mockRecipes = [RecipeChocolateCake, RecipePancake];
    const numColumns = 3;

    function listHeader() {
        return (
            <ThemedView style={styles.container}>
                {/* todo filter bar */}
            </ThemedView>
        );
    }

    /**
     * Page components
     */
    function listFooter() {
        return (
            <ThemedView style={styles.container}>
                {/* todo */}
            </ThemedView>
        );
    }

    const handleOpenRecipe = (recipe: Recipe) => {
        setIsRecipeOpen(true);
        setOpenedRecipe(recipe);
    }

    const handleCloseRecipe = () => {
        setIsRecipeOpen(false);
    }

    if(isRecipeOpen && openedRecipe) {
        return (
            <ThemedView style={[styles.container, contentPlatformStyle]}>
                <Animated.View entering={FadeIn.duration(100)} /*exiting={FadeOut.duration(200)}*/>
                    <ViewRecipe recipe={openedRecipe} closeCallback={handleCloseRecipe} />
                </Animated.View>
            </ThemedView>
        );
    }
    else {
        return (
            <ThemedView style={[styles.container, contentPlatformStyle]}>
                <ThemedText type="subtitle" style={styles.titleContainer}>Recipe Book</ThemedText>
                <FlatList
                    style={[styles.container, { backgroundColor: theme.background }]}
                    contentInset={insets}
                    contentContainerStyle={styles.gridContainer}
                    numColumns={numColumns}
                    data={mockRecipes}
                    ListHeaderComponent={listHeader()}
                    ListFooterComponent={listFooter()}
                    renderItem={({ item }) => (
                        <Pressable
                            style={({ pressed }) => [styles.recipeCard, { backgroundColor: theme['backgroundElement']}, pressed && styles.pressed]}
                            onPress={() => handleOpenRecipe(item)}>
                                <ThemedText style={styles.recipeName}>{item.name}</ThemedText>
                        </Pressable>
                    )}
                />
            </ThemedView>
        );
    }
}


const styles = StyleSheet.create({
    gridContainer: {
        padding: Spacing.three,
        gap: Spacing.four,
    },
    recipeCard: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

        padding: Spacing.two,
        margin: 5,
        borderRadius: Spacing.three,

        maxWidth: '25%',
    },

    recipeName: {
        fontWeight:"bold"
    },

    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        maxWidth: MaxContentWidth,
        flexDirection: "column"
    },
    titleContainer: {
        gap: Spacing.three,
        alignItems: 'center',
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.four,
    },
    centerText: {
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.7,
    },
    sectionsWrapper: {
        gap: Spacing.five,
        paddingHorizontal: Spacing.four,
        paddingTop: Spacing.three,
    },
    collapsibleContent: {
        alignItems: 'center',
    },
});