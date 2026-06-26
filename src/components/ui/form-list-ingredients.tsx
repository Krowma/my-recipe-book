import { ThemedText } from "@/components/themed-text";
import { formStyles } from "@/constants/formStyle";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ingredient, Instruction, Note, Recipe, Tag } from '@/types/recipe.types';
import { randomUUID } from "expo-crypto";
import { Control, Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';


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
        <View style={formStyles.sectionContainer}>
            {fields.map((field, index) => {
                return (
                    <View key={field.id} style={styles.listItemContainer}> 
                        {/* Button to remove this specific object */}
                        <TouchableOpacity 
                            style={formStyles.deleteButton} 
                            onPress={() => remove(index)}>
                                <ThemedText type="smallBold">✕</ThemedText>
                        </TouchableOpacity>

                        {/* name */}
                        <View style={formStyles.fieldContainer}>
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
                                        style={formStyles.inputField} />
                                )} />
                        </View>
                        
                        {/* quantity */}
                        <View style={formStyles.fieldContainer}>
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
                                        style={formStyles.inputField} />
                                )} />
                        </View>

                        {/* unit */}
                        <View style={formStyles.fieldContainer}>
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
                                        style={formStyles.inputField} />
                                )} />
                        </View>
                    </View>
                );
            })}
            
            <View style={styles.rowContainer}>
                <TouchableOpacity 
                    style={formStyles.addButton} 
                    onPress={() => append({ id: randomUUID(),  name: "", quantity: 1, unit:"" })}>
                        <ThemedText type="smallBold">+</ThemedText>
                </TouchableOpacity>

                <ThemedText type="smallBold"> Add an ingredient</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.two
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: Spacing.two,
        paddingHorizontal: Spacing.one,
    },
});