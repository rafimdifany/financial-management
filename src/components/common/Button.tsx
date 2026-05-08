import React from "react";
import { Pressable, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, View } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  interpolate 
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "./Text";
import { Easing } from "react-native-reanimated";

type ButtonVariant = "primary" | "secondary" | "ghost" | "error";

interface Props {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<Props> = ({
  onPress,
  title,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { colors, spacing, radius, isDark } = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(pressed.value, [0, 1], [1, 0.98]) },
      ],
      opacity: interpolate(pressed.value, [0, 1], [1, 0.95]),
    };
  });

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          colors: [colors.primary, colors.primaryContainer],
          text: colors.onPrimary,
        };
      case "secondary":
        return {
          backgroundColor: colors.surfaceContainerHigh,
          text: colors.onSurface,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          text: colors.primary,
          fontWeight: "bold" as const,
        };
      case "error":
        return {
          backgroundColor: colors.error,
          text: colors.onError,
        };
      default:
        return {
          backgroundColor: colors.primary,
          text: colors.onPrimary,
        };
    }
  };

  const variantStyles = getVariantStyles();

  const renderContent = () => (
    loading ? (
      <ActivityIndicator color={variantStyles.text} size="small" />
    ) : (
      <Text
        variant="labelLg"
        style={{ 
          color: variantStyles.text, 
          textAlign: "center",
          fontWeight: variant === "ghost" ? "700" : "500",
          ...textStyle,
        }}
      >
        {title}
      </Text>
    )
  );

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 150, easing: Easing.bezier(0.4, 0, 0.2, 1) });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 150, easing: Easing.bezier(0.4, 0, 0.2, 1) });
      }}
      style={[
        styles.container,
        {
          borderRadius: radius.sm,
          opacity: disabled ? 0.5 : 1,
        },
        variant !== "primary" && { backgroundColor: variantStyles.backgroundColor },
        animatedStyle,
        style,
      ]}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={variantStyles.colors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            { 
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.xl,
              borderRadius: radius.sm,
            }
          ]}
        >
          {renderContent()}
        </LinearGradient>
      ) : (
        <View style={{ 
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          width: "100%",
          alignItems: "center" 
        }}>
          {renderContent()}
        </View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  gradient: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
