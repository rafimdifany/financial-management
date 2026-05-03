import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, SectionList, RefreshControl, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useTransactionStore } from '../../stores/useTransactionStore';
import { Text } from '../../components/common/Text';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { TransactionWithCategory } from '../../types/transaction';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { groupByDate } from '../../utils/groupByDate';
import { TransactionItem } from '../../components/transaction/TransactionItem';
import { TransactionSummary } from '../../components/transaction/TransactionSummary';
import { TransactionGroupHeader } from '../../components/transaction/TransactionGroup';

export const TransactionListScreen = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<any>();
  const { 
    transactions, 
    summary,
    isLoading, 
    isRefreshing, 
    filter, 
    setFilter, 
    fetchTransactions, 
    loadMore, 
    hasMore,
    deleteTransaction 
  } = useTransactionStore();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionWithCategory | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const groupedTransactions = groupByDate(transactions);

  const handleRefresh = useCallback(() => {
    fetchTransactions(true);
  }, [fetchTransactions]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      loadMore();
    }
  }, [hasMore, isLoading, loadMore]);

  const handleDeletePress = (tx: TransactionWithCategory) => {
    setSelectedTx(tx);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedTx) {
      await deleteTransaction(selectedTx.id);
      setDeleteModalVisible(false);
      setSelectedTx(null);
    }
  };

  const renderItem = ({ item }: { item: TransactionWithCategory }) => (
    <TransactionItem 
      transaction={item}
      onPress={() => navigation.navigate('TransactionForm', { transaction: item, mode: 'edit' })}
      onDelete={() => handleDeletePress(item)}
    />
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <TransactionGroupHeader title={title} />
  );

  const FilterChip = ({ label, value }: { label: string, value: typeof filter }) => {
    const isActive = filter === value;
    return (
      <TouchableOpacity 
        onPress={() => setFilter(value)}
        style={[
          styles.filterChip, 
          { 
            backgroundColor: isActive ? colors.primary : colors.surfaceContainerHigh,
          }
        ]}
      >
        <Text 
          variant="labelLg" 
          style={{ color: isActive ? colors.onPrimary : colors.onSurfaceVariant }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <SectionList
          sections={groupedTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.lg }]}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={
            <View style={{ paddingTop: spacing.md }}>
              <TransactionSummary income={summary.income} expense={summary.expense} />
              <View style={styles.filterContainer}>
                <FilterChip label="Semua" value="all" />
                <FilterChip label="Pemasukan" value="income" />
                <FilterChip label="Pengeluaran" value="expense" />
              </View>
            </View>
          }
          refreshControl={
            <RefreshControl 
              refreshing={isRefreshing} 
              onRefresh={handleRefresh} 
              colors={[colors.primary]} 
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            !isLoading ? (
              <EmptyState 
                title="Belum ada transaksi" 
                message="Mulai catat pengeluaran dan pemasukanmu hari ini."
                icon="swap-vertical-outline"
              />
            ) : null
          }
        />

        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: colors.primary, bottom: spacing.xl, right: spacing.xl }]}
          onPress={() => navigation.navigate('TransactionForm', { mode: 'create' })}
        >
          <MaterialCommunityIcons name="plus" size={24} color={colors.onPrimary} />
        </TouchableOpacity>

        <ConfirmModal 
          visible={deleteModalVisible}
          title="Hapus Transaksi?"
          message="Data transaksi ini akan dihapus secara permanen."
          confirmLabel="Hapus"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalVisible(false)}
          isDestructive={true}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  listContent: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});
