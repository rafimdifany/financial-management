import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { TaskStatus } from '../../types/task';
import { Typography } from '../../constants/typography';

interface StatusBadgeProps {
  status: TaskStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { colors, radius, spacing } = useTheme();

  const getStatusStyles = () => {
    switch (status) {
      case 'todo':
        return {
          color: colors.onSurfaceVariant,
          backgroundColor: colors.surfaceContainerHigh,
          label: 'Todo',
        };
      case 'in_progress':
        return {
          color: colors.tertiary,
          backgroundColor: `${colors.tertiaryContainer}33`, // 20% opacity is 0x33
          label: 'In Progress',
        };
      case 'done':
        return {
          color: colors.secondary,
          backgroundColor: `${colors.secondaryContainer}33`, // 20% opacity is 0x33
          label: 'Done',
        };
      default:
        return {
          color: colors.onSurfaceVariant,
          backgroundColor: colors.surfaceContainerHigh,
          label: status,
        };
    }
  };

  const { color, backgroundColor, label } = getStatusStyles();

  return (
    <View style={[styles.container, { backgroundColor, borderRadius: radius.md }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontFamily: Typography.fontFamily.medium,
    textTransform: 'capitalize',
  },
});
