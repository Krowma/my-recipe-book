import { RECIPE_QUERIES } from '@/database/queries/recipe-queries';
import { RawRecipeRow, Recipe } from '@/types/recipe.types';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

export function useDatabaseRecipes() {
    const db = useSQLiteContext();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Get all the recipes from the database.
     */
    const fetchRecipes = useCallback(async (selectedTags : string[] = []) => {
        setIsLoading(true);
        try {
            let result : RawRecipeRow[] = [];
            if (selectedTags.length === 0) {
                result = await db.getAllAsync<RawRecipeRow>(RECIPE_QUERIES.GET_ALL_RECIPES); // TODO will want to fetch by batch of x recipe in the future to handle big db
            } else {
                // TODO Multi-tag filter query
            }

            let recipes = result.map(row => ({
                ...row,
                tags: row.tags ? JSON.parse(row.tags) : [], // Safe fallback to empty array
                ingredients: row.ingredients? JSON.parse(row.ingredients) : [],
                instructions: row.instructions? JSON.parse(row.instructions) : []
            }));

            setRecipes(recipes);
        } catch (error) {
            console.error("[db] Failed to fetch recipes", error);
        } finally {
            setIsLoading(false);
        }
    }, [db]);


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

    return { recipes, isLoading, fetchRecipes, deleteRecipe };
}
