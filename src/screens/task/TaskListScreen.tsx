import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useTaskStore } from '../../stores/useTaskStore';
import { TaskItem } from '../../components/task/TaskItem';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TaskStatus, Task } from '../../types/task';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Pressable } from 'react-native';
import { Text } from '../../components/common/Text';
import { Surface } from '../../components/common/Surface';
import { ProgressBar } from '../../components/common/ProgressBar';
import { FloatingActionButton } from '../../components/common/FloatingActionButton';

const FILTER_OPTIONS: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
];

export const TaskListScreen = () => {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { 
    tasks, 
    statusFilter, 
    isLoading, 
    fetchTasks, 
    advanceStatus, 
    deleteTask, 
    setStatusFilter 
  } = useTaskStore();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const completedCount = tasks.filter(task => task.status === 'done').length;
  const completionRate = tasks.length > 0 ? completedCount / tasks.length : 0;

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdvance = async (task: Task) => {
    try {
      await advanceStatus(task.id, task.status);
    } catch (error) {
      console.error('Failed to advance task:', error);
    }
  };

  const handleDeletePress = (task: Task) => {
    setSelectedTask(task);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedTask) {
      try {
        await deleteTask(selectedTask.id);
        setDeleteModalVisible(false);
        setSelectedTask(null);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const renderFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={[styles.filterContainer, { backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outlineVariant, borderRadius: radius.md }]}
      contentContainerStyle={{ padding: 5, flexGrow: 1 }}
    >
      {FILTER_OPTIONS.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => setStatusFilter(option.value)}
          style={[
            styles.filterChip,
            {
              backgroundColor: statusFilter === option.value ? colors.surfaceContainerLow : 'transparent',
              borderRadius: radius.sm,
              flex: 1,
            }
          ]}
        >
          <Text variant="labelLg" style={{ color: statusFilter === option.value ? colors.primary : colors.onSurfaceVariant }}>
            {option.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );

  const getEmptyMessage = () => {
    switch (statusFilter) {
      case 'todo': return 'Tidak ada tugas yang harus dikerjakan.';
      case 'in_progress': return 'Tidak ada tugas yang sedang dikerjakan.';
      case 'done': return 'Belum ada tugas yang selesai.';
      default: return 'Mulai kelola tugas Anda hari ini.';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="never"
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() => navigation.navigate('TaskForm', { task: item })}
            onAdvance={() => handleAdvance(item)}
            onDelete={() => handleDeletePress(item)}
          />
        )}
        contentContainerStyle={[
          styles.listContent, 
          { 
            paddingHorizontal: spacing.xl, 
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 104
          }
        ]}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListHeaderComponent={
          <View style={{ marginBottom: spacing["2xl"], gap: spacing["2xl"] }}>
            <View>
              <Text variant="labelMd" style={{ color: colors.primary, fontWeight: '800' }}>
                PRODUCTIVITY HUB
              </Text>
              <Text variant="headlineLg" style={{ color: colors.onSurface, marginTop: 4 }}>
                Your Tasks
              </Text>
            </View>
            {renderFilter()}
          </View>
        }
        ListFooterComponent={
          tasks.length > 0 ? (
            <View style={[styles.bentoGrid, { gap: spacing.base, marginTop: spacing.lg }]}>
              <Surface level={1} style={[styles.bentoCard, { borderRadius: radius.md, padding: spacing.base }]}>
                <Ionicons name="stats-chart-outline" size={18} color={colors.primary} />
                <Text variant="bodySm" style={{ color: colors.onSurfaceVariant, marginTop: spacing.sm }}>
                  Completion Rate
                </Text>
                <Text variant="headlineMd" style={{ color: colors.onSurface }}>
                  {Math.round(completionRate * 100)}%
                </Text>
                <ProgressBar progress={completionRate} color={colors.primary} height={6} />
              </Surface>
              <Surface level={1} style={[styles.bentoCard, styles.tealBento, { borderRadius: radius.md, padding: spacing.base, backgroundColor: colors.primary }]}>
                <Ionicons name="star" size={18} color={colors.onPrimary} />
                <Text variant="labelSm" style={{ color: colors.onPrimary, marginTop: spacing.sm, fontWeight: '800' }}>
                  PRO MILESTONE
                </Text>
                <Text variant="titleLg" style={{ color: colors.onPrimary }}>
                  Focus on Savings
                </Text>
                <Text variant="bodySm" style={{ color: `${colors.onPrimary}E6` }}>
                  You're {Math.max(tasks.length - completedCount, 0)} tasks away from your monthly goal.
                </Text>
              </Surface>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={{ marginTop: 100 }}>
              <EmptyState
                icon="list"
                title="Daftar Kosong"
                message={getEmptyMessage()}
              />
            </View>
          ) : null
        }
      />

      <FloatingActionButton
        onPress={() => navigation.navigate('TaskForm')}
        style={{ bottom: insets.bottom + 88, right: spacing.xl }}
      >
        <Ionicons name="add" size={32} color={colors.onPrimary} />
      </FloatingActionButton>

      <ConfirmModal
        visible={deleteModalVisible}
        title="Hapus Tugas"
        message="Apakah Anda yakin ingin menghapus tugas ini?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        isDestructive={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  filterContainer: {
    maxHeight: 46,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 104,
  },
  listContent: {
    flexGrow: 1,
  },
  bentoGrid: {
    flexDirection: 'row',
  },
  bentoCard: {
    flex: 1,
    minHeight: 150,
    justifyContent: 'space-between',
  },
  tealBento: {
    borderWidth: 0,
  },
});
