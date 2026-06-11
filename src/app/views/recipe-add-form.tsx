import { ViewRecipeForm } from '@/app/views/view-recipe-form';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";



export default function AddRecipeScreen() {

    const theme = useTheme();
    
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
        // TODO redirect to recipe book
        console.log("TODO redirect to recipe book !")
    }

    return(
        <ThemedView style={[styles.container, contentPlatformStyle]}>
            <ViewRecipeForm closeCallback={handleCloseCallback}/>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        flexGrow: 1,
    },
});