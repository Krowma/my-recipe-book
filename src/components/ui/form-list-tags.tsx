import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ingredient, Instruction, Note, Recipe, Tag } from "@/types/recipe.types";
import { randomUUID } from 'expo-crypto';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { Button, StyleSheet, TextInput } from 'react-native';


interface RecipeFormValues {
    recipe: Recipe;
    tags: Tag[];
    ingredients: Ingredient[];
    instructions: Instruction[];
    notes: Note[];
}

interface TagsSectionProps {
    control: Control<RecipeFormValues>; 
}

export default function FormListInstructions({ control }: TagsSectionProps) {

    const theme = useTheme();
    
     // Connect useFieldArray to the useForm control object
    const { fields, append, remove } = useFieldArray({
        control,
        name: "tags",
    });
    

    return(
        <ThemedView style={styles.sectionContainer}>
            <ThemedView style={styles.rowContainer}>
                <ThemedText>Tags</ThemedText>
                <Button title=" + " onPress={() => append({ id: randomUUID(),  name: "" })} />
            </ThemedView>
            
            {fields.map((field, index) => {
                return (
                    <ThemedView key={field.id} style={styles.elementContainer}> 
                        {/* name */}
                        <ThemedView style={styles.fieldContainer}>
                            <Controller
                                name={`tags.${index}.name` as const}
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

                        {/* Button to remove this specific object */}
                        <Button title="X" onPress={() => remove(index)} />
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
        flexDirection: 'row',
        alignItems: "center",
        gap: Spacing.two,
        paddingHorizontal: Spacing.one,
        borderBlockColor: "black"
    },
    inputField: {
        borderColor: "black",
        borderWidth: 1,
        paddingLeft: Spacing.two,
        paddingRight: Spacing.four
    },
});