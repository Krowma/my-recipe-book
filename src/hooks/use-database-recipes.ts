import { RECIPE_INGREDIENT_QUERIES, RECIPE_INSTRUCTION_QUERIES, RECIPE_NOTE_QUERIES, RECIPE_TAG_QUERIES } from '@/database/queries/details-queries';
import { RECIPE_QUERIES } from '@/database/queries/recipe-queries';
import { useDatabaseFormValidation } from '@/hooks/use-database-form-validation';
import { Ingredient, Instruction, Note, Recipe, Tag } from '@/types/recipe.types';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

export function useDatabaseRecipes() {
    const db = useSQLiteContext();
    const { validateTags, validateIngredients } = useDatabaseFormValidation();
    
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
    const fetchRecipes = useCallback(async (filterFavorite: boolean, selectedTags : Tag[] = []) => {
        setIsLoading(true);
        try {
            const favoriteParam = filterFavorite ? 1 : null; 

            let result : Recipe[] = [];
            if (selectedTags.length === 0) {
                result = await db.getAllAsync<Recipe>(RECIPE_QUERIES.GET_ALL_RECIPES, [favoriteParam]); // TODO will want to fetch by batch of x recipe in the future to handle big db
                /*result.map(e => {
                    console.log("recipe = { name:" + e.name + ", serv:" + e.serving_count + ", duration:" + e.duration + " }");
                });*/
                
            } else {
                const sqlArgs: Record<string, any> = {
                    $favoriteFilter: favoriteParam,
                };
                selectedTags.forEach((tag, index) => { sqlArgs[`$tag${index}`] = tag.id; });

                const placeholders = selectedTags.map((_, index) => `$tag${index}`).join(', ');

                result = await db.getAllAsync<Recipe>(RECIPE_QUERIES.GET_RECIPES_WITH_TAGS(placeholders, selectedTags.length), sqlArgs);
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
     * Get a specific recipe from the database without the details.
     */
    const fetchRecipeShallow = useCallback(async (recipeId : string) => {
        setIsLoading(true);
        try {
            let result = await db.getFirstAsync<Recipe>(RECIPE_QUERIES.GET_RECIPE_BY_ID, [recipeId]);
            setRecipe(result);

            /*if(recipe)
                console.log("recipe = { name:" + recipe.name + ", serv:" + recipe.serving_count + ", duration:" + recipe.duration + ", is_cooking:" + recipe.is_cooking + " }");*/
        } catch (error) {
            console.error("[db] Failed to fetch recipe with details: ", error);
        } finally {
            setIsLoading(false);
        }
    }, [db]);

    /**
     * Get a specific recipe from the database with the associated details.
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
            /*if(recipeResult)
                console.log("recipe = { name:" + recipeResult.name + ", serv:" + recipeResult.serving_count + ", duration:" + recipeResult.duration + ", is_cooking:" + recipeResult.is_cooking + " }");*/

            setTags(tagsResult);
            /*tagsResult.map(e => {
                    console.log("tag = " + e.name);
            });*/

            setIngredients(ingredientsResult);
            /*ingredientsResult.map(e => {
                    console.log("ingredients = { name: " + e.name + ", quantity: " + e.quantity + ", unit: " + e.unit + " }");
            });*/

            setInstructions(instructionsResult);
            instructionsResult.map(e => {
                e.has_timer = Boolean(e.has_timer);
                //console.log("instructions = { step: " + e.step_number + ", desc: " + e.description + ", has_timer: " + e.has_timer + ", timer_duration: " + e.timer_duration + " }");
            });

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
                // Make sure ingredients and tags that already exist in the database use the correct id
                await validateTags(tags);
                await validateIngredients(ingredients);

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
     * update an existing recipe on the database with associated details (ingredients, instructions, ...).
     * Will delete the associated details and re-create them with their updated values
     */
    const updateRecipe = async (recipe: Recipe, tags: Tag[], ingredients: Ingredient[], instructions: Instruction[], notes: Note[]) => {
        try {
            await db.withTransactionAsync(async () => {
                // Make sure ingredients and tags that already exist in the database use the correct id
                await validateTags(tags);
                await validateIngredients(ingredients);
                
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

    /**
     * Flag an existing recipe on the database as 'Cooking'
     */
    const changeRecipeCooking = async (recipeId: string, newValue: boolean) => {
        try {
            await db.runAsync(RECIPE_QUERIES.UPDATE_COOKING_RECIPE, [Number(newValue), recipeId]);
            await fetchRecipeShallow(recipeId);
            //console.log("[db] Recipe " + recipeId + " is_cooking successfully changed to " + isCooking);
        } catch (error) {
            console.error('[db] Failed to change Recipe is_cooking.', error);
        }
    };

    /**
     * Flag an existing recipe on the database as 'Favorite'
     */
    const changeRecipeFavorite = async (recipeId: string, isFavorite: boolean) => {
        try {
            await db.runAsync(RECIPE_QUERIES.UPDATE_FAVORITE_RECIPE, [Number(isFavorite), recipeId]);
            await fetchRecipeShallow(recipeId);
            //console.log("[db] Recipe " + recipeId + " is_favorite successfully changed to " + isFavorite);
        } catch (error) {
            console.error('[db] Failed to change Recipe is_favorite.', error);
        }
    };

    return { recipes, recipe, tags, ingredients, instructions, notes, isLoading, fetchRecipes, fetchRecipeWithDetails, createRecipe, updateRecipe, deleteRecipe, changeRecipeCooking, changeRecipeFavorite };
}
