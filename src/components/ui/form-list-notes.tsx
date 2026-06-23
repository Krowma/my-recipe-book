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

interface NotesSectionProps {
    control: Control<RecipeFormValues>; 
}

export default function FormListNotes({ control }: NotesSectionProps) {

    const theme = useTheme();
    
     // Connect useFieldArray to the useForm control object
    const { fields, append, remove } = useFieldArray({
        control,
        name: "notes",
    });
    

    return(
        <ThemedView style={styles.sectionContainer}>
            <ThemedView style={styles.rowContainer}>
                <ThemedText>Notes</ThemedText>
                <Button title=" + " onPress={() => append({ id: randomUUID(),  content: "", created_at: "" })} />
            </ThemedView>
            
            {fields.map((field, index) => {
                return (
                    <ThemedView key={field.id} style={styles.elementContainer}> 
                        {/* content */}
                        <ThemedView style={styles.fieldContainer}>
                            <Controller
                                name={`notes.${index}.content` as const}
                                control={control}
                                rules={{
                                required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder="Type your note here..."
                                        multiline={true}
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        style={styles.largeTextInputField} />
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
        gap: Spacing.one
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: Spacing.two,
        paddingHorizontal: Spacing.one,
    },
    elementContainer: {
        flexDirection: 'row',
        alignItems: "center",
    },
    fieldContainer: {
        gap: Spacing.two,
        paddingHorizontal: Spacing.one,
        borderBlockColor: "black",
        flex: 1,
    },
    largeTextInputField: {
        flex: 1,
        borderWidth: 1,
        paddingLeft: Spacing.two,
        minHeight: 50,
        justifyContent: "flex-start",
        textAlignVertical: 'top',
        flexDirection: "row"
    },
});