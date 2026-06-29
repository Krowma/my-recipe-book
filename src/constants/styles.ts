import { BottomTabInset, Spacing } from "@/constants/theme";
import { StyleSheet } from 'react-native';

/* --- Color Schemes --- */
export const elementColors = {
    black: 'rgb(9, 9, 9)',
    grey: "#D3D3D3",
    red: 'rgb(223, 46, 46)',
    blue: 'hsl(218, 68%, 48%)',
    honey: '#EC9706'
} as const;

export const backgroundColors = {
    orange: "#fcd396",
    lightOrange: '#faf0e6',
    white: '#ffffff',
} as const;

export const globalStyles = StyleSheet.create({
    /* --- Common containers --- */
    topLevelContainer: {
        flexDirection: "column",
        flexGrow: 1,
        backgroundColor: backgroundColors.lightOrange
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
        backgroundColor: backgroundColors.orange,
        paddingVertical: Spacing.two,
    
        zIndex: 999, // Guarantees it stays above scrolling content
        elevation: 5, // Android drop shadow for floating effect
    },

    flatListContainer: {
        flexDirection: "column",
        flexGrow: 1,
        backgroundColor: backgroundColors.lightOrange,
        paddingTop: Spacing.three,
        paddingHorizontal: Spacing.three,
    },

    flatListSafeArea: {
        paddingBottom: BottomTabInset + Spacing.two
    }
});



export const iconSize = { 
    default: 30,
    smaller: 20
} as const;