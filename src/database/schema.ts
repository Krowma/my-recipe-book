


export const RECIPE_SCHEMA = `
    PRAGMA journal_mode = WAL;    
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS recipes (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        image TEXT,
        serving_count INTEGER,
        duration INTEGER,
        is_cooking INTEGER DEFAULT 0,
        is_favorite INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS recipe_tags (
        recipe_id TEXT NOT NULL,
        tag_id TEXT NOT NULL,
        PRIMARY KEY (recipe_id, tag_id),
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ingredients (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS recipe_ingredients (
        recipe_id TEXT NOT NULL,
        ingredient_id TEXT NOT NULL,
        quantity REAL,
        unit TEXT,
        PRIMARY KEY (recipe_id, ingredient_id),
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS instructions (
        id TEXT PRIMARY KEY NOT NULL,
        step_number INTEGER NOT NULL,
        description TEXT NOT NULL,
        has_timer BOOLEAN DEFAULT FALSE NOT NULL,
        timer_duration INTEGER,
        recipe_id TEXT NOT NULL,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL, 
        recipe_id TEXT NOT NULL,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS timers (
        id TEXT PRIMARY KEY NOT NULL,
        recipe_id TEXT NOT NULL,
        instruction_id TEXT NOT NULL,
        duration INTEGER  NOT NULL,
        started_at TEXT DEFAULT (datetime('now')), 
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        FOREIGN KEY (instruction_id) REFERENCES instructions(id) ON DELETE CASCADE
    );
`;