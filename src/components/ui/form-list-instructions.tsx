import { ThemedText } from "@/components/themed-text";
import { formStyles } from "@/constants/formStyle";
import { elementColors } from "@/constants/styles";
import { Spacing } from "@/constants/theme";
import { Ingredient, Instruction, Note, Recipe, Tag } from "@/types/recipe.types";
import { randomUUID } from 'expo-crypto';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';

interface RecipeFormValues {
    recipe: Recipe;
    tags: Tag[];
    ingredients: Ingredient[];
    instructions: Instruction[];
    notes: Note[];
}

interface InstructionsSectionProps {
    control: Control<RecipeFormValues>; 
}

export default function FormListInstructions({ control }: InstructionsSectionProps) {

     // Connect useFieldArray to the useForm control object
    const { fields, append, remove } = useFieldArray({
        control,
        name: "instructions",
    });

    return(
        <View style={formStyles.sectionContainer}>
            {fields.map((field, index) => {
                return (
                    <View key={field.id} style={ styles.listItemContainer }> 
                        <View style={styles.rowContainer}>
                            {/* Button to remove this specific object */}
                            <TouchableOpacity 
                                style={formStyles.deleteButton} 
                                onPress={() => remove(index)}>
                                    <ThemedText type="smallBold">✕</ThemedText>
                            </TouchableOpacity>

                            {/* step-number */}
                            <ThemedText type="smallBold">{index + 1}.</ThemedText>
                            
                            <View style={formStyles.fieldContainer}>
                                {/* description */}
                                <Controller
                                    name={`instructions.${index}.description` as const}
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            placeholder="Type your instructions here..."
                                            multiline={true}
                                            numberOfLines={3}
                                            textAlignVertical="top"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            style={styles.instructionInputField}
                                        />
                                    )}
                                />
                            </View>
                        </View>

                        {/* timer */}
                        <View style={styles.timerRowContainer}>
                            <ThemedText type="small">Timer </ThemedText>
                            <Controller
                                name={`instructions.${index}.has_timer` as const}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Switch
                                        trackColor={{ false: '#767577', true: elementColors.honey }}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={onChange}
                                        value={value} />
                                )} />

                            <Controller
                                name={`instructions.${index}.timer_duration` as const}
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder="minutes"
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
                    </View>
                );
            })}

            <View style={styles.rowContainer}>
                <TouchableOpacity 
                    style={formStyles.addButton} 
                    onPress={() => append({ id: randomUUID(),  step_number: fields.length + 1, description: "", has_timer: false, timer_duration: 0 })}>
                        <ThemedText type="smallBold">+</ThemedText>
                </TouchableOpacity>

                <ThemedText type="smallBold"> Add an instruction</ThemedText>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    listItemContainer: {
        flexDirection: 'column',
        gap: Spacing.one,
        paddingBottom: Spacing.two
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: Spacing.two,
        paddingHorizontal: Spacing.one,
    },
    timerRowContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: Spacing.two,
        paddingLeft: Spacing.six
    },
    instructionInputField: {
        flex: 1,
        paddingLeft: Spacing.two,
        minHeight: 50,
        minWidth: '75%',
        maxWidth: '80%',
        justifyContent: "flex-start",
        textAlignVertical: 'top',
        flexDirection: "row",
    },
});