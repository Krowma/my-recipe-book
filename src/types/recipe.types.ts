

export type Unit = "" | "g" | "kg" | "ml" | "cups" | "ts";

export type Ingredient = {
    name: string;
    quantity: number;
    unit: string;
}

export type Instruction = {
    description: string;
    hasTimer: boolean;
    timerDuration: number;
}

export type Recipe = {
    uniqueId: string;
    name: string;
    image: string;
    tags: string[];
    servings: number;
    duration: number;
    ingredients: Ingredient[];
    instructions: Instruction[];
    notes: string;
}

// Represents how data is stored in the database
export type RawRecipeRow = {
    uniqueId: string;
    name: string;
    image: string;
    tags: string;
    servings: number;
    duration: number;
    ingredients: string;
    instructions: string;
    notes: string;
}