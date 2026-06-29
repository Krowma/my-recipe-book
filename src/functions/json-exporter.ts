import { Ingredient, Instruction, Note, Recipe, RecipeObject, Tag } from "@/types/recipe.types";
import { getDocumentAsync } from 'expo-document-picker';
import { Directory, EncodingType, File } from 'expo-file-system';


export async function eportToJsonFile(recipe: Recipe, tags: Tag[], ingredients: Ingredient[], instructions: Instruction[], notes: Note[], 
    successCallback: (message: any) => void, failureCallback: (message: any) => void) {

    try {
        const directory = await Directory.pickDirectoryAsync("Documents");
        const recipeObject: RecipeObject = {
            recipe: recipe,
            tags: tags,
            ingredients: ingredients,
            instructions: instructions,
            notes: notes
        }
        const jsonString = JSON.stringify(recipeObject, null, 2); 
        
        const file = directory.createFile(recipe.name + '.json', "application/json");
        file.write(jsonString, { encoding: EncodingType.UTF8, append: false });

        successCallback('JSON file successfully written to : ' + file.uri);
        
    } catch (error) {
        console.error('Failed to write JSON file:', error);
        failureCallback(error);
    }
};

export async function importFromJsonFile(successCallback: (recipeObj: RecipeObject) => void, failureCallback: (message: any) => void) {
    try {
        const pickerResult = await getDocumentAsync({ copyToCacheDirectory: true });
        if (!pickerResult.canceled) {
            const { uri } = pickerResult.assets[0];
            const file = new File(uri);
            const result = file.textSync();
            const parsedData = JSON.parse(result) as RecipeObject;

            console.log('JSON file successfully imported from :', file.uri);
            successCallback(parsedData);
            return;
        }

        failureCallback("Failed to open selected file.");

    } catch (error) {
        console.error('Failed to import JSON file:', error);
        failureCallback(error);
    }
};