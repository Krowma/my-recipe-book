import FloatingActionSubButton, { ButonContent } from '@/components/FAB/floating-action-subbutton';
import {
    FAB_BACKGROUND_COLOR,
    FAB_BORDER_RADIUS,
    FAB_CHILDREN_OPACITY_CLOSE,
    FAB_CHILDREN_OPACITY_OPEN,
    FAB_HEIGHT,
    FAB_MARGIN_HORIZONTAL,
    FAB_MARGIN_VERTICAL,
    FAB_ROTATION_CLOSE,
    FAB_ROTATION_OPEN,
    FAB_WIDTH,
    SUBBTN_HEIGHT
} from '@/constants/floating-buton-constants';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

export interface MenuContent {
    items: ButonContent[];
}


export default function FloatingActionMenu({ items }: MenuContent) {
    const [isOpen, setIsOpen] = useState(false);
    
    const open = () => { setIsOpen(true); }
    const close = () => { setIsOpen(false); }
    
    /* --- Safe Area --- */
    const { width, height } = useWindowDimensions();
    const safeAreaInsets = useSafeAreaInsets();

    const FAB_REST_POSITION_RIGHT = width - (safeAreaInsets.right + FAB_WIDTH + FAB_MARGIN_HORIZONTAL);
    const FAB_REST_POSITION_LEFT = safeAreaInsets.left +  FAB_MARGIN_HORIZONTAL;
    const FAB_REST_POSITION_BOTTOM = height - (safeAreaInsets.top + safeAreaInsets.bottom + BottomTabInset + FAB_WIDTH + FAB_MARGIN_VERTICAL);

    const FAB_SUBBTN_OFFSET = FAB_HEIGHT + SUBBTN_HEIGHT + Spacing.three;


    /* --- ReAnimated shared values and animated styles --- */
    const fabPositionX = useSharedValue(FAB_REST_POSITION_RIGHT);
    const fabPositionY = useSharedValue(FAB_REST_POSITION_BOTTOM);
    const fabRotation = useSharedValue(FAB_ROTATION_CLOSE);

    const childrenOpacity = useSharedValue(FAB_CHILDREN_OPACITY_CLOSE);

    const animatedRootStyles = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: fabPositionX.value },
                { translateY: fabPositionY.value },
            ],
        };
    });

    const animatedFABStyles = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${fabRotation.value}deg` }],
        };
    });

    const animatedChildrenStyles = useAnimatedStyle(() => {
        return {
            opacity: childrenOpacity.value,
        };
    });


    /* --- Gesture management : Pan and Tap --- */
    let startX = useSharedValue(0);
    let startY = useSharedValue(0);
    
    const panGesture = Gesture.Pan()
        .onStart(() => {
            startX.value = fabPositionX.value;
            startY.value = fabPositionY.value;
        })
        .onUpdate((event) => {
            fabPositionX.value = startX.value + event.translationX;
            fabPositionY.value = startY.value + event.translationY;
        })
        .onEnd(() => {
            if (fabPositionX.value > width / 2) {
                fabPositionX.value = withSpring(FAB_REST_POSITION_RIGHT);
            } else {
                fabPositionX.value = withSpring(FAB_REST_POSITION_LEFT);
            }
            fabPositionY.value = withSpring(FAB_REST_POSITION_BOTTOM);
        });
    
    const tapGesture = Gesture.Tap()
        .onEnd(() => {
            if(isOpen) {
                childrenOpacity.value = withTiming(FAB_CHILDREN_OPACITY_CLOSE, { duration: 300 });
                fabRotation.value = withSpring(FAB_ROTATION_CLOSE);
                setTimeout(() => {
                    scheduleOnRN(close);
                }, 300);
            } 
            else {
                scheduleOnRN(open);
                childrenOpacity.value = withTiming(FAB_CHILDREN_OPACITY_OPEN, { duration: 300 });
                fabRotation.value = withSpring(FAB_ROTATION_OPEN);
            }
        });

    return (
        <View>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.rootStyles, animatedRootStyles]}>
                    {isOpen && (
                        <Animated.View style={[styles.childrenStyles, animatedChildrenStyles, {top: -FAB_SUBBTN_OFFSET}]}>
                            {items.map((item, index) => (
                                <FloatingActionSubButton key={index} text={ item.text } iconName={ item.iconName } iconColor={ item.iconColor } callback={ item.callback }/>
                            ))}
                        </Animated.View>
                    )}

                    <GestureDetector gesture={tapGesture}>
                        <Animated.View style={[styles.fabButtonStyles, animatedFABStyles]}>
                            <Text style={styles.plus}>+</Text>
                        </Animated.View>
                    </GestureDetector>
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    rootStyles: {
        borderRadius: FAB_BORDER_RADIUS,
        position: 'absolute',
    },
    fabButtonStyles: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: FAB_BACKGROUND_COLOR,
        width: FAB_WIDTH,
        height: FAB_HEIGHT,
        borderRadius: FAB_BORDER_RADIUS,
    },
    childrenStyles: {
        position: 'absolute',
        alignItems: 'center',
        gap: Spacing.two,
    },
    plus: {
        fontSize: 36,
        color: '#EFFBFA',
    },
});