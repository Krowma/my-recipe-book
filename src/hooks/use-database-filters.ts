import { FILTERS_QUERIES } from '@/database/queries/filters-queries';
import { Tag } from '@/types/recipe.types';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

export function useDatabaseFilters() {
    const db = useSQLiteContext();
    const [suggestions, setSuggestions] = useState<Tag[]>([]);


    const fetchMatchingTags = useCallback(async (input: string) => {
        try {
            const result: Tag[] = await db.getAllAsync<Tag>(FILTERS_QUERIES.GET_TAG_SUGGESTIONS, { $search: `%${input}%` });
            const filtered = result.filter(item => !suggestions.includes(item));
            
            setSuggestions(filtered);
            /*filtered.map(e => {
                console.log("suggestion = { id: " + e.id + ", name:" + e.name + " }");
            });*/

        } catch (error) {
            console.error("[db] Failed to fetch matching tags for input :", error);
        }
    }, [db]);

    const clearSuggestions = () => {setSuggestions([])}

    return { suggestions, fetchMatchingTags, clearSuggestions };
}