import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { useBudgetStore } from '../../stores/useBudgetStore';
import { Typography } from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../types/category';
import { BudgetPeriod } from '../../types/budget';
import { formatCurrency } from '../../utils/formatCurrency';
import { AppTopBar } from '../../components/common/AppTopBar';

export const BudgetManageScreen = () => {
  const { colors, spacing, radius } = useTheme();
  const { expenseCategories, fetchCategories } = useCategoryStore();
  const { budgets, fetchBudgets, setBudget, isLoading } = useBudgetStore();
  
  const [period, setPeriod] = useState<BudgetPeriod>('monthly');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchBudgets();
  }, []);

  const handleSetBudget = async (categoryId: number, value: string) => {
    const amount = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    try {
      await setBudget(categoryId, amount, period);
      setEditingId(null);
    } catch (error) {
      console.error('Failed to set budget:', error);
    }
  };

  const startEditing = (categoryId: number, currentAmount: number) => {
    setEditingId(categoryId);
    setTempValue(currentAmount > 0 ? currentAmount.toString() : '');
  };

  const renderBudgetItem = ({ item }: { item: Category }) => {
    const budget = budgets.find(b => b.category_id === item.id && b.period === period);
    const isEditing = editingId === item.id;
    const amount = budget?.amount || 0;
    const categoryColor = item.color || colors.primary;

    return (
      <View style={[styles.budgetItem, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md, marginBottom: spacing.sm }]}>
        <View style={styles.categoryInfo}>
          <View style={[styles.iconBox, { backgroundColor: `${categoryColor}18`, borderRadius: radius.md }]}>
            <Ionicons name={(item.icon || 'wallet-outline') as any} size={20} color={categoryColor} />
          </View>
          <Text style={[styles.categoryName, { color: colors.onSurface }]} numberOfLines={1}>{item.name}</Text>
        </View>

        <View style={styles.amountContainer}>
          {isEditing ? (
            <TextInput
              style={[
                styles.amountInput, 
                { 
                  color: colors.primary, 
                  backgroundColor: colors.surfaceContainerHigh,
                  borderRadius: radius.sm,
                  paddingHorizontal: spacing.sm,
                }
              ]}
              value={tempValue}
              onChangeText={setTempValue}
              keyboardType="numeric"
              autoFocus
              onBlur={() => handleSetBudget(item.id, tempValue)}
              onSubmitEditing={() => handleSetBudget(item.id, tempValue)}
              placeholder="0"
              placeholderTextColor={colors.outline}
            />
          ) : (
            <TouchableOpacity onPress={() => startEditing(item.id, amount)}>
              <Text style={[
                styles.amountText, 
                { color: amount > 0 ? colors.onSurface : colors.outline }
              ]}>
                {amount > 0 ? formatCurrency(amount) : 'Set Anggaran'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const periods: BudgetPeriod[] = ['weekly', 'monthly', 'yearly'];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <AppTopBar title="Anggaran" showBack />

      <View style={[styles.periodContainer, { paddingHorizontal: spacing.xl, marginBottom: spacing.lg }]}>
        {periods.map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setPeriod(p)}
            style={[
              styles.periodTab,
              period === p && { backgroundColor: colors.primary, borderRadius: radius.full }
            ]}
          >
            <Text style={[
              styles.periodText, 
              { color: period === p ? colors.onPrimary : colors.onSurfaceVariant }
            ]}>
              {p === 'weekly' ? 'Mingguan' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={expenseCategories}
        renderItem={renderBudgetItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: 40 }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ color: colors.outline }}>Belum ada kategori pengeluaran</Text>
          </View>
        }
      />

      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
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
  periodContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 25,
    padding: 4,
    marginHorizontal: 16,
  },
  periodTab: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodText: {
    fontSize: 13,
    fontFamily: Typography.fontFamily.medium,
    textTransform: 'capitalize',
  },
  budgetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  categoryInfo: {
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
  amountContainer: {
    minWidth: 120,
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontFamily: Typography.fontFamily.semiBold,
  },
  amountInput: {
    width: '100%',
    height: 36,
    fontSize: 16,
    fontFamily: Typography.fontFamily.semiBold,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
