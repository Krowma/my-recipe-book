import { iconSize } from "@/constants/styles";
import FontAwesomeFreeSolid from "@react-native-vector-icons/fontawesome-free-solid";
import { useRef } from "react";
import { Animated, ColorValue, Pressable, StyleSheet } from "react-native";

interface LikeButtonParameters{
    enabledIcon: any;
    disabledIcon: any;

    enabledColor: ColorValue;
    disabledColor: ColorValue;

    isEnabled: number;
    callback: () => void;
}

export default function AnimatedToggleButton({ enabledIcon, disabledIcon, enabledColor, disabledColor, isEnabled, callback } : LikeButtonParameters) {
  
  // Use useRef to persist the animated value across renders
  const scale = useRef(new Animated.Value(1)).current;

  const toggle = () => {
    callback();
    
    // Scale animation triggers only for this specific button instance
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.8, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1.2, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Pressable onPress={toggle}>
        <Animated.View style={{ transform: [{ scale }] }}>
            <FontAwesomeFreeSolid name={ isEnabled === 1 ? enabledIcon : disabledIcon } size={ iconSize.default } color={ isEnabled ? enabledColor : disabledColor } />
        </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { },
});