import { ThemedText } from "@/components/themed-text";
import { formStyles } from "@/constants/formStyle";
import { Spacing } from "@/constants/theme";
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

interface TagsSectionProps {
    control: Control<RecipeFormValues>; 
}

export default function FormListInstructions({ control }: TagsSectionProps) {

     // Connect useFieldArray to the useForm control object
    const { fields, append, remove } = useFieldArray({
        control,
        name: "tags",
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
                        {/* name */}
                        <View style={formStyles.fieldContainer}>
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
                                        style={formStyles.inputField} />
                                )} />
                        </View>
                    </View>
                );
            })}

            <View style={styles.rowContainer}>
                <TouchableOpacity 
                    style={formStyles.addButton} 
                    onPress={() => append({ id: randomUUID(),  name: "" })}>
                        <ThemedText type="smallBold">+</ThemedText>
                </TouchableOpacity>

                <ThemedText type="smallBold"> Add a tag</ThemedText>
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