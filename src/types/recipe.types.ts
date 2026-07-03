

export type Recipe = {
    id: string;
    name: string;
    image: string;
    serving_count: number;
    duration: number;
    is_cooking: number;
    is_favorite: number;
}

export type Tag = {
    id: string;
    name: string;
}

export type Unit = "" | "g" | "kg" | "ml" | "cups" | "ts";

export type Ingredient = {
    id: string;
    name: string;
    quantity: number;
    unit: string;
}

export type Instruction = {
    id: string;
    step_number: number;
    description: string;
    has_timer: boolean;
    timer_duration: number;
}

export type Note = {
    id: string;
    content: string;
    created_at: string;
}

export type Timer = {
    id: string;
    recipe_id: string;
    instruction_id: string;
    started_at: string;
    duration: number;
    notif_id: string;
}

export interface RecipeObject {
    recipe: Recipe;
    tags: Tag[];
    ingredients: Ingredient[];
    instructions: Instruction[];
    notes: Note[];
}