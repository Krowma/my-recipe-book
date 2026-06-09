import { Ingredient, Instruction } from '@/types/recipe.types';
import { faker } from '@faker-js/faker';
import * as SQLite from 'expo-sqlite';

export async function seedFakeUsers(count: number = 5) {
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
            'INSERT INTO recipes (uniqueId, name, image, tags, servings, duration, ingredients, instructions, notes) VALUES ($uniqueId, $name, $image, $tags, $servings, $duration, $ingredients, $instructions, $notes)'
        );

        try {
            for (let i = 0; i < count; i++) {
                await statement.executeAsync({
                    $uniqueId: faker.string.uuid(),
                    $name: faker.food.dish(),
                    $image: faker.internet.url().toLowerCase(),
                    $tags: generateTags(faker.number.int({min:0, max:5})),
                    $servings: faker.number.int({min:1, max:20}),
                    $duration: faker.number.int({min:15, max:360}),
                    $ingredients: generateIngredients(faker.number.int({min:3, max:10})),
                    $instructions: generateInstructions(faker.number.int({min:3, max:10})),
                    $notes: faker.lorem.sentences({min:1, max:5}),
                });
            }
        } finally {
            await statement.finalizeAsync();
        }
    });

    console.log('[mock] Database seeding successfully finished!');
}


const tagOptions = ["dessert", "simple", "complex", "lunch", "vegan", "fresh"];
function generateTags(count: number = 5) : string {
    let mockTags: string[] = [];
    
    for (let i = 0; i < count; i++)
    {
        mockTags.push(faker.helpers.arrayElement(tagOptions));
    }

    return JSON.stringify(mockTags, null, 2);
}

const ingredientUnitOptions = ["", "g", "kg", "ml", "cups", "ts"];
function generateIngredients(count: number = 5) : string {
    let mockIngredients: Ingredient[] = [];
    
    for (let i = 0; i < count; i++)
    {
        const ingredient: Ingredient = {
            name: faker.food.ingredient(),
            quantity: faker.number.int({min:1, max:150}),
            unit: faker.helpers.arrayElement(ingredientUnitOptions)
        };

        mockIngredients.push(ingredient);
    }

    return JSON.stringify(mockIngredients, null, 2);
}

function generateInstructions(count: number = 5) : string {
    let mockInstructions: Instruction[] = [];
    
    for (let i = 0; i < count; i++)
    {
        const instruction: Instruction = {
            description: faker.string.uuid(),
            hasTimer: faker.datatype.boolean(),
            timerDuration: faker.number.int({min:1, max:30})
        };

        mockInstructions.push(instruction);
    }

    return JSON.stringify(mockInstructions, null, 2);
}