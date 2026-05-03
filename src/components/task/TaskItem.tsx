import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated as RNAnimated } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { useTheme } from '../../context/ThemeContext';
import { Task } from '../../types/task';
import { Typography } from '../../constants/typography';
import { StatusBadge } from './StatusBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
  onAdvance: () => void;
  onDelete: () => void;
}

export const TaskItem = ({ task, onPress, onAdvance, onDelete }: TaskItemProps) => {
  const { colors, spacing, radius } = useTheme();

  const renderLeftActions = (
    _progress: RNAnimated.AnimatedInterpolation<number>,
    dragX: RNAnimated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [-20, 0, 0],
    });

    return (
      <RectButton 
        style={[styles.leftAction, { backgroundColor: colors.secondaryContainer, borderRadius: radius.lg }]} 
        onPress={onAdvance}
      >
        <RNAnimated.View style={{ transform: [{ translateX: trans }] }}>
          <Ionicons name="play-forward" size={24} color={colors.onSecondary} />
          <Text style={[styles.actionText, { color: colors.onSecondary }]}>Advance</Text>
        </RNAnimated.View>
      </RectButton>
    );
  };

  const renderRightActions = (
    _progress: RNAnimated.AnimatedInterpolation<number>,
    dragX: RNAnimated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [0, 0, 20],
    });

    return (
      <RectButton 
        style={[styles.rightAction, { backgroundColor: colors.errorContainer, borderRadius: radius.lg }]} 
        onPress={onDelete}
      >
        <RNAnimated.View style={{ transform: [{ translateX: trans }] }}>
          <Ionicons name="trash-outline" size={24} color={colors.onError} />
          <Text style={[styles.actionText, { color: colors.onError }]}>Delete</Text>
        </RNAnimated.View>
      </RectButton>
    );
  };

  return (
    <Swipeable
      renderLeftActions={task.status !== 'done' ? renderLeftActions : undefined}
      renderRightActions={renderRightActions}
      friction={2}
      leftThreshold={40}
      rightThreshold={40}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: colors.surfaceContainerHigh,
            borderRadius: radius.lg,
            padding: spacing.base,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View style={styles.header}>
          <StatusBadge status={task.status} />
          <PriorityIndicator priority={task.priority} />
        </View>

        <View style={styles.content}>
          <Text 
            style={[
              styles.title, 
              { 
                color: colors.onSurface,
                textDecorationLine: task.status === 'done' ? 'line-through' : 'none',
                opacity: task.status === 'done' ? 0.6 : 1,
              }
            ]}
          >
            {task.title}
          </Text>
          {task.due_date && (
            <View style={styles.dueDateContainer}>
              <Ionicons name="calendar-outline" size={12} color={colors.onSurfaceVariant} />
              <Text style={[styles.dueDate, { color: colors.onSurfaceVariant }]}>
                {format(new Date(task.due_date), 'MMM d, yyyy')}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  content: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: 4,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    fontFamily: Typography.fontFamily.regular,
    marginLeft: 4,
  },
  leftAction: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
    marginBottom: 16, // Match the spacing between items
  },
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    marginBottom: 16, // Match the spacing between items
  },
  actionText: {
    fontSize: 12,
    fontFamily: Typography.fontFamily.medium,
    marginTop: 4,
  },
});
