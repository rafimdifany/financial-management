import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  interpolate 
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";

interface Props {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const IconButton: React.FC<Props> = ({
  onPress,
  icon,
  size = 24,
  color,
  backgroundColor,
  style,
}) => {
  const { colors, radius } = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(pressed.value, [0, 1], [1, 0.92]) },
      ],
      opacity: interpolate(pressed.value, [0, 1], [1, 0.8]),
    };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => (pressed.value = withSpring(1))}
      onPressOut={() => (pressed.value = withSpring(0))}
      style={[
        styles.container,
        {
          width: size * 1.8,
          height: size * 1.8,
          borderRadius: radius.full,
          backgroundColor: backgroundColor || colors.surfaceContainerHigh,
        },
        animatedStyle,
        style,
      ]}
    >
      <Ionicons 
        name={icon} 
        size={size} 
        color={color || colors.onSurface} 
      />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
