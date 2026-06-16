

export const RECIPE_QUERIES = {
    GET_ALL_RECIPES: `
        SELECT id, name, image, serving_count, duration 
            FROM recipes 
            ORDER BY name;
    `,

    GET_RECIPES_WITH_TAGS: (placeholders: string, tagCount: number) =>`
        SELECT r.id, r.name, r.image, r.serving_count, r.duration 
            FROM recipes r
            JOIN recipe_tags rt ON rt.recipe_id = r.id
            JOIN tags t ON rt.tag_id = t.id
            WHERE t.id IN (${placeholders})
            GROUP BY r.id
            HAVING COUNT(DISTINCT t.id) = ${tagCount};
    `,

    DELETE_RECIPE:`
        DELETE 
            FROM recipes 
            WHERE id = ?;
    `,

    INSERT_RECIPE:`
        INSERT INTO recipes (id, name, image, serving_count, duration)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(id)
            DO UPDATE SET 
                name = excluded.name,
                image = excluded.image,
                serving_count = excluded.serving_count,
                duration = excluded.duration;
    `,

    UPDATE_RECIPE:`
        UPDATE recipes 
        SET name = ?, image = ?, serving_count = ?, duration = ?
        WHERE id = ?;
    `
}