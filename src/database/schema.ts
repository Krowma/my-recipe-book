


export const RECIPE_SCHEMA = `
    PRAGMA foreign_keys = ON;
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
`;