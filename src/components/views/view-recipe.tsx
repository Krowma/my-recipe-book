import { useState } from 'react';

import { FlatList, Pressable, StyleSheet } from 'react-native';

import { Recipe } from "@/types/recipe.types";

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from "@/hooks/use-theme";
import { SymbolView } from 'expo-symbols';

interface RecipeProps {
    recipe: Recipe;
    closeCallback: () => void;
}

export function ViewRecipe({recipe, closeCallback} : RecipeProps) {

    const theme = useTheme();
    const [isInstructions, setIsInstructions] = useState(false);

    /**  
     *  Top and Bottom sections (declared in function to be used in FlatList because you can't put a FlatList inside a scrollview)
     */
    function listHeader({name, image, tags} : Recipe) {
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
                                <ThemedText type="small">{element}</ThemedText>
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
            </ThemedView>
        );
    }

    function listFooter({notes} : Recipe) {
        return(
            <ThemedView style={styles.notesContainer}>
                <ThemedText type="small">{notes}</ThemedText>
            </ThemedView>
        );
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
                data={recipe.instructions}
                ListHeaderComponent={listHeader(recipe)}
                ListFooterComponent={listFooter(recipe)}
                renderItem={({ item }) => (
                    <ThemedView style={styles.instruction}>
                        <ThemedText>{item.description}</ThemedText>
                        {
                            item.hasTimer && <ThemedText>Timer {item.timerDuration} min</ThemedText>
                        }
                    </ThemedView>
                )}
            /> 
            </ThemedView>
            
        )
    }
    else{
        return (
            <ThemedView style={styles.container}>
                <FlatList
                style={[styles.container, { backgroundColor: theme.background }]}
                contentContainerStyle={styles.listContainer}
                data={recipe.ingredients}
                ListHeaderComponent={listHeader(recipe)}
                ListFooterComponent={listFooter(recipe)}
                renderItem={({ item }) => (
                    <ThemedView style={styles.ingredient}>
                        <ThemedText>{item.name} {item.quantity} {item.unit}</ThemedText>
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
        maxWidth: MaxContentWidth,
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

    pressed: {
        opacity: 0.7,
    },
});
