import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import FormListIngredients from "@/components/ui/form-list-ingredients";
import FormListInstructions from "@/components/ui/form-list-instructions";
import FormListNotes from "@/components/ui/form-list-notes";
import FormListTags from "@/components/ui/form-list-tags";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Recipe, RecipeFormValues } from "@/types/recipe.types";
import { randomUUID } from "expo-crypto";
import { SymbolView } from "expo-symbols";
import { Controller, FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { Button, Platform, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";


interface ViewRecipeFormProps {
    recipeToEdit?: Recipe; 
    closeCallback: () => void;
    submitCallback: (data: RecipeFormValues) => void;
}

export function ViewRecipeForm({recipeToEdit, closeCallback, submitCallback} : ViewRecipeFormProps) {
    
    const theme = useTheme();

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
    const methods = useForm<RecipeFormValues>({ 
        mode: "onBlur",
        defaultValues: {
        }
    });
    
    
    if(!recipeToEdit)
    {
        //console.log("Empty recipe passed.");
    }

    const onSubmit: SubmitHandler<RecipeFormValues> = (data) => {
        data.recipe.id = randomUUID();
        console.log("Recipe form submit successfully : ", JSON.stringify(data, null, 2));
        submitCallback(data);
    } 

    const onSubmitFail: SubmitErrorHandler<RecipeFormValues> = (errors) => {
        console.log("Recipe form submit failed : ", JSON.stringify(errors, null, 2));
        //submitCallback(data);
    } 

    return(
        <ScrollView
              style={[styles.scrollView, { backgroundColor: theme.background }]}
              contentInset={insets}
              contentContainerStyle={[styles.container, contentPlatformStyle]}>
            
            <FormProvider {...methods} >
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
                                    tintColor={theme.text} />
                        </Pressable> 
                        <ThemedText type="subtitle">Your recipe</ThemedText> 
                    </ThemedView>

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
                        <ThemedView style={styles.fieldContainer}>
                            <FormListIngredients control={methods.control}/>
                        </ThemedView>

                        {/* Instrunctions */}
                        <ThemedView style={styles.fieldContainer}>
                            <FormListInstructions control={methods.control}/>
                        </ThemedView>
                        
                        {/* Notes */}
                        <ThemedView style={styles.fieldContainer}>
                            <FormListNotes control={methods.control}/>
                        </ThemedView>

                        <Button title="Submit" onPress={methods.handleSubmit(onSubmit, onSubmitFail)} />
                    </ThemedView>
                </ThemedView>
            </FormProvider>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
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

    pressed: {
        opacity: 0.7,
    },
});