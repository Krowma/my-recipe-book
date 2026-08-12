import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { ColorValue, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { iconSize } from '@/constants/styles';
import { Spacing } from '@/constants/theme';
import { scheduleOnRN } from "react-native-worklets";
import {
    SUBBTN_BACKGROUND_COLOR,
    SUBBTN_BORDER_RADIUS,
    SUBBTN_HEIGHT,
    SUBBTN_WIDTH,
} from '../../constants/floating-buton-constants';

export interface ButonContent {
    text: string;
    iconName: any;
    iconColor: ColorValue;
    callback: () => void;
}

export default function FloatingActionSubButton({ text, iconName, iconColor, callback }: ButonContent) {
    const tapGesture = Gesture.Tap()
            .onStart(() => {
                scheduleOnRN(callback);
            })

    return (
        <GestureDetector gesture={tapGesture}>
            <View style={styles.subButton}>
                <View style={styles.button}>
                    <FontAwesomeFreeSolid name={iconName} size={ iconSize.default } color={ iconColor } />
                </View>
            </View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    subButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: Spacing.two
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: SUBBTN_WIDTH,
        height: SUBBTN_HEIGHT,
        borderRadius: SUBBTN_BORDER_RADIUS,
        backgroundColor: SUBBTN_BACKGROUND_COLOR,
    },
    label: {
        color: 'rgb(9, 9, 9)',
        fontSize: 15,
    },
});