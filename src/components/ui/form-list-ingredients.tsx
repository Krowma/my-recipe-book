import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ingredient, Instruction, Note, Recipe, Tag } from '@/types/recipe.types';
import { randomUUID } from 'expo-crypto';
import { Control, Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Button, StyleSheet, TextInput } from 'react-native';


interface RecipeFormValues {
    recipe: Recipe;
    tags: Tag[];
    ingredients: Ingredient[];
    instructions: Instruction[];
    notes: Note[];
}

interface IngredientsSectionProps {
    control: Control<RecipeFormValues>; 
}

export default function FormListIngredients({ control }: IngredientsSectionProps) {

    const theme = useTheme();

    const { formState: { errors } } = useFormContext<RecipeFormValues>();

    // Connect useFieldArray to the useForm control object
    const { fields, append, remove } = useFieldArray({
        control,
        name: "ingredients",
    });


    return(
        <ThemedView style={styles.sectionContainer}>
            <ThemedView style={styles.rowContainer}>
                <ThemedText>Ingredients</ThemedText>
                <Button title=" + " onPress={() => append({ id: randomUUID(),  name: "", quantity: 1, unit:"" })} />
            </ThemedView>
            
            {fields.map((field, index) => {
                return (
                    <ThemedView key={field.id} style={styles.elementContainer}> 
                        {/* Button to remove this specific object */}
                        <Button title="X" onPress={() => remove(index)} />

                        {/* name */}
                        <ThemedView style={styles.fieldContainer}>
                            <Controller
                                name={`ingredients.${index}.name` as const}
                                control={control}
                                rules={{
                                required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder="Name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        style={styles.inputField} />
                                )} />
                        </ThemedView>
                        
                        {/* quantity */}
                        <ThemedView style={styles.fieldContainer}>
                            <Controller
                                name={`ingredients.${index}.quantity` as const}
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder="Amount"
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
                                )} />
                        </ThemedView>

                        {/* unit */}
                        <ThemedView style={styles.fieldContainer}>
                            <Controller
                                name={`ingredients.${index}.unit` as const}
                                control={control}
                                rules={{
                                required: false,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder="Unit"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        style={styles.inputField} />
                                )} />
                        </ThemedView>
                    </ThemedView>
                );
            })}
            
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        flexDirection: "column",
        flexGrow: 1,
        backgroundColor: "white",
        gap: 5
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: Spacing.two,
        paddingHorizontal: Spacing.one,
    },
    elementContainer: {
        flexDirection: 'row',
    },
    fieldContainer: {
        paddingHorizontal: Spacing.one,
    },
    inputField: {
        borderColor: "black",
        borderWidth: 1,
        paddingLeft: Spacing.two,
        paddingRight: Spacing.four
    },
});