import { Recipe } from "@/types/recipe.types";



export const RecipeChocolateCake : Recipe = {
    uniqueId: "MOCK_CHOCOCAKE",
    name: "Chocolate Cake",
    image: "none",
    tags: [
        "cake",
        "dessert",
        "mock"
    ],
    servings: 4,
    duration: 60,
    ingredients:[
        {
            name: "sugar",
            quantity : 2,
            unit: "cups"
        },
        {
            name: "all-puporsed flour",
            quantity : 1.75,
            unit: "cups"
        },
        {
            name: "baking powder",
            quantity : 1.5,
            unit: "ts"
        },
        {
            name: "large eggs",
            quantity : 2,
            unit: ""
        },
        {
            name: "vanilla extract",
            quantity : 2,
            unit: "ts"
        },

    ],
    instructions:[
        {
            description: "Gather all ingredients. Preheat the oven to 350 degrees F (175 degrees C). Grease and flour two 9-inch round baking pans.",
            hasTimer: false,
            timerDuration: 0
        },
        {
            description: "Stir sugar, flour, cocoa, baking powder, baking soda, and salt together in a large bowl.",
            hasTimer: false,
            timerDuration: 0
        },
        {
            description: "Add eggs, milk, oil and vanilla; mix for 2 minutes on medium speed with an electric mixer.",
            hasTimer: true,
            timerDuration: 2
        },
        {
            description: "Pour evenly into the prepared pans.",
            hasTimer: false,
            timerDuration: 0
        },
        {
            description: "Bake in the preheated oven until a toothpick inserted into the center comes out clean, about 30 to 35 minutes. Cool in the pans for 10 minutes, then transfer to a wire rack to cool completely.",
            hasTimer: true,
            timerDuration: 30
        }
    ],
    notes: "For brevity sake some ingredients and steps of this mock recipe have been removed from the original. Do not attempt this recipe at home."
} as const;

export const RecipePancake : Recipe = {
    uniqueId: "MOCK_PANCAKE",
    name: "Old Fashioned Pancakes",
    image: "none",
    tags: [
        "easy",
        "dessert",
        "mock"
    ],
    servings: 8,
    duration: 20,
    ingredients:[
        {
            name: "white sugar",
            quantity : 1,
            unit: "ts"
        },
        {
            name: "all-puporsed flour",
            quantity : 1.5,
            unit: "cups"
        },
        {
            name: "baking powder",
            quantity : 3.5,
            unit: "ts"
        },
        {
            name: "salt",
            quantity : 0.25,
            unit: "ts"
        },
        {
            name: "milk",
            quantity : 1.25,
            unit: "cups"
        },
        {
            name: "butter",
            quantity : 3,
            unit: "ts"
        },
        {
            name: "large egg",
            quantity : 1,
            unit: ""
        }
    ],
    instructions:[
        {
            description: "Sift flour, baking powder, sugar, and salt together in a large bowl. Make a well in the center and add milk, melted butter, and egg; mix until smooth.",
            hasTimer: false,
            timerDuration: 0
        },
        {
            description: "Heat a lightly oiled griddle or pan over medium-high heat. Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake; cook until bubbles form and the edges are dry, about 2 to 3 minutes.",
            hasTimer: true,
            timerDuration: 3
        },
        {
            description: "Flip and cook until browned on the other side. Repeat with remaining batter.",
            hasTimer: false,
            timerDuration: 0
        }
    ],
    notes: "For brevity sake some ingredients and steps of this mock recipe have been removed from the original. Do not attempt this recipe at home."
} as const;