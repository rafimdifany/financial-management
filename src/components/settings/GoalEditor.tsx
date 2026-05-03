import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from '../../constants/typography';
import { Goal, CreateGoal, UpdateGoal } from '../../types/goal';
import { ColorPicker } from './ColorPicker';
import { IconPicker } from './IconPicker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface GoalEditorProps {
  goal?: Goal;
  onSave: (data: CreateGoal | UpdateGoal) => Promise<void>;
  onClose: () => void;
}

export const GoalEditor = ({ goal, onSave, onClose }: GoalEditorProps) => {
  const { colors, spacing, radius } = useTheme();
  const [name, setName] = useState(goal?.name || '');
  const [targetAmount, setTargetAmount] = useState(goal?.target_amount.toString() || '');
  const [currentAmount, setCurrentAmount] = useState(goal?.current_amount.toString() || '0');
  const [icon, setIcon] = useState(goal?.icon || 'trophy-outline');
  const [color, setColor] = useState(goal?.color || '#FFC107');
  const [deadline, setDeadline] = useState<Date | null>(goal?.deadline ? new Date(goal.deadline) : null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !targetAmount) {
      Alert.alert('Error', 'Nama dan Target Tabungan harus diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        name,
        target_amount: parseFloat(targetAmount),
        current_amount: parseFloat(currentAmount),
        icon,
        color,
        deadline: deadline?.toISOString() || null,
      };
      await onSave(data);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan target');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.xl, paddingVertical: spacing.md }]}>
        <Text style={[styles.title, { color: colors.onSurface }]}>
          {goal ? 'Edit Target' : 'Tambah Target'}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.xl }}>
        <View style={styles.previewContainer}>
          <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon as any} size={40} color={color} />
          </View>
          <Text style={[styles.previewName, { color: colors.onSurface }]}>{name || 'Nama Target'}</Text>
        </View>

        <Text style={[styles.label, { color: colors.onSurfaceVariant, marginTop: spacing.lg }]}>NAMA TARGET</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surfaceContainerLow, color: colors.onSurface, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.xs }]}
          placeholder="Misal: Beli Laptop Baru"
          placeholderTextColor={colors.outline}
          value={name}
          onChangeText={setName}
        />

        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>TARGET (RP)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceContainerLow, color: colors.onSurface, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.xs }]}
              placeholder="0"
              placeholderTextColor={colors.outline}
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>TERKUMPUL (RP)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceContainerLow, color: colors.onSurface, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.xs }]}
              placeholder="0"
              placeholderTextColor={colors.outline}
              value={currentAmount}
              onChangeText={setCurrentAmount}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={[styles.label, { color: colors.onSurfaceVariant, marginTop: spacing.xl }]}>DEADLINE (OPSIONAL)</Text>
        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)}
          style={[styles.input, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.xs, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
        >
          <Text style={{ color: deadline ? colors.onSurface : colors.outline }}>
            {deadline ? deadline.toLocaleDateString('id-ID') : 'Pilih Tanggal'}
          </Text>
          {deadline && (
            <TouchableOpacity onPress={() => setDeadline(null)}>
              <Ionicons name="close-circle" size={20} color={colors.outline} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={deadline || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDeadline(selectedDate);
            }}
          />
        )}

        <Text style={[styles.label, { color: colors.onSurfaceVariant, marginTop: spacing.xl }]}>WARNA</Text>
        <ColorPicker selectedColor={color} onSelect={setColor} />

        <Text style={[styles.label, { color: colors.onSurfaceVariant, marginTop: spacing.xl }]}>IKON</Text>
        <IconPicker selectedIcon={icon} onSelect={setIcon} color={color} />

        <TouchableOpacity
          onPress={handleSave}
          disabled={isSubmitting}
          style={[styles.saveButton, { backgroundColor: colors.primary, borderRadius: radius.full, marginTop: spacing.xxl, opacity: isSubmitting ? 0.7 : 1 }]}
        >
          <Text style={[styles.saveButtonText, { color: colors.onPrimary }]}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Target'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20, fontFamily: Typography.fontFamily.bold },
  previewContainer: { alignItems: 'center', marginBottom: 24 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  previewName: { fontSize: 18, fontFamily: Typography.fontFamily.semiBold },
  label: { fontSize: 12, fontFamily: Typography.fontFamily.medium },
  input: { fontSize: 16, fontFamily: Typography.fontFamily.regular },
  saveButton: { height: 56, alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { fontSize: 16, fontFamily: Typography.fontFamily.bold },
});
