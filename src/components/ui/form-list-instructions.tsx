import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ingredient, Instruction, Note, Recipe, Tag } from "@/types/recipe.types";
import { randomUUID } from 'expo-crypto';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { Button, StyleSheet, Switch, TextInput } from 'react-native';

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

    const theme = useTheme();
    
     // Connect useFieldArray to the useForm control object
    const { fields, append, remove } = useFieldArray({
        control,
        name: "instructions",
    });

    return(
        <ThemedView style={styles.sectionContainer}>
            <ThemedView style={styles.rowContainer}>
                <ThemedText>Instructions</ThemedText>
                <Button title=" + " onPress={() => append({ id: randomUUID(),  step_number: fields.length + 1, description: "", has_timer: false, timer_duration: 0 })} />
            </ThemedView>
            
            {fields.map((field, index) => {
                /*const hasTimer = useWatch({
                    control,
                    name: `instructions.${index}.has_timer`,
                });*/
                return (
                    <ThemedView key={field.id} style={styles.elementContainer}> 
                        <ThemedView style={styles.rowContainer}>
                            {/* Button to remove this specific object */}
                            <Button title="X" onPress={() => remove(index)} />

                            {/* step-number */}
                            <ThemedText type="smallBold">{index + 1}.</ThemedText>
                            
                            <ThemedView style={styles.fieldContainer}>
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
                            </ThemedView>
                        </ThemedView>

                        {/* timer */}
                        <ThemedView style={styles.rowContainer}>
                            <ThemedText type="small">Add timer </ThemedText>
                            <Controller
                                name={`instructions.${index}.has_timer` as const}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Switch
                                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={onChange}
                                        value={value} />
                                )} />

                            { /*hasTimer &&*/ <Controller
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
                                        style={styles.inputField} />
                                )} /> }
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
        gap: Spacing.two
    },
    elementContainer: {
        flexDirection: 'column',
        gap: Spacing.one,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: Spacing.two,
        paddingHorizontal: Spacing.one,
    },
    fieldContainer: {
        gap: Spacing.two,
        paddingHorizontal: Spacing.one,
        borderBlockColor: "black",
        flex: 1,
    },

    timerfieldContainer: {
        paddingHorizontal: Spacing.six,
    },

    inputField: {
        borderColor: "black",
        borderWidth: 1,
        paddingLeft: Spacing.two,
        paddingRight: Spacing.four,
    },
    instructionInputField: {
        flex: 1,
        borderWidth: 1,
        paddingLeft: Spacing.two,
        minHeight: 50,
        justifyContent: "flex-start",
        textAlignVertical: 'top',
        flexDirection: "row"
    },
});