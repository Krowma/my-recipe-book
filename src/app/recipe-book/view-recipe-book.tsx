import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FilterBar from '@/components/ui/filter-bar';
import { backgroundColors, elementColors, globalStyles, iconSize } from '@/constants/styles';
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useDatabaseRecipes } from '@/hooks/use-database-recipes';
import { useTheme } from "@/hooks/use-theme";
import { Recipe, Tag } from '@/types/recipe.types';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function ViewRecipeBook() {

    const theme = useTheme();
    const router = useRouter();
    
    const { recipes, fetchRecipes, deleteRecipe } = useDatabaseRecipes();

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
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
     * Button Callbacks
     */
    const handleRecipePressed = (recipe: Recipe) => {
        router.push({
            pathname: "/recipe-book/view-recipe",
            params: {recipeId: recipe.id }
        });
    }

    const handleFavoritesCallback = () => {
        console.log(" FAVORITE feature not implemented");
    }

    const handleCookingListCallback = () => {
        console.log("COOKING LIST feature not implemented");
    }

    /**
     * List display
     */
    const numColumns = 2;
    const imagePlaceholder = require('@/assets/images/image-not-found.png');

    return (
        <ThemedView style={[globalStyles.topLevelContainer, contentPlatformStyle]}>
            <ThemedView style={ globalStyles.viewTitleContainer }>
                <ThemedText type="subtitle">Recipe Book</ThemedText>
            </ThemedView>

            <ThemedView style={globalStyles.viewTopBar}>
                <Link href={{ pathname:"/recipe-book/view-recipe-form" }} asChild>
                    <Pressable>
                        <FontAwesomeFreeSolid name="add" size={ iconSize.default } color={ elementColors.grey } />
                    </Pressable>
                </Link>
                
                <Pressable
                    onPress={handleFavoritesCallback}>
                    <FontAwesomeFreeSolid name="heart" size={ iconSize.default } color={ elementColors.red } />
                </Pressable>

                <Pressable
                    onPress={handleCookingListCallback}>
                    <FontAwesomeFreeSolid name="utensils" size={ iconSize.default } color={ elementColors.grey } />
                </Pressable>
            </ThemedView>

            <ThemedView style={styles.filterContainer}>
                <FilterBar selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
                <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginHorizontal: Spacing.three, paddingVertical: Spacing.two}} />
            </ThemedView>
            
            <FlatList
                style={ globalStyles.flatListContainer }
                contentContainerStyle={[globalStyles.flatListSafeArea, styles.gridContainer]}
                numColumns={numColumns}
                data={recipes}
                renderItem={({ item }) => (
                    <View style={ cardStyle.cardContainer }> 
                        {isInDeleteMode && 
                            <TouchableOpacity 
                                style={cardStyle.deleteButton} 
                                onPress={() => deleteRecipe(item.id)}>
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
        </ThemedView>
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
        overflow: 'hidden',
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
});