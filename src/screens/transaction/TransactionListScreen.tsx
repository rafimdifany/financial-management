import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { StyleSheet, View, SectionList, RefreshControl, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useTransactionStore } from '../../stores/useTransactionStore';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { CategoryIcon } from '../../components/common/CategoryIcon';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { TransactionWithCategory } from '../../types/transaction';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

export const TransactionListScreen = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<any>();
  const { 
    transactions, 
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

  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: TransactionWithCategory[] } = {};
    
    transactions.forEach(tx => {
      const date = parseISO(tx.date);
      let title = format(date, 'dd MMM yyyy');
      
      if (isToday(date)) title = 'Hari Ini';
      else if (isYesterday(date)) title = 'Kemarin';
      
      if (!groups[title]) groups[title] = [];
      groups[title].push(tx);
    });
    
    return Object.keys(groups).map(title => ({
      title,
      data: groups[title]
    }));
  }, [transactions]);

  const handleRefresh = useCallback(() => {
    fetchTransactions(true);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      loadMore();
    }
  }, [hasMore, isLoading]);

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

  const renderRightActions = (tx: TransactionWithCategory) => (
    <TouchableOpacity 
      style={[styles.deleteAction, { backgroundColor: colors.error, marginBottom: spacing.base }]}
      onPress={() => handleDeletePress(tx)}
    >
      <MaterialCommunityIcons name="delete" size={24} color={colors.onError} />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: TransactionWithCategory }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item)}
      friction={2}
      rightThreshold={40}
    >
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => navigation.navigate('TransactionForm', { id: item.id })}
        style={{ marginBottom: spacing.base }}
      >
        <Card level={1} style={styles.transactionCard}>
          <View style={styles.txRow}>
            <CategoryIcon 
              name={item.category_icon || 'cash'} 
              color={item.category_color || colors.primary} 
              size={40}
            />
            <View style={styles.txInfo}>
              <Text variant="titleMd">{item.category_name || 'Tanpa Kategori'}</Text>
              {item.description ? (
                <Text variant="bodySm" style={{ color: colors.onSurfaceVariant }} numberOfLines={1}>
                  {item.description}
                </Text>
              ) : null}
            </View>
            <View style={styles.txAmount}>
              <Text 
                variant="titleMd" 
                style={{ color: item.type === 'income' ? colors.primary : colors.error }}
              >
                {item.type === 'income' ? '+' : '-'} Rp {item.amount.toLocaleString('id-ID')}
              </Text>
              <Text variant="bodySm" style={{ color: colors.onSurfaceVariant }}>
                {format(parseISO(item.date), 'HH:mm')}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Swipeable>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
      <Text variant="titleSm" style={{ color: colors.onSurfaceVariant }}>{title.toUpperCase()}</Text>
    </View>
  );

  const FilterChip = ({ label, value }: { label: string, value: typeof filter }) => {
    const isActive = filter === value;
    return (
      <TouchableOpacity 
        onPress={() => setFilter(value)}
        style={[
          styles.filterChip, 
          { 
            backgroundColor: isActive ? colors.primary : colors.surfaceVariant,
          }
        ]}
      >
        <Text 
          variant="labelLarge" 
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
        <View style={[styles.filterContainer, { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm }]}>
          <FilterChip label="Semua" value="all" />
          <FilterChip label="Pemasukan" value="income" />
          <FilterChip label="Pengeluaran" value="expense" />
        </View>

        <SectionList
          sections={groupedTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.lg }]}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
          }
          ListEmptyComponent={
            !isLoading ? (
              <EmptyState 
                title="Belum ada transaksi" 
                message="Mulai catat pengeluaran dan pemasukanmu hari ini."
                icon="swap-vertical"
              />
            ) : null
          }
        />

        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: colors.primary, bottom: spacing.xl, right: spacing.xl }]}
          onPress={() => navigation.navigate('TransactionForm')}
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
    paddingTop: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  listContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingVertical: 12,
  },
  transactionCard: {
    padding: 16,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txInfo: {
    flex: 1,
    marginLeft: 12,
  },
  txAmount: {
    alignItems: 'flex-end',
  },
  deleteAction: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 8,
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
