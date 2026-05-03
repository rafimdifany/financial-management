import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTaskStore } from '../../stores/useTaskStore';
import { TaskItem } from '../../components/task/TaskItem';
import { Typography } from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TaskStatus, Task } from '../../types/task';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Pressable } from 'react-native';

const FILTER_OPTIONS: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
];

export const TaskListScreen = () => {
  const { colors, spacing, radius } = useTheme();
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
      style={styles.filterContainer}
      contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.base }}
    >
      {FILTER_OPTIONS.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => setStatusFilter(option.value)}
          style={[
            styles.filterChip,
            {
              backgroundColor: statusFilter === option.value ? colors.primary : colors.surfaceContainerHigh,
              borderRadius: radius.md,
              marginRight: spacing.sm,
            }
          ]}
        >
          <Text 
            style={[
              styles.filterText, 
              { color: statusFilter === option.value ? colors.onPrimary : colors.onSurfaceVariant }
            ]}
          >
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
      <View style={[styles.header, { paddingTop: 60, paddingHorizontal: spacing.xl }]}>
        <Text style={[styles.title, { color: colors.onSurface }]}>Daftar Tugas</Text>
      </View>

      {renderFilter()}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
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
          { paddingHorizontal: spacing.xl, paddingBottom: 100 }
        ]}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
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

      <Pressable
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: spacing.xl + 70, // Above bottom nav
            right: spacing.xl,
            borderRadius: radius.full,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }
        ]}
        onPress={() => navigation.navigate('TaskForm')}
      >
        <Ionicons name="add" size={32} color={colors.onPrimary} />
      </Pressable>

      <ConfirmModal
        visible={deleteModalVisible}
        title="Hapus Tugas"
        message="Apakah Anda yakin ingin menghapus tugas ini?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
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
  title: {
    fontSize: 32,
    fontFamily: Typography.fontFamily.bold,
  },
  filterContainer: {
    maxHeight: 50,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.medium,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 8,
  },
  fab: {
    position: 'absolute',
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
