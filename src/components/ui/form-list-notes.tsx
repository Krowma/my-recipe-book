import { ThemedText } from "@/components/themed-text";
import { formStyles } from "@/constants/formStyle";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ingredient, Instruction, Note, Recipe, Tag } from "@/types/recipe.types";
import { randomUUID } from 'expo-crypto';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';


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
        <View style={formStyles.sectionContainer}> 
            {fields.map((field, index) => {
                return (
                    <View key={field.id} style={styles.listItemContainer}> 
                        <TouchableOpacity 
                            style={formStyles.deleteButton} 
                            onPress={() => remove(index)}>
                                <ThemedText type="smallBold">✕</ThemedText>
                        </TouchableOpacity>

                        {/* content */}
                        <View style={formStyles.fieldContainer}>
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
                        </View>
                    </View>
                );
            })}

            <View style={styles.rowContainer}>
                <TouchableOpacity 
                    style={formStyles.addButton} 
                    onPress={() => append({ id: randomUUID(),  content: "", created_at: "" })}>
                        <ThemedText type="smallBold">+</ThemedText>
                </TouchableOpacity>

                <ThemedText type="smallBold"> Add a note</ThemedText>
            </View>
            
        </View>
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
    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.two
    },

    largeTextInputField: {
        flex: 1,
        minHeight: 50,
        justifyContent: "flex-start",
        textAlignVertical: 'top',
        flexDirection: "row",
        minWidth: '85%'
    },
});