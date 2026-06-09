import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ingredient, Recipe } from '@/types/recipe.types';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button, StyleSheet, TextInput } from 'react-native';


type FormIngredients = {
    ingredients: Ingredient[];
}

export function FormListElement() {

    const theme = useTheme();

    // Initialize useForm with default values
    const { control, register, handleSubmit, formState: { errors } } = useForm<FormIngredients>({ 
        mode: "onBlur",
        defaultValues:{
            ingredients: []
        } 
    });
    
     // Connect useFieldArray to the useForm control object
    const { fields, append, remove } = useFieldArray({
        control,
        name: "ingredients",
    });

    const onSubmit = (data : Recipe) => {
        console.log("Form Submitted Data:", data);
    };


    return(
        <ThemedView style={styles.listContainer}>
            {fields.map((field, index) => {
                return (
                    <ThemedView key={field.id} style={styles.elementContainer}> 
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
                                        style={styles.inputField}
                                    />
                                )}
                            />
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
                                        style={styles.inputField}
                                    />
                                )}
                            />
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
                                        style={styles.inputField}
                                    />
                                )}
                            />
                        </ThemedView>

                        {/* Button to remove this specific object */}
                        <Button title="X" onPress={() => remove(index)} />
                    </ThemedView>
                );
            })}

            <Button title="Add" onPress={() => append({ name: "", quantity: 1, unit:"" })} />
            
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        flexDirection: "column",
        flexGrow: 1,
        backgroundColor: "white",
        gap: 5
    },
    elementContainer: {
        flexDirection: 'row',

    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: Spacing.two,
        paddingHorizontal: Spacing.one,
        borderBlockColor: "black"
    },
    pickerContainer: {
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