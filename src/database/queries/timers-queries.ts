

export const TIMERS_QUERIES = {
    GET_ALL_TIMERS: `
        SELECT id, recipe_id, instruction_id, duration, started_at
            FROM timers
            ORDER BY recipe_id;
    `,

    GET_ALL_RECIPE_TIMERS: `
        SELECT id, instruction_id, duration, started_at 
            FROM timers 
            WHERE recipe_id = ?;
    `,

    GET_TIMER_INSTRUCTION: `
        SELECT id, step_number, description, timer_duration
            FROM instructions 
            WHERE id = ?;
    `,

    INSERT_TIMER:`
        INSERT INTO timers (id, recipe_id, instruction_id, duration, started_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(id) DO NOTHING;
    `,

    DELETE_TIMER:`
        DELETE 
            FROM timers 
            WHERE id = ?;
    `,
}