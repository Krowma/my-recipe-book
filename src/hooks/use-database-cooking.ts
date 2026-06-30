import { RECIPE_QUERIES } from '@/database/queries/recipe-queries';
import { Recipe } from '@/types/recipe.types';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';


export function useDatabaseCooking() {

    const db = useSQLiteContext();

    const [isLoading, setIsLoading] = useState(false);
    const [cookingRecipes, setcookingRecipes] = useState<Recipe[]>([]);

    /**
     * Get all the recipes from the database flaged as 'Cooking'.
     */
    const fetchCookingRecipes = useCallback(async () => {
        setIsLoading(true);
        try {
            let result = await db.getAllAsync<Recipe>(RECIPE_QUERIES.GET_ALL_COOKING_RECIPES);
            result.map(e => {
                console.log("recipe = { name:" + e.name + ", serv:" + e.serving_count + ", duration:" + e.duration + " }");
            });

            setcookingRecipes(result);
        } catch (error) {
            console.error("[db] Failed to fetch recipes", error);
        } finally {
            setIsLoading(false);
        }
    }, [db]);

    return { isLoading, cookingRecipes, fetchCookingRecipes };
}