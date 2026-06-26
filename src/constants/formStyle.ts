import { backgroundColors, elementColors } from '@/constants/styles';
import { Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';


export const formStyles = StyleSheet.create({
    sectionContainer: {
        flexDirection: "column",
        flexGrow: 1,
        gap: Spacing.two,
        backgroundColor: backgroundColors.white,
        borderRadius: 20,
        paddingVertical: Spacing.two,
    },
    fieldContainer: {
        backgroundColor: backgroundColors.lightOrange,
        borderRadius: 10,
        flexShrink: 1,
    },
    inputField: {
        paddingLeft: Spacing.two,
        paddingRight: Spacing.four,
        backgroundColor: backgroundColors.lightOrange,
        borderRadius: 10
    },
    
    deleteButton: {
        backgroundColor: '#ff4d4d',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Spacing.two
    },

    addButton: {
        backgroundColor: elementColors.honey,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Spacing.two
    },
});