import { RECIPE_INGREDIENT_QUERIES, RECIPE_INSTRUCTION_QUERIES, RECIPE_NOTE_QUERIES, RECIPE_TAG_QUERIES } from '@/database/queries/details-queries';
import { RECIPE_QUERIES } from '@/database/queries/recipe-queries';
import { Ingredient, Instruction, Note, Recipe, Tag } from '@/types/recipe.types';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

export function useDatabaseRecipes() {
    const db = useSQLiteContext();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    
    const [recipe, setRecipe] = useState<Recipe | null>();
    const [tags, setTags] = useState<Tag[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [instructions, setInstructions] = useState<Instruction[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    /**
     * Get all the recipes from the database.
     */
    const fetchRecipes = useCallback(async (selectedTags : Tag[] = []) => {
        setIsLoading(true);
        try {
            let result : Recipe[] = [];
            if (selectedTags.length === 0) {
                result = await db.getAllAsync<Recipe>(RECIPE_QUERIES.GET_ALL_RECIPES); // TODO will want to fetch by batch of x recipe in the future to handle big db
                /*result.map(e => {
                    console.log("recipe = { name:" + e.name + ", serv:" + e.serving_count + ", duration:" + e.duration + " }");
                });*/
                
            } else {
                const placeholders = selectedTags.map(() => '?').join(', ');
                const slectedTagIds = selectedTags.map((t) => t.id);
                result = await db.getAllAsync<Recipe>(RECIPE_QUERIES.GET_RECIPES_WITH_TAGS(placeholders, selectedTags.length), slectedTagIds);
                /*result.map(e => {
                    console.log("recipe = { name:" + e.name + ", serv:" + e.serving_count + ", duration:" + e.duration + " }");
                });*/
            }
            
            setRecipes(result);
        } catch (error) {
            console.error("[db] Failed to fetch recipes", error);
        } finally {
            setIsLoading(false);
        }
    }, [db]);

    /**
     * Get a specific recipe from the database.
     */
    const fetchRecipeWithDetails = useCallback(async (recipeId : string) => {
        setIsLoading(true);
        try {
            // Run all queries simultaneously to reduce loading time
            const [recipeResult, tagsResult, ingredientsResult, instructionsResult, notesResult] = await Promise.all([
                db.getFirstAsync<Recipe>(RECIPE_QUERIES.GET_RECIPE_BY_ID, [recipeId]),
                db.getAllAsync<Tag>(RECIPE_TAG_QUERIES.GET_RECIPE_TAGS, [recipeId]),
                db.getAllAsync<Ingredient>(RECIPE_INGREDIENT_QUERIES.GET_RECIPE_INGREDIENTS, [recipeId]),
                db.getAllAsync<Instruction>(RECIPE_INSTRUCTION_QUERIES.GET_RECIPE_INSTRUCTIONS, [recipeId]),
                db.getAllAsync<Note>(RECIPE_NOTE_QUERIES.GET_RECIPE_NOTE, [recipeId])
            ]);

            setRecipe(recipeResult);

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
            console.error("[db] Failed to fetch recipe with details: ", error);
        } finally {
            setIsLoading(false);
        }
    }, [db]);


    /**
     * Create a new recipe on the database with associated details (ingredients, instructions, ...).
     */
    const createRecipe = async (recipe: Recipe, tags: Tag[], ingredients: Ingredient[], instructions: Instruction[], notes: Note[]) => {
        try {
            await db.withTransactionAsync(async () => {
                await db.runAsync(RECIPE_QUERIES.INSERT_RECIPE, 
                    [recipe.id, recipe.name, recipe.image, recipe.serving_count, recipe.duration]);

                await createTags(recipe.id, tags);
                await createIngredients(recipe.id, ingredients);
                await createInstructions(recipe.id, instructions);
                await createNotes(recipe.id, notes);
        });

            console.log("[db] New recipe " + recipe.name + " created successfully!");
        } catch (error) {
            console.error('[db] Create Recipe transaction failed. Database rolled back.', error);
        }
    };


    /**
     * Create a new recipe on the database with associated details (ingredients, instructions, ...).
     */
    const updateRecipe = async (recipe: Recipe, tags: Tag[], ingredients: Ingredient[], instructions: Instruction[], notes: Note[]) => {
        try {
            await db.withTransactionAsync(async () => {
            
                // 1. Update the main recipe
                const recipeResult = await db.runAsync(RECIPE_QUERIES.UPDATE_RECIPE, 
                    [recipe.name, recipe.image, recipe.serving_count, recipe.duration, recipe.id]);

                // 2. Delete associated details
                await db.runAsync(RECIPE_TAG_QUERIES.DELETE_RECIPE_TAGS, [recipe.id]);
                await db.runAsync(RECIPE_INGREDIENT_QUERIES.DELETE_RECIPE_INGREDIENTS, [recipe.id]);
                await db.runAsync(RECIPE_INSTRUCTION_QUERIES.DELETE_RECIPE_INSTRUCTIONS, [recipe.id]);
                await db.runAsync(RECIPE_NOTE_QUERIES.DELETE_RECIPE_NOTE, [recipe.id]);
                
                // 3. Create updated details
                await createTags(recipe.id, tags);
                await createIngredients(recipe.id, ingredients);
                await createInstructions(recipe.id, instructions);
                await createNotes(recipe.id, notes);
            });

            //console.log("[db] Recipe " + recipe.name + " updated successfully!");
        } catch (error) {
            console.error('[db] Recipe update transaction failed. Database rolled back.', error);
        }
    };


    /**
     * Delete a recipe from the database.
     * Will delete orphaned tags, ingredients and instructions.
     * Will automatically fetch the updated database
     * @param id recipe uniqueId
     */
    const deleteRecipe = async (id: string) => {
        try {
            await db.runAsync(RECIPE_QUERIES.DELETE_RECIPE, [id]);
            await fetchRecipes();
        } catch (error) {
            console.error("[db] Failed to delete recipe", error);
        }
    };


    const createTags = async (recipe_id: string, tags: Tag[]) => {
        for (const tag of tags) {
            await db.runAsync(RECIPE_TAG_QUERIES.INSERT_TAGS, [tag.id, tag.name]);
            await db.runAsync(RECIPE_TAG_QUERIES.INSERT_RECIPE_TAGS, [recipe_id, tag.id]);    
        }
    };

    const createIngredients = async (recipe_id: string, ingredients: Ingredient[]) => {
        for (const ingredient of ingredients) {
            await db.runAsync(RECIPE_INGREDIENT_QUERIES.INSERT_INGREDIENTS, [ingredient.id, ingredient.name]);
            await db.runAsync(RECIPE_INGREDIENT_QUERIES.INSERT_RECIPE_INGREDIENTS, [recipe_id, ingredient.id, ingredient.quantity, ingredient.unit]);    
        }
    };

    const createInstructions = async (recipe_id: string, instructions: Instruction[]) => {
        for (const instruction of instructions) {
            await db.runAsync(RECIPE_INSTRUCTION_QUERIES.INSERT_RECIPE_INSTRUCTIONS, 
                [instruction.id, instruction.step_number, instruction.description, instruction.has_timer, instruction.timer_duration, recipe_id]);
        }
    };

    const createNotes = async (recipe_id: string, notes: Note[]) => {
        for (const note of notes) {
            await db.runAsync(RECIPE_NOTE_QUERIES.INSERT_RECIPE_NOTE, [note.id, note.content, note.created_at, recipe_id]);
        }
    };

    return { recipes, recipe, tags, ingredients, instructions, notes, isLoading, fetchRecipes, fetchRecipeWithDetails, createRecipe, updateRecipe, deleteRecipe };
}
