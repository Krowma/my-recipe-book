import { ViewRecipe } from '@/app/views/view-recipe';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FilterBar from '@/components/ui/filter-bar';
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useDatabaseRecipes } from '@/hooks/use-database-recipes';
import { useTheme } from "@/hooks/use-theme";
import { Recipe, Tag } from '@/types/recipe.types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function RecipeBookScreen() {

    const theme = useTheme();
    
    const { recipes, fetchRecipes, deleteRecipe } = useDatabaseRecipes();

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    
    const [isRecipeOpen, setIsRecipeOpen] = useState(false);
    const [openedRecipeId, setOpenedRecipeId] = useState<string>(); 

    const [isInDeleteMode, setIsInDeleteMode] = useState(false);

    /**
     * Database
     */
    useFocusEffect(
        useCallback(() => {
            fetchRecipes();
            return () => {
                // Screen lost focus: Cleanup resources here
            };
        }, [])
    );

    useEffect(() => {
        fetchRecipes(selectedTags);
        
        return () => { };
    }, [selectedTags]);
    
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
     * Page components
     */
    function listHeader() {
        return (
            <ThemedView style={styles.container}>
                <FilterBar selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
            </ThemedView>
        );
    }

    function listFooter() {
        return (
            <ThemedView style={styles.container}>
                {/* todo */}
            </ThemedView>
        );
    }

    const openedRecipe = recipes.find(e => e.id === openedRecipeId);

    const handleRecipePressed = (recipe: Recipe) => {
        if(isInDeleteMode){
            deleteRecipe(recipe.id);
        }
        else{
            setIsRecipeOpen(true);
            setOpenedRecipeId(recipe.id);
        }
    }

    const handleCloseRecipe = () => {
        setIsRecipeOpen(false);
    }

    const handleUpdateData = async () => {
        await fetchRecipes();
    }

    /**
     * List display
     */
    const numColumns = 3;

    if(isRecipeOpen && openedRecipe) {
        return (
            <ThemedView style={[styles.container, contentPlatformStyle]}>
                <Animated.View entering={FadeIn.duration(100)} /*exiting={FadeOut.duration(200)}*/>
                    <ViewRecipe recipe={openedRecipe} closeCallback={handleCloseRecipe} updateDataCallback={handleUpdateData} />
                </Animated.View>
            </ThemedView>
        );
    }
    else {
        return (
            <ThemedView style={[styles.container, contentPlatformStyle]}>
                <ThemedView style={styles.headerContainer}>
                    <ThemedText type="subtitle">Recipe Book</ThemedText>
                    <Pressable
                        style={({ pressed }) => pressed && styles.pressed}
                        onPress={() => setIsInDeleteMode(() => !isInDeleteMode)}>
                        <ThemedText type="small" style={[styles.headerButton, isInDeleteMode && styles.headerButtonPressed]}>delete</ThemedText>
                    </Pressable>
                </ThemedView>
                
                <FlatList
                    style={[styles.container, { backgroundColor: theme.background }]}
                    contentInset={insets}
                    contentContainerStyle={styles.gridContainer}
                    numColumns={numColumns}
                    data={recipes}
                    ListHeaderComponent={listHeader()}
                    ListFooterComponent={listFooter()}
                    renderItem={({ item }) => (
                        <Pressable
                            style={({ pressed }) => [styles.recipeCard, { backgroundColor: theme['backgroundElement']}, pressed && styles.pressed]}
                            onPress={() => handleRecipePressed(item)}>
                                <ThemedText style={styles.recipeName}>{item.name}</ThemedText>
                        </Pressable>
                    )}
                />
            </ThemedView>
        );
    }
}


const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: Spacing.two,
        paddingHorizontal: Spacing.five,
        paddingVertical: Spacing.two,
    },
    buttonContainer: {
        gap: Spacing.four,
        flexDirection: 'row',
    },
    headerButton:{
        // todo
    },
    headerButtonPressed: {
        textDecorationLine:"underline",
        fontWeight:"bold"
    },

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