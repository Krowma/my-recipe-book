import { ThemedText } from "@/components/themed-text";
import { Collapsible } from "@/components/ui/collapsible";
import FormListIngredients from "@/components/ui/form-list-ingredients";
import FormListInstructions from "@/components/ui/form-list-instructions";
import FormListNotes from "@/components/ui/form-list-notes";
import FormListTags from "@/components/ui/form-list-tags";
import { formStyles } from "@/constants/formStyle";
import { elementColors, globalStyles, iconSize } from "@/constants/styles";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useDatabaseRecipes } from "@/hooks/use-database-recipes";
import { RecipeObject } from "@/types/recipe.types";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { randomUUID } from 'expo-crypto';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Controller, FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function ViewRecipeForm() {

    const router = useRouter();

    const { recipe, tags, ingredients, instructions, notes, isLoading, fetchRecipeWithDetails, updateRecipe, createRecipe } = useDatabaseRecipes();

    const { recipeId } = useLocalSearchParams<{ recipeId: string; }>();

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
     * React Hook Form
     */
    const methods = useForm<RecipeObject>({ 
        mode: "onBlur",
        values: {
            recipe: recipe || {
                id: "",
                name: "",
                image: "",
                serving_count: 1,
                duration: 0,
                is_cooking: 0
            }, 
            tags: tags || [],
            ingredients: ingredients || [],
            instructions: instructions || [],
            notes: notes || [],
        },
    });

    const handleSubmitCallback = async (data: RecipeObject) => {
        if(recipeId) {
            await updateRecipe(data.recipe, data.tags, data.ingredients, data.instructions, data.notes);
        }
        else {
            data.recipe.id = randomUUID();
            await createRecipe(data.recipe, data.tags, data.ingredients, data.instructions, data.notes);
        }

        router.back();
    }

    const onSubmit: SubmitHandler<RecipeObject> = (data) => {
        //console.log("Recipe form submit successfully : ", JSON.stringify(data, null, 2));
        handleSubmitCallback(data);
    } 

    const onSubmitFail: SubmitErrorHandler<RecipeObject> = (errors) => {
        console.log("Recipe form submit failed : ", JSON.stringify(errors, null, 2));
    } 

    /**
     * Database
     */
    useEffect(() => {
        if(recipeId)
            fetchRecipeWithDetails(recipeId);
    }, []);

    return(
        <View style={[globalStyles.topLevelContainer, contentPlatformStyle]}>
            <View style={ globalStyles.viewTitleContainer }>
                <ThemedText type="subtitle">Edit your Recipe</ThemedText>
            </View>

            <View style={styles.viewTopBar}>
                <Pressable onPress={() => router.back()}>
                    <FontAwesomeFreeSolid name="chevron-circle-left" size={ iconSize.default } color={ elementColors.black } />
                </Pressable> 

                <Pressable onPress={methods.handleSubmit(onSubmit, onSubmitFail)}>
                    <FontAwesomeFreeSolid name="check-circle" size={ iconSize.default } color={ elementColors.blue } />
                </Pressable> 
            </View>

            <ScrollView 
                style={ globalStyles.flatListContainer } 
                contentContainerStyle={ [styles.scrollView, {paddingBottom: 300}] } >

                <FormProvider {...methods} >
                    <View style={styles.formContainer}>
                        <View style={formStyles.sectionContainer}>
                            {/* name */}
                            <View style={styles.fieldContainer}>
                                <ThemedText>Name </ThemedText>
                                <Controller
                                    control={methods.control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            placeholder="Recipe name"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            style={formStyles.inputField} />
                                    )}
                                    name="recipe.name" />
                            </View>

                            {/* servings */}
                            <View style={styles.fieldContainer}>
                                <ThemedText>Number of servings </ThemedText>
                                <Controller
                                    control={methods.control}
                                    rules={{ required: true, }}
                                    defaultValue={1}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            onBlur={onBlur}
                                            onChangeText={(text) => {
                                                if (text === '') {
                                                    onChange(null);
                                                    return;
                                                }
                                                const parsedValue = parseInt(text, 10);
                                                onChange(isNaN(parsedValue) ? null : parsedValue);
                                            }}
                                            value={value !== null && value !== undefined ? String(value) : ''}
                                            keyboardType="numeric"
                                            style={formStyles.inputField} />
                                    )}
                                    name="recipe.serving_count" />
                            </View>

                            {/* duration */}
                            <View style={styles.fieldContainer}>
                                <ThemedText >Total duration </ThemedText>
                                <Controller
                                    control={methods.control}
                                    rules={{ required: false, }}
                                    defaultValue={0}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            onBlur={onBlur}
                                            onChangeText={(text) => {
                                                if (text === '') {
                                                    onChange(null);
                                                    return;
                                                }
                                                const parsedValue = parseInt(text, 10);
                                                onChange(isNaN(parsedValue) ? null : parsedValue);
                                            }}
                                            value={value !== null && value !== undefined ? String(value) : ''}
                                            keyboardType="numeric"
                                            style={formStyles.inputField}/>
                                    )}
                                    name="recipe.duration" />
                            </View>
                        </View>

                        {/* tags */}
                        <Collapsible title="Tags">
                            <View style={formStyles.fieldContainer}>
                                <FormListTags control={methods.control}/>
                            </View>
                        </Collapsible>

                        {/* Ingredients */}
                        <Collapsible title="Ingredients">
                            <FormListIngredients control={methods.control}/>
                        </Collapsible>

                        {/* Instrunctions */}
                        <Collapsible title="Instructions">
                            <FormListInstructions control={methods.control}/>
                        </Collapsible>
                        
                        {/* Notes */}
                        <Collapsible title="Notes">
                            <FormListNotes control={methods.control}/>
                        </Collapsible>
                        
                    </View>
                </FormProvider>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    viewTopBar: {
        marginHorizontal: Spacing.three,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#c19c36',
        paddingVertical: Spacing.two,
    
        zIndex: 999, // Guarantees it stays above scrolling content
        elevation: 5, // Android drop shadow for floating effect
    },

    scrollView: {
        flexGrow: 1,
    },

    formContainer: {
        flexDirection: "column",
        flexGrow: 1,
        gap: 5
    },
    fieldContainer: {
        gap: Spacing.one,
        paddingHorizontal: Spacing.five,
    },
});