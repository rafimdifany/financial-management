import React from "react";
import { Pressable, StyleSheet, ViewStyle, ActivityIndicator, View } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  interpolate 
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "./Text";

type ButtonVariant = "primary" | "secondary" | "ghost" | "error";

interface Props {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<Props> = ({
  onPress,
  title,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}) => {
  const { colors, spacing, radius, isDark } = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(pressed.value, [0, 1], [1, 0.96]) },
      ],
      opacity: interpolate(pressed.value, [0, 1], [1, 0.9]),
    };
  });

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          colors: isDark ? [colors.primary, colors.primaryContainer] : [colors.primary, colors.primaryContainer],
          text: colors.onPrimary,
        };
      case "secondary":
        return {
          backgroundColor: colors.secondaryContainer,
          text: colors.onSecondary,
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
          fontWeight: variant === "ghost" ? "700" : "500"
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
      onPressIn={() => (pressed.value = withSpring(1))}
      onPressOut={() => (pressed.value = withSpring(0))}
      style={[
        styles.container,
        {
          borderRadius: radius.md,
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
              borderRadius: radius.md,
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
