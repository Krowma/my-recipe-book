import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { globalStyles, iconColors, iconSize } from '@/constants/styles';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useDatabaseDetails } from '@/hooks/use-database-details';
import { useDatabaseFormValidation } from '@/hooks/use-database-form-validation';
import { useDatabaseRecipes } from '@/hooks/use-database-recipes';
import { useTheme } from "@/hooks/use-theme";
import { Recipe, RecipeFormValues } from "@/types/recipe.types";
import Slider from '@expo/ui/community/slider';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { useFocusEffect } from 'expo-router';
import Fraction from 'fraction.js';
import { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { ViewRecipeForm } from './view-recipe-form';

interface RecipeProps {
    recipe: Recipe;
    closeCallback: () => void;
    updateDataCallback: () => void
}

export function ViewRecipe({recipe, closeCallback, updateDataCallback} : RecipeProps) {

    const theme = useTheme();

    const { tags, ingredients, instructions, notes, isLoading, fetchDetails } = useDatabaseDetails();
    const { updateRecipe } = useDatabaseRecipes();
    const { validateTags, validateIngredients } = useDatabaseFormValidation();

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isInstructions, setIsInstructions] = useState(false);
    const [servingSlider, setServingSlider] = useState(recipe.serving_count);

    /**
     * Database
     */
    useFocusEffect(
        useCallback(() => {
            fetchDetails(recipe.id);
            return () => {
                // Screen lost focus: Cleanup resources here
            };
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            setServingSlider(recipe.serving_count);
            return () => {
                // Screen lost focus: Cleanup resources here
            };
        }, [recipe])
    );


    /**
     * Form callbacks
     */
    const handleCloseCallback = () => {
        setIsEditing(false);
    }
    
    const handleSubmitCallback = async (data: RecipeFormValues) => {
        // Make sure ingredients and tags that already exist in the database use the correct id
        await validateTags(data.tags);
        await validateIngredients(data.ingredients);

        // Update recipe in the database
        await updateRecipe(data.recipe, data.tags, data.ingredients, data.instructions, data.notes);
        
        // Update states storing recipe data in component and parent component
        updateDataCallback();
        await fetchDetails(recipe.id);
    }

    const handleFavoriteCallback = () => {
        console.log(" FAVORITE feature not implemented");
    }

    /**  
     *  Top and Bottom sections (declared in function to be used in FlatList because you can't put a FlatList inside a scrollview)
     */
    function listHeader() {
        return(
            <ThemedView style={globalStyles.topLevelContainer}>
                <ThemedView style={styles.imageContainer}>
                    <Image 
                        source={{ uri: recipe.image }}
                        style={styles.recipeImage} />
                </ThemedView>

                <ThemedView style={styles.recipeNameContainer}>
                    <ThemedText type="subtitle" style={styles.recipeName}>{recipe.name}</ThemedText> 
                </ThemedView>

                <ThemedView style={styles.tagsContainer}>
                    {
                        tags.map((element, index) => (
                            <ThemedView key={index} type="backgroundElement" style={styles.tagElement}>
                                <ThemedText type="small">{element.name}</ThemedText>
                            </ThemedView>
                        ))
                    } 
                </ThemedView>

                {/* Buttons to switch between ingredients and instructions */}
                <ThemedView style={sectionStyles.buttonContainer}>
                    <Pressable
                        onPress={() => setIsInstructions(() => false)}>
                        <ThemedText style={[sectionStyles.sectionTitle, !isInstructions && sectionStyles.sectionTitlePressed]}>Ingredients</ThemedText>
                    </Pressable>
                    
                    <Pressable
                        onPress={() => setIsInstructions(() => true)}>
                        <ThemedText style={[sectionStyles.sectionTitle, isInstructions && sectionStyles.sectionTitlePressed]}>Instructions</ThemedText>
                    </Pressable>
                </ThemedView>

                {!isInstructions &&
                    <ThemedView style={sectionStyles.sliderContainer}> 
                        <ThemedText type="smallBold">Servings {servingSlider}</ThemedText>
                        <Slider
                            style={sectionStyles.slider}
                            minimumValue={1}
                            maximumValue={20}
                            step={1}
                            value={servingSlider}
                            onValueChange={(value : number) => setServingSlider(value)}
                            minimumTrackTintColor="#1FB28A"
                            maximumTrackTintColor="#D3D3D3"
                            thumbTintColor="#1FB28A"
                        />
                    </ThemedView>
                }    
            </ThemedView>
        );
    }

    function listFooter() {
        return(
            <ThemedView style={styles.notesContainer}>
                {
                    notes.map((element, index) => (
                        <ThemedText key={index} type="small">{element.content}</ThemedText>
                    ))
                }
            </ThemedView>
        );
    }

    let fractionSring = (floatValue : number) => {
        const fraction = new Fraction(floatValue);
        const simpleFraction = fraction.simplify(0.1).toFraction(true);
        return `${simpleFraction}`;
    }


    if(isEditing) {
        return(
            <ViewRecipeForm 
                closeCallback={handleCloseCallback} 
                submitCallback={handleSubmitCallback} 
                inRecipe={recipe} 
                inTags={tags} 
                inIngredients={ingredients} 
                inInstructions={instructions} 
                inNotes={notes} />
        );
    } 
    else {
        return(
            <ThemedView style={globalStyles.topLevelContainer}>
                <ThemedView style={globalStyles.viewTopBar}>
                    <Pressable
                        onPress={() => closeCallback()}>
                            <FontAwesomeFreeSolid name="chevron-circle-left" size={ iconSize.default } color={ iconColors.grey } />
                    </Pressable> 

                    <Pressable
                        onPress={handleFavoriteCallback}>
                        <FontAwesomeFreeSolid name="heart" size={ iconSize.default } color={ iconColors.red } />
                    </Pressable>
                    
                    <Pressable
                        onPress={() => setIsEditing(() => !isEditing)}>
                        <FontAwesomeFreeSolid name="pen-to-square" size={ iconSize.default } color={ iconColors.grey } />
                    </Pressable>
                </ThemedView>

                { isInstructions && 
                    <FlatList
                        style={ globalStyles.flatListContainer }
                        contentContainerStyle={ [globalStyles.flatListSafeArea, sectionStyles.listContainer] }
                        data={instructions}
                        ListHeaderComponent={listHeader()}
                        ListFooterComponent={listFooter()}
                        renderItem={({ item }) => (
                            <ThemedView style={sectionStyles.instruction}>
                                <ThemedText>{item.step_number}. {item.description}</ThemedText>
                                {
                                    Boolean(item.has_timer) && <ThemedText>Timer {item.timer_duration} min</ThemedText>
                                }
                            </ThemedView>
                        )} /> 
                }

                { !isInstructions && 
                    <FlatList
                        style={ globalStyles.flatListContainer }
                        contentContainerStyle={ [globalStyles.flatListSafeArea, sectionStyles.listContainer] }
                        data={ingredients}
                        ListHeaderComponent={listHeader()}
                        ListFooterComponent={listFooter()}
                        renderItem={({ item }) => (
                            <ThemedView style={sectionStyles.ingredient}>
                                <ThemedText>{fractionSring(item.quantity * (servingSlider/recipe.serving_count))} {item.unit} of {item.name} </ThemedText>
                            </ThemedView>
                        )} />
                }
            </ThemedView>
        );
    }
}

