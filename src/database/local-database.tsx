import { RawRecipeRow, Recipe } from '@/types/recipe.types';
import { SQLiteDatabase, SQLiteRunResult } from 'expo-sqlite';


export async function initializeDatabase(db: SQLiteDatabase) 
{
    const DATABASE_VERSION = 1;

    const fetchResult = await db.getFirstAsync<{user_version: number}>('PRAGMA user_version;'); // fetch db metadata (PRAGMA) user_version
    let currentDbVersion = fetchResult?.user_version ?? 0;

    if (currentDbVersion >= DATABASE_VERSION) {
        return; // up to date : no migration needed
    }

    // first initialization : create tables
    if (currentDbVersion === 0) {
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS recipes (
                uniqueId TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                image TEXT,
                tags TEXT,
                servings INTEGER,
                duration INTEGER,
                ingredients TEXT,
                instructions TEXT,
                notes TEXT,
                completed INTEGER DEFAULT 0
            );
        `);
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
}

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