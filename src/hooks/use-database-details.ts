import { RECIPE_INGREDIENT_QUERIES, RECIPE_INSTRUCTION_QUERIES, RECIPE_NOTE_QUERIES, RECIPE_TAG_QUERIES } from '@/database/queries/details-queries';
import { Ingredient, Instruction, Note, Tag } from '@/types/recipe.types';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';


export function useDatabaseDetails() {
    const db = useSQLiteContext();

    const [tags, setTags] = useState<Tag[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [instructions, setInstructions] = useState<Instruction[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);

    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const fetchDetails = useCallback(async (recipeId: string) => {
        setIsLoadingDetails(true);
        try {
            // Run all queries simultaneously to reduce loading time
            const [tagsResult, ingredientsResult, instructionsResult, notesResult] = await Promise.all([
                db.getAllAsync<Tag>(RECIPE_TAG_QUERIES.GET_RECIPE_TAGS, [recipeId]),
                db.getAllAsync<Ingredient>(RECIPE_INGREDIENT_QUERIES.GET_RECIPE_INGREDIENTS, [recipeId]),
                db.getAllAsync<Instruction>(RECIPE_INSTRUCTION_QUERIES.GET_RECIPE_INSTRUCTIONS, [recipeId]),
                db.getAllAsync<Note>(RECIPE_NOTE_QUERIES.GET_RECIPE_NOTE, [recipeId])
            ]);

            setTags(tagsResult);
            /*tagsResult.map(e => {
                    console.log("tag = " + e.name);
            });*/

            setIngredients(ingredientsResult);
            /*ingredientsResult.map(e => {
                    console.log("ingredients = { name: " + e.name + ", quantity: " + e.quantity + ", unit: " + e.unit + " }");
            });*/

            setInstructions(instructionsResult);
            /*instructionsResult.map(e => {
                    console.log("instructions = { step: " + e.step_number + ", desc: " + e.description + ", has_timer: " + e.has_timer + ", timer_duration: " + e.timer_duration + " }");
            });*/

            setNotes(notesResult);
            /*notesResult.map(e => {
                    console.log("notes = { created_at: " + e.created_at + ", content: " + e.content + " }");
            });*/

        } catch (error) {
            console.error("[db] Failed to fetch deep recipe details:", error);
        } finally {
            setIsLoadingDetails(false);
        }
    }, [db]);

    return { tags, ingredients, instructions, notes, isLoadingDetails, fetchDetails };
}
