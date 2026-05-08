import React from 'react';
import { View, StyleSheet, Pressable, Text as RNText } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  interpolate,
  Easing
} from 'react-native-reanimated';
import { Animated as RNAnimated } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../common/Text';
import { Task } from '../../types/task';
import { Typography } from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
  onAdvance: () => void;
  onDelete: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const TaskItem = ({ task, onPress, onAdvance, onDelete }: TaskItemProps) => {
  const { colors, spacing, radius } = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(pressed.value, [0, 1], [1, 0.98]) },
      ],
      opacity: interpolate(pressed.value, [0, 1], [1, 0.9]),
    };
  });
  const priorityColor =
    task.priority === 'high' ? '#dc2626' : task.priority === 'medium' ? '#d97706' : colors.primary;
  const priorityLabel =
    task.priority === 'high' ? 'HIGH PRIORITY' : task.priority === 'medium' ? 'MEDIUM PRIORITY' : 'LOW PRIORITY';

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
        style={[styles.leftAction, { backgroundColor: colors.secondaryContainer, borderRadius: radius.md }]} 
        onPress={onAdvance}
      >
        <RNAnimated.View style={{ transform: [{ translateX: trans }] }}>
          <Ionicons name="play-forward" size={24} color={colors.secondary} />
          <Text style={[styles.actionText, { color: colors.secondary }]}>Lanjut</Text>
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
        style={[styles.rightAction, { backgroundColor: colors.errorContainer, borderRadius: radius.md }]} 
        onPress={onDelete}
      >
        <RNAnimated.View style={{ transform: [{ translateX: trans }] }}>
          <Ionicons name="trash-outline" size={24} color={colors.error} />
          <Text style={[styles.actionText, { color: colors.error }]}>Hapus</Text>
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
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => {
          pressed.value = withTiming(1, { duration: 150, easing: Easing.bezier(0.4, 0, 0.2, 1) });
        }}
        onPressOut={() => {
          pressed.value = withTiming(0, { duration: 150, easing: Easing.bezier(0.4, 0, 0.2, 1) });
        }}
        style={[
          styles.container,
          {
            backgroundColor: colors.surfaceContainerHigh,
            borderRadius: radius.md,
            padding: spacing.lg,
          },
          animatedStyle,
        ]}
      >
        <View style={[styles.row, { gap: spacing.base }]}>
          <View style={{ paddingTop: 4 }}>
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: task.status === 'done' ? colors.primary : colors.surfaceVariant,
                  borderRadius: radius.sm,
                },
              ]}
            >
              {task.status === 'done' && (
                <Ionicons name="checkmark" size={14} color={colors.onPrimary} />
              )}
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.priorityRow}>
              <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
              <Text variant="labelSm" style={[styles.priorityText, { color: priorityColor }]}>
                {priorityLabel}
              </Text>
            </View>
            <Text 
              variant="titleMd"
              style={[
                styles.title, 
                { 
                  color: colors.onSurface,
                  textDecorationLine: task.status === 'done' ? 'line-through' : 'none',
                  opacity: task.status === 'done' ? 0.56 : 1,
                }
              ]}
            >
              {task.title}
            </Text>
            {task.due_date && (
              <View style={styles.dueDateContainer}>
                <Ionicons name="calendar-outline" size={13} color={colors.onSurfaceVariant} />
                <Text variant="bodySm" style={[styles.dueDate, { color: colors.onSurfaceVariant }]}>
                  {format(new Date(task.due_date), 'MMM d, yyyy')}
                </Text>
              </View>
            )}
          </View>
          <Ionicons name="ellipsis-vertical" size={18} color={colors.onSurfaceVariant} />
        </View>
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  priorityText: {
    fontSize: 10,
    lineHeight: 15,
    fontFamily: Typography.fontFamily.bold,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Typography.fontFamily.bold,
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
