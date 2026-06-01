

export type Unit = " " | "g" | "kg" | "ml" | "cups" | "ts";

export type Ingredient = {
    name: string;
    quantity: number;
    unit: Unit;
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