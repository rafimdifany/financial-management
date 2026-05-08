import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { Typography } from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { CategoryEditor } from '../../components/settings/CategoryEditor';
import { Category, CreateCategory, UpdateCategory } from '../../types/category';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { AppTopBar } from '../../components/common/AppTopBar';

export const CategoryManageScreen = () => {
  const { colors, spacing, radius } = useTheme();
  const { 
    expenseCategories, 
    incomeCategories, 
    fetchCategories, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    isLoading 
  } = useCategoryStore();

  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [editorVisible, setEditorVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | undefined>(undefined);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingCategory(undefined);
    setEditorVisible(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setEditorVisible(true);
  };

  const handleDeletePress = (category: Category) => {
    if (category.is_default) {
      Alert.alert('Info', 'Kategori default tidak dapat dihapus');
      return;
    }
    setCategoryToDelete(category);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete.id);
        setDeleteModalVisible(false);
        setCategoryToDelete(undefined);
      } catch (error) {
        Alert.alert('Error', 'Gagal menghapus kategori. Pastikan kategori tidak sedang digunakan dalam transaksi.');
      }
    }
  };

  const handleSave = async (data: CreateCategory | UpdateCategory) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await addCategory(data as CreateCategory);
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    const categoryColor = item.color || colors.primary;

    return (
    <View style={[styles.categoryItem, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md, marginBottom: spacing.sm }]}>
      <View style={styles.categoryLeft}>
        <View style={[styles.iconBox, { backgroundColor: `${categoryColor}18`, borderRadius: radius.md }]}>
          <Ionicons name={(item.icon || 'wallet-outline') as any} size={20} color={categoryColor} />
        </View>
        <Text style={[styles.categoryName, { color: colors.onSurface }]} numberOfLines={1}>{item.name}</Text>
        {item.is_default === 1 && (
          <View style={[styles.defaultBadge, { backgroundColor: colors.surfaceContainerHigh }]}>
            <Text style={[styles.defaultText, { color: colors.onSurfaceVariant }]}>Default</Text>
          </View>
        )}
      </View>
      
      <View style={styles.categoryActions}>
        {!item.is_default && (
          <>
            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
              <Ionicons name="pencil-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeletePress(item)} style={styles.actionButton}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <AppTopBar title="Kategori" showBack />

      <View style={[styles.tabContainer, { paddingHorizontal: spacing.xl, marginBottom: spacing.lg }]}>
        <TouchableOpacity 
          onPress={() => setActiveTab('expense')}
          style={[
            styles.tab, 
            activeTab === 'expense' && { backgroundColor: colors.primary, borderRadius: radius.full }
          ]}
        >
          <Text style={[styles.tabText, { color: activeTab === 'expense' ? colors.onPrimary : colors.onSurfaceVariant }]}>Pengeluaran</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('income')}
          style={[
            styles.tab, 
            activeTab === 'income' && { backgroundColor: colors.primary, borderRadius: radius.full }
          ]}
        >
          <Text style={[styles.tabText, { color: activeTab === 'income' ? colors.onPrimary : colors.onSurfaceVariant }]}>Pemasukan</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'expense' ? expenseCategories : incomeCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: 100 }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ color: colors.outline }}>Belum ada kategori kustom</Text>
          </View>
        }
      />

      <TouchableOpacity
        onPress={handleAdd}
        style={[
          styles.fab,
          { 
            backgroundColor: colors.primary, 
            bottom: spacing.xl, 
            right: spacing.xl,
            borderRadius: radius.full,
          }
        ]}
      >
        <Ionicons name="add" size={32} color={colors.onPrimary} />
      </TouchableOpacity>

      <Modal
        visible={editorVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditorVisible(false)}
      >
        <CategoryEditor 
          category={editingCategory}
          initialType={activeTab}
          onSave={handleSave}
          onClose={() => setEditorVisible(false)}
        />
      </Modal>

      <ConfirmModal
        visible={deleteModalVisible}
        title="Hapus Kategori"
        message={`Apakah Anda yakin ingin menghapus kategori "${categoryToDelete?.name}"? Transaksi yang menggunakan kategori ini akan kehilangan label kategorinya.`}
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: Typography.fontFamily.bold,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 25,
    padding: 4,
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.medium,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: Typography.fontFamily.medium,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.regular,
  },
  categoryActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  }
});
