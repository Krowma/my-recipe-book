

export const RECIPE_QUERIES = {
    GET_ALL_RECIPES: `
        SELECT * FROM recipes ORDER BY name;
    `,

    DELETE_RECIPE:`
        DELETE FROM recipes WHERE uniqueId = ?;
    `,

    INSERT_RECIPE:`
    
    `
}