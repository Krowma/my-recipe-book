import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { FormListElement } from "@/components/ui/form-list";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Recipe } from "@/types/recipe.types";
import { SymbolView } from "expo-symbols";
import { Controller, FieldValues, Resolver, useForm } from "react-hook-form";
import { Button, Pressable, StyleSheet, TextInput } from 'react-native';


const resolver: Resolver<Recipe> = async (recipe) => {
  return {
    values: recipe.name ? recipe : {},
    errors: !recipe.name
      ? {
          name: {
            type: 'required',
            message: 'Required',
          },
        }
      : {},
  };
};


interface ViewRecipeFormProps {
    recipeToEdit?: Recipe; 
    closeCallback: () => void;
}

export function ViewRecipeForm({recipeToEdit, closeCallback} : ViewRecipeFormProps) {

    const { control, register, setValue, handleSubmit, watch, formState: { errors } } = useForm<Recipe>({ resolver, mode: "onBlur" });
    const theme = useTheme();
    
    if(!recipeToEdit)
    {
        //console.log("Empty recipe passed.");
    }

    const onSubmit = (data : FieldValues) => {
        console.log(data);
    } 

    return(
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
                            tintColor={theme.text}
                        />
                </Pressable> 
                <ThemedText type="subtitle">Your recipe</ThemedText> 
            </ThemedView>

            {/* name */}
            <ThemedView style={styles.formContainer}>
                
                <ThemedView style={styles.fieldContainer}>
                    <ThemedText>Name </ThemedText>
                    <Controller
                        control={control}
                        rules={{
                        required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                placeholder="Recipe name"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                style={styles.inputField}
                            />
                        )}
                        name="name"
                    />
                    {errors.name && <ThemedText type="small">This is required.</ThemedText>}
                </ThemedView>

                {/* servings */}
                <ThemedView style={styles.fieldContainer}>
                    <ThemedText>Number of servings </ThemedText>
                    <Controller
                        control={control}
                        rules={{
                        required: true,
                        }}
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
                                style={styles.inputField}
                            />
                        )}
                        name="servings"
                    />
                </ThemedView>

                {/* duration */}
                <ThemedView style={styles.fieldContainer}>
                    <ThemedText>Total duration </ThemedText>
                    <Controller
                        control={control}
                        rules={{
                        required: false,
                        }}
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
                                style={styles.inputField}
                            />
                        )}
                        name="duration"
                    />
                </ThemedView>
                
                <ThemedView style={styles.fieldContainer}>
                    {/*<FormListElement/>*/}
                    <FormListElement/>
                </ThemedView>
                

                <Button title="Submit" onPress={handleSubmit(onSubmit)} />
            </ThemedView>

        </ThemedView>
    );
}

const styles = StyleSheet.create({
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