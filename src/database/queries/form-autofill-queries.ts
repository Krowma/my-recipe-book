

export const AUTOFILL_QUERIES = {
    GET_ALL_INGREDIENTS: `
        SELECT * FROM ingredients ORDER BY name;
    `,

    GET_ALL_TAGS:`
        SELECT * FROM tags ORDER BY name;
    `
}