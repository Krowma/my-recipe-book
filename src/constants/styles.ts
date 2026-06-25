import { BottomTabInset, Spacing } from "@/constants/theme";
import { StyleSheet } from 'react-native';

/* --- Color Schemes --- */
export const elementColors = {
    grey: 'rgb(9, 9, 9)',
    red: 'rgb(223, 46, 46)',
    blue: 'hsl(218, 68%, 48%)',
    honey: '#EC9706'
} as const;

export const backgroundColors = {
    topBar: "#fcd396",
    screen: '#faf0e6',
    listContent: '#ffffff',
} as const;

export const globalStyles = StyleSheet.create({
    /* --- Common containers --- */
    topLevelContainer: {
        flexDirection: "column",
        flexGrow: 1,
    },

    viewTitleContainer: {
        alignItems: 'center',
        paddingVertical: Spacing.two,
    },

    viewTopBar: {
        marginHorizontal: Spacing.three,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: backgroundColors.topBar,
        paddingVertical: Spacing.two,
    
        zIndex: 999, // Guarantees it stays above scrolling content
        elevation: 5, // Android drop shadow for floating effect
    },

    flatListContainer: {
        flexDirection: "column",
        flexGrow: 1,
        backgroundColor: backgroundColors.screen,
        paddingTop: Spacing.three,
        paddingHorizontal: Spacing.three,
    },

    flatListSafeArea: {
        paddingBottom: BottomTabInset + Spacing.two
    }
});



export const iconSize = { default: 30 } as const;