const sectionStyles = StyleSheet.create({
    buttonContainer: {
        gap: Spacing.four,
        flexDirection: 'row',
        paddingHorizontal: Spacing.five,
        paddingTop: Spacing.four,
        paddingBottom: Spacing.two,
    },
    sectionTitle:{
    },
    sectionTitlePressed: {
        textDecorationLine:"underline",
        fontWeight:"bold"
    },

    listContainer: {
        maxWidth: MaxContentWidth,
    },
    ingredient: {
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.one,
    },
    instruction:{
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.two,
    },

    sliderContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: Spacing.two,
        paddingHorizontal: Spacing.five,
        maxWidth: MaxContentWidth,
    },
    slider: {
        width: MaxContentWidth * 0.3,
    },
});

const styles = StyleSheet.create({
    recipeNameContainer: {
        flex:1,
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.two,
    },

    recipeName: {
        flexShrink: 1,
        fontSize: 28,
    },
    recipeImage: {
        width: '100%',
        aspectRatio: 296 / 171,
        height: 200,
        borderRadius: Spacing.three,
        margin: Spacing.two,
    },
    imageContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    tagsContainer: {
        gap: Spacing.two,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: Spacing.five,
    },
    tagElement:{
        borderRadius: Spacing.five,
        paddingHorizontal: Spacing.two,
        paddingVertical: Spacing.one,
    },

    notesContainer: {
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.two,
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});
