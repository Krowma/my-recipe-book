import { faker } from '@faker-js/faker';
import * as SQLite from 'expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';


const tagOptions = ["dessert", "simple", "complex", "lunch", "vegan", "fresh"];
const imageOptions = [
    "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=700,636",
    "https://www.inspiredtaste.net/wp-content/uploads/2024/07/French-Toast-Recipe-3.jpg",
    "https://www.theendlessmeal.com/wp-content/uploads/2019/03/Coq-au-Vin-Recipe-3.jpg"
];

export async function seedFakeData(count: number = 5) {
    const db = await SQLite.openDatabaseAsync('recipebook.db', { useNewConnection: true });
    
    // Check if data already exists to avoid duplicate seeding
    const existingRows = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM recipes;');
    if (existingRows && existingRows.count > 0) {
        console.log('[mock] Database already has data. Skipping seed.');
        return;
    }

    console.log(`[mock] Seeding ${count} fake recipes...`);

    await db.withTransactionAsync(async () => {
        const statement = await db.prepareAsync(
            'INSERT INTO recipes (id, name, image, serving_count, duration, is_cooking, is_favorite) VALUES ($id, $name, $image, $serving_count, $duration, $is_cooking, $is_favorite)'
        );

        const statement_tags = await db.prepareAsync(
            'INSERT INTO tags (id, name) VALUES ($id, $name)'
        );

        const statement_ingredients = await db.prepareAsync(
            'INSERT INTO ingredients (id, name) VALUES ($id, $name)'
        );

        try {
            // Generate tags
            let tagIds: string[] = [];
            for (let i = 0; i < tagOptions.length; i++) {
                const tag_id = faker.string.uuid();
                tagIds.push(tag_id);
                
                await statement_tags.executeAsync({
                    $id: tag_id,
                    $name: tagOptions[i],
                });
            }

            // Generate ingredients
            const ingredientNames = faker.helpers.uniqueArray(faker.food.ingredient, 15);
            let ingredientIds: string[] = [];
            for (let i = 0; i < ingredientNames.length; i++) {
                const ingredient_id = faker.string.uuid();
                ingredientIds.push(ingredient_id);
                
                await statement_ingredients.executeAsync({
                    $id: ingredient_id,
                    $name: ingredientNames[i],
                });
            }
            
            // Generate recipes and bind data across tables 
            for (let i = 0; i < count; i++) {
                let recipe_id = faker.string.uuid();
                
                await statement.executeAsync({
                    $id: recipe_id,
                    $name: faker.food.dish(),
                    $image: imageOptions[faker.number.int({min:0, max: imageOptions.length - 1})],
                    $serving_count: faker.number.int({min:1, max:20}),
                    $duration: faker.number.int({min:15, max:360}),
                    $is_cooking: false,
                    $is_favorite: false
                });
                
                await generateTags(db, recipe_id, tagIds, faker.number.int({min:1, max: tagIds.length}));
                await generateIngredients(db, recipe_id, ingredientIds, faker.number.int({min:1, max: ingredientIds.length}));
                await generateInstructions(db, recipe_id, faker.number.int({min:1, max:10}));
                await generateNotes(db, recipe_id, faker.number.int({min:0, max:3}))
            }

        } catch(e){
            console.error('[mock] failed to seed database with error: '+ e);

        } finally {
            await statement.finalizeAsync();
            await statement_tags.finalizeAsync();
            await statement_ingredients.finalizeAsync();

            console.log('[mock] Database seeding successfully finished!');
        }
    });
}



async function generateTags(db: SQLiteDatabase, recipe_id: string, tagIds: string[], count: number) {
    const statement_recipe_tags = await db.prepareAsync(
        'INSERT INTO recipe_tags (recipe_id, tag_id) VALUES ($recipe_id, $tag_id)'
    );

    try {
        const recipe_tags = faker.helpers.uniqueArray(tagIds, count);
        for (let i = 0; i < count; i++) {
            await statement_recipe_tags.executeAsync({
                $recipe_id: recipe_id,
                $tag_id: recipe_tags[i],
            });
        }
    } finally {
        
        await statement_recipe_tags.finalizeAsync();
    }
}

const ingredientUnitOptions = ["", "g", "kg", "ml", "cups", "ts"];
async function generateIngredients(db: SQLiteDatabase, recipe_id: string, ingredientIds: string[], count: number) {
    const statement_recipe_ingredients = await db.prepareAsync(
        'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES ($recipe_id, $ingredient_id, $quantity, $unit)'
    );

    try {
        const recipe_ingredients = faker.helpers.uniqueArray(ingredientIds, count);
        for (let i = 0; i < count; i++) {
            await statement_recipe_ingredients.executeAsync({
                $recipe_id: recipe_id,
                $ingredient_id: recipe_ingredients[i],
                $quantity: faker.number.int({min:1, max:150}), 
                $unit: faker.helpers.arrayElement(ingredientUnitOptions),
            });
        }
    } finally {
        
        await statement_recipe_ingredients.finalizeAsync();
    }
}

async function generateInstructions(db: SQLiteDatabase, recipe_id: string, count: number) {
    const statement_instrunctions = await db.prepareAsync(
        'INSERT INTO instructions (id, step_number, description, has_timer, timer_duration, recipe_id) VALUES ($id, $step_number, $description, $has_timer, $timer_duration, $recipe_id)'
    );

    try {
        for (let i = 0; i < count; i++) {
            await statement_instrunctions.executeAsync({
                $id: faker.string.uuid(),
                $step_number: i+1,
                $description: faker.lorem.sentence({min:3, max:10}),
                $has_timer: faker.datatype.boolean(),
                $timer_duration: faker.number.int({min:1, max:120}),
                $recipe_id: recipe_id,
            });
        }
    } finally {
        await statement_instrunctions.finalizeAsync();
    }
}

async function generateNotes(db: SQLiteDatabase, recipe_id: string, count: number) {
    const statement_notes = await db.prepareAsync(
        'INSERT INTO notes (id, content, created_at, recipe_id) VALUES ($id, $content, $created_at, $recipe_id)'
    );

    try {
        for (let i = 0; i < count; i++) {
            await statement_notes.executeAsync({
                $id: faker.string.uuid(),
                $content: faker.lorem.sentences({min:1, max:5}),
                $created_at: faker.date.recent().toISOString(),
                $recipe_id: recipe_id,
            });
        }
    } finally {
        await statement_notes.finalizeAsync();
    }
}