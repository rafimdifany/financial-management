import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  TextInputProps, 
  StyleSheet, 
  ViewStyle 
} from "react-native";
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "./Text";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<Props> = ({
  label,
  error,
  containerStyle,
  onFocus,
  onBlur,
  style,
  ...props
}) => {
  const { colors, spacing, radius, isDark, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = withTiming(isFocused ? 1 : 0, { duration: 200 });

  const inputContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isFocused 
        ? (isDark ? colors.surfaceContainerHigh : colors.surfaceContainerLowest)
        : (isDark ? colors.surfaceContainerLowest : colors.surfaceContainerHigh),
      borderWidth: 1,
      borderColor: isFocused ? colors.primary : "transparent",
    };
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, { marginBottom: spacing.base }, containerStyle]}>
      {label && (
        <Text variant="labelMd" style={[styles.label, { color: colors.onSurfaceVariant }]}>
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderRadius: radius.md,
            paddingHorizontal: spacing.base,
          },
          inputContainerStyle,
        ]}
      >
        <TextInput
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.outline}
          style={[
            styles.input,
            {
              color: colors.onSurface,
              paddingVertical: spacing.md,
              ...typography.bodyMd,
            },
            style,
          ]}
          {...props}
        />
      </Animated.View>
      {error && (
        <Text variant="labelSm" style={[styles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginBottom: 6,
    textTransform: "uppercase",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
  },
  error: {
    marginTop: 4,
  },
});
