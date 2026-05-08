import React from "react";
import { ViewStyle, StyleSheet, Pressable, StyleProp } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  interpolate,
  Easing
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { Surface } from "./Surface";

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
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
          borderRadius: radius.lg,
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
        onPressIn={() => {
          pressed.value = withTiming(1, { duration: 150, easing: Easing.bezier(0.4, 0, 0.2, 1) });
        }}
        onPressOut={() => {
          pressed.value = withTiming(0, { duration: 150, easing: Easing.bezier(0.4, 0, 0.2, 1) });
        }}
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
