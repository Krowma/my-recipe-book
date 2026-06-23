import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import FormListIngredients from "@/components/ui/form-list-ingredients";
import FormListInstructions from "@/components/ui/form-list-instructions";
import FormListNotes from "@/components/ui/form-list-notes";
import FormListTags from "@/components/ui/form-list-tags";
import { globalStyles, iconColors, iconSize } from "@/constants/styles";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ingredient, Instruction, Note, Recipe, RecipeFormValues, Tag } from "@/types/recipe.types";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { Controller, FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';


interface ViewRecipeFormProps {
    inRecipe?: Recipe; 
    inTags?: Tag[];
    inIngredients?: Ingredient[];
    inInstructions?: Instruction[];
    inNotes?: Note[];
    closeCallback: () => void;
    submitCallback: (data: RecipeFormValues) => void;
}

export function ViewRecipeForm({inRecipe, inTags, inIngredients, inInstructions, inNotes, closeCallback, submitCallback} : ViewRecipeFormProps) {
    
    const theme = useTheme();

    /**
     * React Hook Form
     */
    const methods = useForm<RecipeFormValues>({ 
        mode: "onBlur",
        defaultValues: {
            recipe: inRecipe,
            tags: inTags,
            ingredients: inIngredients,
            instructions: inInstructions,
            notes: inNotes,
        }
    });

    const onSubmit: SubmitHandler<RecipeFormValues> = (data) => {
        //console.log("Recipe form submit successfully : ", JSON.stringify(data, null, 2));
        submitCallback(data);
        closeCallback();
    } 

    const onSubmitFail: SubmitErrorHandler<RecipeFormValues> = (errors) => {
        console.log("Recipe form submit failed : ", JSON.stringify(errors, null, 2));
    } 

    return(
        <ThemedView style={globalStyles.topLevelContainer}>
            <ThemedView style={ globalStyles.viewTitleContainer }>
                <ThemedText type="subtitle">Edit your Recipe</ThemedText>
            </ThemedView>

            <ThemedView style={styles.viewTopBar}>
                <Pressable onPress={() => closeCallback()}>
                    <FontAwesomeFreeSolid name="chevron-circle-left" size={ iconSize.default } color={ iconColors.grey } />
                </Pressable> 

                <Pressable onPress={methods.handleSubmit(onSubmit, onSubmitFail)}>
                    <FontAwesomeFreeSolid name="check-circle" size={ iconSize.default } color={ iconColors.blue } />
                </Pressable> 
            </ThemedView>

            <ScrollView 
                style={ globalStyles.flatListContainer } 
                contentContainerStyle={ [styles.scrollView, {paddingBottom: 300}] } >

                <FormProvider {...methods} >
                    <ThemedView>
                        {/* name */}
                        <ThemedView style={styles.formContainer}>
                            <ThemedView style={styles.fieldContainer}>
                                <ThemedText type="small">Name </ThemedText>
                                <Controller
                                    control={methods.control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            placeholder="Recipe name"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            style={styles.inputField} />
                                    )}
                                    name="recipe.name" />
                            </ThemedView>

                            {/* tags */}
                            <ThemedView style={styles.fieldContainer}>
                                <FormListTags control={methods.control}/>
                            </ThemedView>

                            {/* servings */}
                            <ThemedView style={styles.fieldContainer}>
                                <ThemedText type="small">Number of servings </ThemedText>
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
                                            style={styles.inputField} />
                                    )}
                                    name="recipe.serving_count" />
                            </ThemedView>

                            {/* duration */}
                            <ThemedView style={styles.fieldContainer}>
                                <ThemedText type="small">Total duration </ThemedText>
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
                                            style={styles.inputField}/>
                                    )}
                                    name="recipe.duration" />
                            </ThemedView>
                            
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
                            

                        </ThemedView>
                    </ThemedView>
                </FormProvider>
            </ScrollView>
        </ThemedView>
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
        flexDirection: 'row',
        alignItems: "center",
        gap: Spacing.two,
        paddingHorizontal: Spacing.five,
        borderBlockColor: "black"
    },
    inputField: {
        borderColor: "black",
        borderWidth: 1,
        paddingLeft: Spacing.two,
        paddingRight: Spacing.four
    },
});