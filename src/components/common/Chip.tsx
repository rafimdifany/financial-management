import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from '../../constants/typography';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const Chip = ({ label, selected, onPress, style }: ChipProps) => {
  const { colors, radius } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: selected ? colors.primary : colors.surfaceContainerHigh,
          borderRadius: radius.md,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: selected ? colors.onPrimary : colors.onSurfaceVariant,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.medium,
  },
});
