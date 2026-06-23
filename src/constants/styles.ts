import { BottomTabInset, Spacing } from "@/constants/theme";
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    /* --- Common containers --- */
    topLevelContainer: {
        flexDirection: "column",
        flexGrow: 1,
        backgroundColor: "white",
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
        backgroundColor: '#c19c36',
        paddingVertical: Spacing.two,
    
        zIndex: 999, // Guarantees it stays above scrolling content
        elevation: 5, // Android drop shadow for floating effect
    },

    flatListContainer: {
        flexDirection: "column",
        flexGrow: 1,
        backgroundColor: "white",
        paddingTop: Spacing.three,
        paddingHorizontal: Spacing.three,
    },

    flatListSafeArea: {
        paddingBottom: BottomTabInset + Spacing.six
    }

    /* --- Common buttons --- */

});


export const iconColors = {
    grey: 'rgb(9, 9, 9)',
    red: 'rgb(223, 46, 46)',
    blue: 'hsl(218, 68%, 48%)'
} as const;

export const iconSize = { default: 30 } as const;