import { RECIPE_QUERIES } from '@/database/queries/recipe-queries';
import { Recipe, Tag } from '@/types/recipe.types';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

export function useDatabaseRecipes() {
    const db = useSQLiteContext();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
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
