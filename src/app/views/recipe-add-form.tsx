import { ViewRecipeForm } from '@/app/views/view-recipe-form';
import { ThemedView } from '@/components/themed-view';
import { globalStyles } from '@/constants/styles';
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useDatabaseFormValidation } from '@/hooks/use-database-form-validation';
import { useDatabaseRecipes } from '@/hooks/use-database-recipes';
import { RecipeFormValues } from '@/types/recipe.types';
import { randomUUID } from 'expo-crypto';
import { useRouter } from 'expo-router';
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";



export default function AddRecipeScreen() {
    const router = useRouter();

    const { createRecipe } = useDatabaseRecipes();
    const { validateTags, validateIngredients } = useDatabaseFormValidation();
    
    /**
     * Platform safe area
     */
    const safeAreaInsets = useSafeAreaInsets();
    const insets = {
        ...safeAreaInsets,
        bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
    };
    
    const contentPlatformStyle = Platform.select({
        android: {
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: insets.bottom,
        },
        web: {
            paddingTop: Spacing.six,
            paddingBottom: Spacing.four,
        },
    });

    const handleCloseCallback = () => {
        router.navigate('/views/recipe-book'); // todo open recipe screen
        console.log(" RETURN BOOK");
    }

    const handleSubmitCallback = (data: RecipeFormValues) => {
        handleSubmitAsync(data);
    }

    const handleSubmitAsync = async (data: RecipeFormValues) => {
        data.recipe.id = randomUUID();
        // Make sure ingredients and tags that already exist in the database use the correct id
        await validateTags(data.tags);
        await validateIngredients(data.ingredients);

        await createRecipe(data.recipe, data.tags, data.ingredients, data.instructions, data.notes);
        router.navigate('/views/recipe-book');
        console.log(" RETURN BOOK");
    }

    return(
        <ThemedView style={[globalStyles.topLevelContainer, contentPlatformStyle]}>
            <ViewRecipeForm closeCallback={handleCloseCallback} submitCallback={handleSubmitCallback}/>
        </ThemedView>
    );
}