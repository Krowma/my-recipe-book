import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useDatabaseDetails } from '@/hooks/use-database-details';
import { useDatabaseFormValidation } from '@/hooks/use-database-form-validation';
import { useDatabaseRecipes } from '@/hooks/use-database-recipes';
import { useTheme } from "@/hooks/use-theme";
import { Recipe, RecipeFormValues } from "@/types/recipe.types";
import Slider from '@expo/ui/community/slider';
import { useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import Fraction from 'fraction.js';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet } from 'react-native';
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

    /**  
     *  Top and Bottom sections (declared in function to be used in FlatList because you can't put a FlatList inside a scrollview)
     */
    function listHeader() {
        return(
            <ThemedView style={styles.container}>
                <ThemedView style={styles.titleContainer}>
                    {/*TODO image*/}
                    <Pressable
                        style={({ pressed }) => pressed && styles.pressed}
                        onPress={() => closeCallback()}>
                            <SymbolView
                                name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                                size={23}
                                weight="bold"
                                tintColor={theme.text}
                            />
                    </Pressable> 
                    <ThemedText type="subtitle" style={styles.title}>{recipe.name}</ThemedText> 
                    <Pressable
                        style={({ pressed }) => pressed && styles.pressed}
                        onPress={() => setIsEditing(() => !isEditing)}>
                        <ThemedText type="small" style={styles.headerButton}>edit</ThemedText>
                    </Pressable>
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
                <ThemedView style={styles.buttonContainer}>
                    <Pressable
                        style={({ pressed }) => pressed && styles.pressed}
                        onPress={() => setIsInstructions(() => false)}>
                        <ThemedText style={[styles.sectionTitle, !isInstructions && styles.sectionTitlePressed]}>Ingredients</ThemedText>
                    </Pressable>
                    
                    <Pressable
                        style={({ pressed }) => pressed && styles.pressed}
                        onPress={() => setIsInstructions(() => true)}>
                        <ThemedText style={[styles.sectionTitle, isInstructions && styles.sectionTitlePressed]}>Instructions</ThemedText>
                    </Pressable>
                </ThemedView>

                {!isInstructions &&
                    <ThemedView style={styles.sliderContainer}> 
                        <ThemedText type="smallBold">Servings {servingSlider}</ThemedText>
                        <Slider
                            style={styles.slider}
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
    
    /**  
     *  Ingredients / instructions section
     */
    if(isEditing) {
        return(
            <ScrollView>
                <ViewRecipeForm closeCallback={handleCloseCallback} submitCallback={handleSubmitCallback} 
                inRecipe={recipe} inTags={tags} inIngredients={ingredients} inInstructions={instructions} inNotes={notes} />
            </ScrollView>
        );
    } 
    else if(isInstructions) {
        return(
            <ThemedView style={styles.container}>
                <FlatList
                style={[styles.container, { backgroundColor: theme.background }]}
                contentContainerStyle={styles.listContainer}
                data={instructions}
                ListHeaderComponent={listHeader()}
                ListFooterComponent={listFooter()}
                renderItem={({ item }) => (
                    <ThemedView style={styles.instruction}>
                        <ThemedText>{item.step_number}. {item.description}</ThemedText>
                        {
                            Boolean(item.has_timer) && <ThemedText>Timer {item.timer_duration} min</ThemedText>
                        }
                    </ThemedView>
                )}
            /> 
            </ThemedView>
        );
    } 
    else {
        return (
            <ThemedView style={styles.container}>
                <FlatList
                    style={[styles.container, { backgroundColor: theme.background }]}
                    contentContainerStyle={styles.listContainer}
                    data={ingredients}
                    ListHeaderComponent={listHeader()}
                    ListFooterComponent={listFooter()}
                    renderItem={({ item }) => (
                        <ThemedView style={styles.ingredient}>
                            <ThemedText>{fractionSring(item.quantity * (servingSlider/recipe.serving_count))} {item.unit} of {item.name} </ThemedText>
                        </ThemedView>
                    )}
                />
            </ThemedView>    
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        flexGrow: 1,
        backgroundColor: "white"
    },
    titleContainer: {
        flexDirection: 'row',
        flex:1,
        alignItems: "center",
        gap: Spacing.two,
        paddingHorizontal: Spacing.five,
        paddingVertical: Spacing.two,
    },
    title: {
        flexShrink: 1
        
    },
    headerButton:{
        // todo
    },
    headerButtonPressed: {
        textDecorationLine:"underline",
        fontWeight:"bold"
    },
    buttonContainer: {
        gap: Spacing.four,
        flexDirection: 'row',
        paddingHorizontal: Spacing.five,
        paddingTop: Spacing.four,
        paddingBottom: Spacing.two,
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: Spacing.two,
        paddingHorizontal: Spacing.five,
        maxWidth: MaxContentWidth,
    },
    tagsContainer: {
        gap: Spacing.two,
        flexDirection: 'row',
        paddingHorizontal: Spacing.five,
    },
    listContainer: {
        maxWidth: MaxContentWidth,
    },
    notesContainer: {
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.two,
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },

    sectionTitle:{
        // todo
    },
    sectionTitlePressed: {
        textDecorationLine:"underline",
        fontWeight:"bold"
    },

    tagElement:{
        borderRadius: Spacing.five,
        paddingHorizontal: Spacing.two,
        paddingVertical: Spacing.one,
    },
    ingredient: {
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.one,
    },
    instruction:{
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.two,
    },

    slider: {
        width: MaxContentWidth * 0.3,
    },
    pressed: {
        opacity: 0.7,
    },
});
