import { FILTERS_QUERIES } from '@/database/queries/filters-queries';
import { Ingredient, Tag } from '@/types/recipe.types';
import { useSQLiteContext } from 'expo-sqlite';


export function useDatabaseFormValidation() {
    const db = useSQLiteContext();

    const validateTags = async (formTags: Tag[])  => {
        try {
            const result: Tag[] = await db.getAllAsync<Tag>(FILTERS_QUERIES.GET_ALL_TAGS);

            formTags.forEach(ft => {
                ft.name = ft.name.toLowerCase();
                
                const filteredTags = result.filter(e => e.name === ft.name);
                if(filteredTags.length > 0) {
                    ft.id = filteredTags[0].id
                }
            });
            
            /*formTags.map(e => {
                console.log("Valid tag = { id: " + e.id + ", name:" + e.name + " }");
            });*/
        } catch (error) {
            console.error("[form][db] Failed to validate form tags against the database :", error);
        }
    }

    const validateIngredients = async (formIngredients: Ingredient[])  => {
        try {
            const result: Ingredient[] = await db.getAllAsync<Ingredient>(FILTERS_QUERIES.GET_ALL_INGREDIENTS);

            formIngredients.forEach(fi => {
                fi.name = fi.name.toLowerCase();

                const filteredIngredients = result.filter(e => e.name === fi.name);
                if(filteredIngredients.length > 0) {
                    fi.id = filteredIngredients[0].id
                }
            });
            
            /*formIngredients.map(e => {
                console.log("Valid ingredient = { id: " + e.id + ", name:" + e.name + " }");
            });*/
        } catch (error) {
            console.error("[form][db] Failed to validate form ingredients against the database :", error);
        }
    }

    return { validateTags, validateIngredients };
}