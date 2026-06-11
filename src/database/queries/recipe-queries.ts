import { RawRecipeRow, Recipe } from "@/types/recipe.types";
import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite";




export async function localFetchAllRecipe(db: SQLiteDatabase): Promise<Recipe[]> {
    const rows = await db.getAllAsync<RawRecipeRow>('SELECT * FROM recipes ORDER BY name;');

    return rows.map(row => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : [], // Safe fallback to empty array
        ingredients: row.ingredients? JSON.parse(row.ingredients) : [],
        instructions: row.instructions? JSON.parse(row.instructions) : []
    }));
}

export async function localDeleteRecipe(db: SQLiteDatabase, id: string): Promise<SQLiteRunResult> {
    return db.runAsync('DELETE FROM recipes WHERE uniqueId = ?', [id])
}