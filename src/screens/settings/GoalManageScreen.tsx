import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useGoalStore } from '../../stores/useGoalStore';
import { Typography } from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { GoalEditor } from '../../components/settings/GoalEditor';
import { Goal, CreateGoal, UpdateGoal } from '../../types/goal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { formatCurrency } from '../../utils/formatCurrency';

export const GoalManageScreen = () => {
  const { colors, spacing, radius } = useTheme();
  const { goals, fetchGoals, addGoal, updateGoal, deleteGoal, isLoading } = useGoalStore();

  const [editorVisible, setEditorVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | undefined>(undefined);

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAdd = () => {
    setEditingGoal(undefined);
    setEditorVisible(true);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setEditorVisible(true);
  };

  const handleDeletePress = (goal: Goal) => {
    setGoalToDelete(goal);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (goalToDelete) {
      try {
        await deleteGoal(goalToDelete.id);
        setDeleteModalVisible(false);
        setGoalToDelete(undefined);
      } catch (error) {
        Alert.alert('Error', 'Gagal menghapus target');
      }
    }
  };

  const handleSave = async (data: CreateGoal | UpdateGoal) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, data as UpdateGoal);
    } else {
      await addGoal(data as CreateGoal);
    }
  };

  const renderGoalItem = ({ item }: { item: Goal }) => {
    const progress = item.target_amount > 0 ? Math.min(item.current_amount / item.target_amount, 1) : 0;
    const percentage = Math.round(progress * 100);
    const goalColor = item.color || colors.primary;
    const goalIcon = item.icon || 'trophy-outline';

    return (
      <TouchableOpacity 
        onPress={() => handleEdit(item)}
        style={[styles.goalItem, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md, marginBottom: spacing.md }]}
      >
        <View style={styles.goalHeader}>
          <View style={styles.goalLeft}>
            <View style={[styles.iconBox, { backgroundColor: `${goalColor}18`, borderRadius: radius.md }]}>
              <Ionicons name={goalIcon as any} size={24} color={goalColor} />
            </View>
            <View>
              <Text style={[styles.goalName, { color: colors.onSurface }]}>{item.name}</Text>
              {item.deadline && (
                <Text style={[styles.deadline, { color: colors.onSurfaceVariant }]}>
                  Hingga {new Date(item.deadline).toLocaleDateString('id-ID')}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity onPress={() => handleDeletePress(item)} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceContainerHigh }]}>
            <View style={[styles.progressBarFill, { backgroundColor: goalColor, width: `${percentage}%` }]} />
          </View>
          <View style={styles.progressTextContainer}>
            <Text style={[styles.progressAmount, { color: colors.onSurface }]}>
              {formatCurrency(item.current_amount)}
              <Text style={{ color: colors.outline, fontWeight: 'normal' }}> / {formatCurrency(item.target_amount)}</Text>
            </Text>
            <Text style={[styles.percentageText, { color: goalColor }]}>{percentage}%</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.screenHeader, { paddingTop: 60, paddingHorizontal: spacing.xl }]}>
        <Text style={[styles.title, { color: colors.onSurface }]}>Target Menabung</Text>
      </View>

      <FlatList
        data={goals}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={64} color={colors.outline} />
            <Text style={{ color: colors.outline, marginTop: 16 }}>Belum ada target menabung</Text>
          </View>
        }
      />

      <TouchableOpacity
        onPress={handleAdd}
        style={[styles.fab, { backgroundColor: colors.primary, bottom: spacing.xl, right: spacing.xl, borderRadius: radius.full }]}
      >
        <Ionicons name="add" size={32} color={colors.onPrimary} />
      </TouchableOpacity>

      <Modal visible={editorVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setEditorVisible(false)}>
        <GoalEditor goal={editingGoal} onSave={handleSave} onClose={() => setEditorVisible(false)} />
      </Modal>

      <ConfirmModal
        visible={deleteModalVisible}
        title="Hapus Target"
        message={`Apakah Anda yakin ingin menghapus target "${goalToDelete?.name}"? Progress tabungan ini akan hilang.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        isDestructive={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenHeader: { marginBottom: 24 },
  title: { fontSize: 28, fontFamily: Typography.fontFamily.bold },
  goalItem: { padding: 16 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  goalLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  goalName: { fontSize: 18, fontFamily: Typography.fontFamily.semiBold },
  deadline: { fontSize: 12, fontFamily: Typography.fontFamily.regular, marginTop: 2 },
  deleteButton: { padding: 4 },
  progressContainer: { marginTop: 8 },
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressTextContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  progressAmount: { fontSize: 14, fontFamily: Typography.fontFamily.semiBold },
  percentageText: { fontSize: 14, fontFamily: Typography.fontFamily.bold },
  fab: { position: 'absolute', width: 64, height: 64, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  emptyState: { alignItems: 'center', marginTop: 60 },
});
