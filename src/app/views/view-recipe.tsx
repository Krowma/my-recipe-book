import { useCallback, useState } from 'react';

import Slider from '@expo/ui/community/slider';
import Fraction from 'fraction.js';
import { FlatList, Pressable, StyleSheet } from 'react-native';

import { Recipe } from "@/types/recipe.types";

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useDatabaseDetails } from '@/hooks/use-database-details';
import { useTheme } from "@/hooks/use-theme";
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { SymbolView } from 'expo-symbols';


interface RecipeProps {
    recipe: Recipe;
    closeCallback: () => void;
}

export function ViewRecipe({recipe, closeCallback} : RecipeProps) {

    const theme = useTheme();

    const db = useSQLiteContext();
    const { tags, ingredients, instructions, notes, isLoading, fetchDetails } = useDatabaseDetails();

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

    /**  
     *  Top and Bottom sections (declared in function to be used in FlatList because you can't put a FlatList inside a scrollview)
     */
    function listHeader({name, image} : Recipe) {
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
                    <ThemedText type="subtitle">{name}</ThemedText> 
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
    if(isInstructions)
    {
        return(
            <ThemedView style={styles.container}>
                <FlatList
                style={[styles.container, { backgroundColor: theme.background }]}
                contentContainerStyle={styles.listContainer}
                data={instructions}
                ListHeaderComponent={listHeader(recipe)}
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
        )
    }
    else {
        return (
            <ThemedView style={styles.container}>
                <FlatList
                    style={[styles.container, { backgroundColor: theme.background }]}
                    contentContainerStyle={styles.listContainer}
                    data={ingredients}
                    ListHeaderComponent={listHeader(recipe)}
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
        alignItems: "center",
        gap: Spacing.two,
        paddingHorizontal: Spacing.five,
        paddingVertical: Spacing.two,
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
