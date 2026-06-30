import { ThemedText } from '@/components/themed-text';
import FloatingCircleMenu, { CircleMenuItem } from '@/components/ui/circle-menu';
import FilterBar from '@/components/ui/filter-bar';
import { backgroundColors, elementColors, globalStyles, iconSize } from '@/constants/styles';
import { BottomTabInset, Spacing } from "@/constants/theme";
import { importFromJsonFile } from '@/functions/json-exporter';
import { useDatabaseRecipes } from '@/hooks/use-database-recipes';
import { Recipe, RecipeObject, Tag } from '@/types/recipe.types';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Image, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function ViewRecipeBook() {

    const router = useRouter();
    
    const { recipes, createRecipe, fetchRecipes, deleteRecipe } = useDatabaseRecipes();

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [isInDeleteMode, setIsInDeleteMode] = useState(false);
    
    const [isFilterFavorite, setIsFilterFavorite] = useState(false);


    /**
     * Database
     */
    useFocusEffect(
        useCallback(() => {
            fetchRecipes(isFilterFavorite, selectedTags);
        }, [selectedTags, isFilterFavorite])
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

    /**
     * Button Callbacks
     */
    const handleRecipePressed = (recipe: Recipe) => {
        router.push({
            pathname: "/recipe-book/view-recipe",
            params: {recipeId: recipe.id }
        });
    }

    const handleFavoritesCallback = () => {
        setIsFilterFavorite(!isFilterFavorite);
    }

    const enterRecipeCallback = () => {
        router.push({ pathname: "/recipe-book/view-recipe-form" });
    }

    const importRecipeCallback = () => {
        importFromJsonFile(onImportSuccess, onImportFailure);
    }

    const onImportSuccess = async (recipe: RecipeObject) => {
        await createRecipe(recipe.recipe, recipe.tags, recipe.ingredients, recipe.instructions, recipe.notes);
        fetchRecipes(isFilterFavorite, selectedTags);
        showMessage({
            message: "Recipe imported.",
            description: "The recipe has been imported and added to you Recipe Book.",
            type: "success",
        });
    }

    const onImportFailure = (message: any) => {
        showMessage({
            message: "Failed to import the recipe.",
            description: "We weren't able to add the selected recipe to your recipe book.",
            type: "danger",
        });
    }

    const handleDeleteCallback = async (recipe: Recipe) => {
        await deleteRecipe(recipe.id);
        await fetchRecipes(isFilterFavorite, selectedTags);
    }

    /**
     * Display variables
     */
    const numColumns = 2;
    const imagePlaceholder = require('@/assets/images/image-not-found.png');

    const addRecipeMenuOption: CircleMenuItem[] = [
        {iconName: "pen", iconColor: elementColors.black, callback: enterRecipeCallback},
        {iconName: "file-arrow-down", iconColor: elementColors.black, callback: importRecipeCallback},
    ]

    function listFooter() {
        return(
            <View>
            </View>
        );
    }

    return (
        <View style={[globalStyles.topLevelContainer, contentPlatformStyle]}>
            <View style={ globalStyles.viewTitleContainer }>
                <ThemedText type="subtitle">Recipe Book</ThemedText>
            </View>

            <View style={globalStyles.viewTopBar}>
               <FloatingCircleMenu items={ addRecipeMenuOption }/>

                <Pressable
                    onPress={handleFavoritesCallback}>
                    <FontAwesomeFreeSolid name="heart" size={ iconSize.default } color={ isFilterFavorite ? elementColors.red : elementColors.black } />
                </Pressable>                    
            </View>

            <View style={styles.filterContainer}>
                <FilterBar selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
                <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginHorizontal: Spacing.three, paddingVertical: Spacing.two}} />
            </View>
            
            <FlatList
                style={ globalStyles.flatListContainer }
                contentContainerStyle={[globalStyles.flatListSafeArea, styles.gridContainer]}
                ListFooterComponentStyle={ globalStyles.flatListSafeArea }
                numColumns={numColumns}
                data={recipes}
                ListFooterComponent={listFooter()}
                renderItem={({ item }) => (
                    <View style={ cardStyle.cardContainer }> 
                        {isInDeleteMode && 
                            <TouchableOpacity 
                                style={cardStyle.deleteButton} 
                                onPress={() => handleDeleteCallback(item)}>
                                    <ThemedText type="smallBold">✕</ThemedText>
                            </TouchableOpacity>
                        }

                        <Pressable
                            onPress={() => handleRecipePressed(item)}
                            onLongPress={() => setIsInDeleteMode(() => !isInDeleteMode)}>
                                <Image 
                                    source={ item.image && item.image != "" ? { uri: item.image } : imagePlaceholder } 
                                    style={cardStyle.recipeImage} />
                                <ThemedText style={cardStyle.recipeName}>{item.name}</ThemedText>
                        </Pressable>
                    </View>
                )}
            />
        </View>
    );
}


const cardStyle = StyleSheet.create({
    cardContainer: {
        flex: 1,
        padding: Spacing.two,
        margin: 5,
        borderRadius: Spacing.three,
        maxWidth: '50%',
        minHeight: 150,
        maxHeight: 200,
        position: 'relative',
        //overflow: 'hidden',
        backgroundColor: backgroundColors.white
    },

    recipeName: {
        paddingVertical: Spacing.two,
        fontWeight:"bold",
        fontSize: 16,
        lineHeight: 18,
    },

    recipeImage: {
        width: '100%',
        height: 100,
        borderRadius: Spacing.three,
        marginTop: Spacing.two,
    },

    deleteButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#ff4d4d',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        elevation: 10, 
    },
});

const styles = StyleSheet.create({

    filterContainer: {
        paddingTop: Spacing.four,
        paddingBottom: Spacing.two
    },

    gridContainer: {
        gap: Spacing.two,
    },

    circleButton: {
        width: 50,
        height: 50,
        borderRadius: 25, // Half of width/height to make a perfect circle
        backgroundColor: '#007AFF', // Solid background color
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});