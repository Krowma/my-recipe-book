import { backgroundColors, elementColors, iconSize } from "@/constants/styles";
import { Spacing } from "@/constants/theme";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { useState } from 'react';
import { ColorValue, Pressable, StyleSheet, View } from 'react-native';

export interface CircleMenuContent {
    items: CircleMenuItem[];
}

export interface CircleMenuItem {
    iconName: any;
    iconColor: ColorValue;
    callback: () => void;
}

export default function FloatingCircleMenu({ items }: CircleMenuContent) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View>
            {isOpen && 
                <View style={styles.menuContainer}>
                    {items.map((item, index) => (
                        <Pressable key={index} style={[styles.circleButton, styles.actionButton]} onPress={() => {item.callback; setIsOpen(false);}}>
                            <FontAwesomeFreeSolid name={ item.iconName } size={ iconSize.smaller } color={ item.iconColor } />
                        </Pressable>
                    ))}
                </View>
            }

            {/* Main Trigger Button */}
            <Pressable onPress={() => setIsOpen(!isOpen)}>
                <FontAwesomeFreeSolid name="add" size={ iconSize.default } color={ elementColors.black } />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    menuContainer: {
        position: 'absolute',
        top: 50,
        left: -15,
        alignItems: 'center',
        gap: Spacing.two,
    },
    circleButton: {
        width: 45,
        height: 45,
        margin: Spacing.two,
        borderRadius: 28, // Perfect bounding circle
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    actionButton: {
        backgroundColor: backgroundColors.orange, // Secondary menu option styling
    },
});