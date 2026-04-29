import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming 
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";

interface Props {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<Props> = ({ 
  progress, 
  color, 
  height = 8,
  style 
}) => {
  const { colors, radius } = useTheme();
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withSpring(Math.min(Math.max(progress, 0), 1), {
      damping: 20,
      stiffness: 90,
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value * 100}%`,
    };
  });

  return (
    <View 
      style={[
        styles.container, 
        { 
          height, 
          backgroundColor: colors.surfaceContainerHighest,
          borderRadius: height / 2,
        },
        style
      ]}
    >
      <Animated.View 
        style={[
          styles.fill, 
          { 
            backgroundColor: color || colors.primary,
            borderRadius: height / 2,
          },
          animatedStyle
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
