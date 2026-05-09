import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Text } from '../../components/common/Text';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Chip } from '../../components/common/Chip';
import { StatusBadge } from '../../components/task/StatusBadge';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useTaskStore } from '../../stores/useTaskStore';
import { TaskPriority, TaskStatus, Task } from '../../types/task';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

export const TaskFormScreen = () => {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { addTask, updateTask, deleteTask } = useTaskStore();

  const initialTask = route.params?.task as Task | undefined;
  const isEdit = !!initialTask;

  // Form States
  const [title, setTitle] = useState(initialTask?.title || '');
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState<Date | null>(initialTask?.due_date ? new Date(initialTask.due_date) : null);
  const [status] = useState<TaskStatus>(initialTask?.status || 'todo');

  // UI States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Task title is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || isSaving) return;
    setIsSaving(true);

    const payload = {
      title: title.trim(),
      priority,
      due_date: dueDate ? dueDate.toISOString() : undefined,
    };

    try {
      if (isEdit && initialTask) {
        await updateTask(initialTask.id, { ...payload, status });
      } else {
        await addTask(payload);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save task');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialTask) return;
    try {
      await deleteTask(initialTask.id);
      setShowDeleteConfirm(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: 60 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={colors.onSurface} />
        </TouchableOpacity>
        <Text variant="titleLg" style={styles.headerTitle}>
          {isEdit ? 'Edit Task' : 'New Task'}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { padding: spacing.lg }]}>
        {isEdit && (
          <View style={styles.statusSection}>
            <Text variant="labelMd" style={{ color: colors.onSurfaceVariant, marginBottom: 12, fontWeight: '600', letterSpacing: 0.1 }}>Current Status</Text>
            <StatusBadge status={status} />
          </View>
        )}

        <Input
          label="Task Title"
          value={title}
          onChangeText={(val) => {
            setTitle(val);
            if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
          }}
          placeholder="What do you want to work on?"
          error={errors.title}
          autoFocus={!isEdit}
        />

        <View style={styles.section}>
          <Text variant="labelMd" style={{ color: colors.onSurfaceVariant, marginBottom: 16, fontWeight: '600', letterSpacing: 0.1 }}>Priority</Text>
          <View style={styles.priorityRow}>
            {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
              <Chip
                key={p}
                label={p.charAt(0).toUpperCase() + p.slice(1)}
                selected={priority === p}
                onPress={() => setPriority(p)}
                style={{ marginRight: 8, flex: 1 }}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="labelMd" style={{ color: colors.onSurfaceVariant, marginBottom: 8, fontWeight: '600', letterSpacing: 0.1 }}>Due Date (Optional)</Text>
          <TouchableOpacity 
            style={[styles.dateTrigger, { backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.md }]}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <MaterialCommunityIcons name="calendar-clock" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={{ color: dueDate ? colors.onSurface : colors.outline }}>
                {dueDate ? format(dueDate, 'EEEE, MMMM d, yyyy') : 'Set a due date'}
              </Text>
            </View>
            {dueDate && (
              <TouchableOpacity onPress={() => setDueDate(null)}>
                <Ionicons name="close-circle" size={20} color={colors.outline} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Button 
            title={isEdit ? "Save Changes" : "Create Task"} 
            onPress={handleSave} 
            loading={isSaving}
          />
          
          {isEdit && (
            <Button 
              title="Delete Task" 
              onPress={() => setShowDeleteConfirm(true)} 
              variant="ghost"
              style={{ marginTop: spacing.md }}
              textStyle={{ color: colors.error }}
            />
          )}
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDueDate(selectedDate);
          }}
        />
      )}

      <ConfirmModal 
        visible={showDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isDestructive
      />

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flexGrow: 1,
  },
  statusSection: {
    marginBottom: 24,
  },
  section: {
    marginTop: 24,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
});
