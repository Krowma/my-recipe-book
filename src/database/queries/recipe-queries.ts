

export const RECIPE_QUERIES = {
    GET_ALL_RECIPES: `
        SELECT id, name, image, serving_count, duration 
            FROM recipes 
            ORDER BY name;
    `,

    DELETE_RECIPE:`
        DELETE 
            FROM recipes 
            WHERE uniqueId = ?;
    `,

    INSERT_RECIPE:`
        INSERT INTO recipes (id, name, image, serving_count, duration)
            VALUES (?, ?, ?, ?, ?);
    `
}