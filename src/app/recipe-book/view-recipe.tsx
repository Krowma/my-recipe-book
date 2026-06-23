import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { globalStyles, iconColors, iconSize } from '@/constants/styles';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useDatabaseRecipes } from '@/hooks/use-database-recipes';
import Slider from '@expo/ui/community/slider';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { Link, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import Fraction from 'fraction.js';
import { useCallback, useState } from 'react';
import { FlatList, Image, Platform, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function ViewRecipe() {

    const router = useRouter();

    const { recipe, tags, ingredients, instructions, notes, fetchRecipeWithDetails } = useDatabaseRecipes();

    const { recipeId } = useLocalSearchParams<{ recipeId: string; }>();

    const [isInstructions, setIsInstructions] = useState(false);
    const [servingSlider, setServingSlider] = useState(1);

    const imagePlaceholder = require('@/assets/images/image-not-found.png');

    /**
     * Database
     */
    useFocusEffect(
        useCallback(() => {
            fetchRecipeWithDetails(recipeId);
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            if(recipe) {
                setServingSlider(recipe.serving_count);
            }
        }, [recipe])
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
     * Button callbacks
     */

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
                        source={ recipe && recipe.image != "" ? { uri: recipe.image } : imagePlaceholder }
                        style={styles.recipeImage} />
                </ThemedView>

                <ThemedView style={styles.recipeNameContainer}>
                    <ThemedText type="subtitle" style={styles.recipeName}>{ recipe? recipe.name : "" }</ThemedText> 
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
    
    return(
        <ThemedView style={ [globalStyles.topLevelContainer, contentPlatformStyle] }>
            <ThemedView style={globalStyles.viewTopBar}>
                <Pressable
                    onPress={() => router.back()}>
                        <FontAwesomeFreeSolid name="chevron-circle-left" size={ iconSize.default } color={ iconColors.grey } />
                </Pressable> 

                <Pressable
                    onPress={handleFavoriteCallback}>
                    <FontAwesomeFreeSolid name="heart" size={ iconSize.default } color={ iconColors.red } />
                </Pressable>
                
                <Link href={{ pathname:"/recipe-book/view-recipe-form", params: {recipeId: recipeId} }} asChild>
                    <Pressable>
                        <FontAwesomeFreeSolid name="pen-to-square" size={ iconSize.default } color={ iconColors.grey } />
                    </Pressable>
                </Link>
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
                            <ThemedText>{ recipe ? fractionSring(item.quantity * (servingSlider/recipe.serving_count)) : 0 } {item.unit} of {item.name} </ThemedText>
                        </ThemedView>
                    )} />
            }
        </ThemedView>
    );
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
