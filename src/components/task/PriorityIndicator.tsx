import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { TaskPriority } from '../../types/task';

interface PriorityIndicatorProps {
  priority: TaskPriority;
}

export const PriorityIndicator = ({ priority }: PriorityIndicatorProps) => {
  const { colors } = useTheme();

  const getPriorityColor = () => {
    switch (priority) {
      case 'low':
        return colors.onSurfaceVariant;
      case 'medium':
        return colors.tertiary;
      case 'high':
        return colors.error;
      default:
        return colors.onSurfaceVariant;
    }
  };

  return <View style={[styles.dot, { backgroundColor: getPriorityColor() }]} />;
};

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
