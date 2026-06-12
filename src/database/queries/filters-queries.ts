

export const FILTERS_QUERIES = {
    GET_ALL_TAGS: `
        SELECT id, name 
            FROM tags 
            ORDER BY name;
    `,

    GET_TAG_SUGGESTIONS: `
        SELECT id, name 
            FROM tags 
            WHERE name LIKE $search 
            LIMIT 5;
    `,

    GET_ALL_INGREDIENTS: `
        SELECT id, name
            FROM ingredients
            ORDER BY name;
    `
}