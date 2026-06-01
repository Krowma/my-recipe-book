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
    servings: 24,
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
            unit: " "
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