import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from '../../constants/typography';
import { Category, CreateCategory, UpdateCategory } from '../../types/category';
import { ColorPicker } from './ColorPicker';
import { IconPicker } from './IconPicker';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../common/Button';

interface CategoryEditorProps {
  category?: Category;
  initialType: 'expense' | 'income';
  onSave: (category: CreateCategory | UpdateCategory) => Promise<void>;
  onClose: () => void;
}

export const CategoryEditor = ({ category, initialType, onSave, onClose }: CategoryEditorProps) => {
  const { colors, spacing, radius } = useTheme();
  const [name, setName] = useState(category?.name || '');
  const [icon, setIcon] = useState(category?.icon || 'cart-outline');
  const [color, setColor] = useState(category?.color || '#FF5252');
  const [type, setType] = useState<'expense' | 'income'>(category?.type || initialType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Nama kategori harus diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      if (category) {
        await onSave({ name, icon, color, type });
      } else {
        await onSave({ name, icon, color, type });
      }
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan kategori');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.xl, paddingVertical: spacing.md }]}>
        <Text style={[styles.title, { color: colors.onSurface }]}>
          {category ? 'Edit Kategori' : 'Tambah Kategori'}
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
          <Text style={[styles.previewName, { color: colors.onSurface }]}>{name || 'Nama Kategori'}</Text>
        </View>

        <Text style={[styles.label, { color: colors.onSurfaceVariant, marginTop: spacing.lg }]}>NAMA KATEGORI</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.surfaceContainerLow, 
              color: colors.onSurface,
              borderRadius: radius.md,
              padding: spacing.md,
              marginTop: spacing.xs,
            }
          ]}
          placeholder="Misal: Makan Siang"
          placeholderTextColor={colors.outline}
          value={name}
          onChangeText={setName}
          maxLength={20}
        />

        <Text style={[styles.label, { color: colors.onSurfaceVariant, marginTop: spacing.xl }]}>TIPE</Text>
        <View style={[styles.typeContainer, { marginTop: spacing.xs }]}>
          <TouchableOpacity
            onPress={() => setType('expense')}
            style={[
              styles.typeTab,
              type === 'expense' && { backgroundColor: colors.primary, borderRadius: radius.full }
            ]}
          >
            <Text style={[styles.typeTabText, { color: type === 'expense' ? colors.onPrimary : colors.onSurfaceVariant }]}>Pengeluaran</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setType('income')}
            style={[
              styles.typeTab,
              type === 'income' && { backgroundColor: colors.primary, borderRadius: radius.full }
            ]}
          >
            <Text style={[styles.typeTabText, { color: type === 'income' ? colors.onPrimary : colors.onSurfaceVariant }]}>Pemasukan</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { color: colors.onSurfaceVariant, marginTop: spacing.xl }]}>WARNA</Text>
        <ColorPicker selectedColor={color} onSelect={setColor} />

        <Text style={[styles.label, { color: colors.onSurfaceVariant, marginTop: spacing.xl }]}>IKON</Text>
        <IconPicker selectedIcon={icon} onSelect={setIcon} color={color} />

        <Button
          title={isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
          onPress={handleSave}
          loading={isSubmitting}
          style={{ marginTop: spacing.xxl }}
        />
      </ScrollView>
    </View>
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
    borderBottomWidth: 0,
  },
  title: {
    fontSize: 20,
    fontFamily: Typography.fontFamily.bold,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  previewName: {
    fontSize: 18,
    fontFamily: Typography.fontFamily.semiBold,
  },
  label: {
    fontSize: 12,
    fontFamily: Typography.fontFamily.medium,
  },
  input: {
    fontSize: 16,
    fontFamily: Typography.fontFamily.regular,
  },
  saveButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: Typography.fontFamily.bold,
  },
  typeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 25,
    padding: 4,
  },
  typeTab: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeTabText: {
    fontSize: 13,
    fontFamily: Typography.fontFamily.medium,
  },
});
