

export const RECIPE_TAG_QUERIES = {
    GET_RECIPE_TAGS: `
        SELECT t.id, t.name 
            FROM recipe_tags rt
            JOIN tags t ON rt.tag_id = t.id
            WHERE rt.recipe_id = ?;
    `,

    INSERT_RECIPE_TAGS: `
        INSERT INTO recipe_tags (recipe_id, tag_id)
            VALUES (?, ?);
    `,

    INSERT_TAGS: `
        INSERT INTO tags (id, name) 
            VALUES (?, ?)
            ON CONFLICT(id) DO NOTHING;
    `,

    DELETE_RECIPE_TAGS: `
        DELETE 
            FROM recipe_tags
            WHERE recipe_id = ?;
    `,
}

export const RECIPE_INGREDIENT_QUERIES = {
    GET_RECIPE_INGREDIENTS: `
        SELECT i.id, i.name, ri.quantity, ri.unit 
            FROM recipe_ingredients ri
            JOIN ingredients i ON ri.ingredient_id = i.id
            WHERE ri.recipe_id = ?;
    `,

    INSERT_RECIPE_INGREDIENTS: `
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
            VALUES (?, ?, ?, ?);
    `,

    INSERT_INGREDIENTS: `
        INSERT INTO ingredients (id, name) 
            VALUES (?, ?)
            ON CONFLICT(id) DO NOTHING;
    `,

    DELETE_RECIPE_INGREDIENTS:`
        DELETE 
            FROM recipe_ingredients
            WHERE recipe_id = ?;
    `,
}

export const RECIPE_INSTRUCTION_QUERIES = {
    GET_RECIPE_INSTRUCTIONS: `
        SELECT id, step_number, description, has_timer, timer_duration 
            FROM instructions 
            WHERE recipe_id = ?
            ORDER BY step_number;
    `,

    INSERT_RECIPE_INSTRUCTIONS: `
        INSERT INTO instructions (id, step_number, description, has_timer, timer_duration, recipe_id)
            VALUES (?, ?, ?, ?, ?, ?);
    `,

    DELETE_RECIPE_INSTRUCTIONS: `
        DELETE 
            FROM instructions 
            WHERE recipe_id = ?;
    `,
}

export const RECIPE_NOTE_QUERIES = {
    GET_RECIPE_NOTE: `
        SELECT id, content, created_at
            FROM notes 
            WHERE recipe_id = ?;
            ORDER BY created_at;
    `,

    INSERT_RECIPE_NOTE: `
        INSERT INTO notes (id, content, created_at, recipe_id)
            VALUES (?, ?, ?, ?);
    `,

    DELETE_RECIPE_NOTE: `
        DELETE 
            FROM notes
            where recipe_id = ?;
    `,
}