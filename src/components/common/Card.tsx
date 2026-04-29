import React from "react";
import { ViewStyle, StyleSheet, Pressable } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  interpolate 
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { Surface } from "./Surface";

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  level?: 1 | 2 | 3 | 4;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<Props> = ({ 
  children, 
  onPress, 
  style, 
  level = 3 
}) => {
  const { spacing, radius } = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(pressed.value, [0, 1], [1, 0.98]) },
      ],
    };
  });

  const content = (
    <Surface
      level={level}
      style={[
        styles.card,
        {
          padding: spacing.xl,
          borderRadius: radius.xl,
        },
        style,
      ]}
    >
      {children}
    </Surface>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => (pressed.value = withSpring(1))}
        onPressOut={() => (pressed.value = withSpring(0))}
        style={animatedStyle}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
});
