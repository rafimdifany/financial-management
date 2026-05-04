import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, View, SectionList, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useTransactionStore } from '../../stores/useTransactionStore';
import { Text } from '../../components/common/Text';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Input } from '../../components/common/Input';
import { TransactionWithCategory } from '../../types/transaction';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { groupByDate } from '../../utils/groupByDate';
import { TransactionItem } from '../../components/transaction/TransactionItem';
import { TransactionSummary } from '../../components/transaction/TransactionSummary';
import { TransactionGroupHeader } from '../../components/transaction/TransactionGroup';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const TransactionListScreen = () => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
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
    deleteTransaction,
    setSearchQuery,
    searchQuery
  } = useTransactionStore();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionWithCategory | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchTransactions();
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  const groupedTransactions = groupByDate(transactions);

  const handleRefresh = useCallback(() => {
    fetchTransactions(true);
  }, [fetchTransactions]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading && !isRefreshing) {
      loadMore();
    }
  }, [hasMore, isLoading, isRefreshing, loadMore]);

  const handleSearch = (text: string) => {
    setLocalSearch(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    searchTimeout.current = setTimeout(() => {
      setSearchQuery(text);
    }, 300);
  };

  const toggleSearch = () => {
    if (isSearchVisible) {
      handleSearch('');
    }
    setIsSearchVisible(!isSearchVisible);
  };

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

  const ListFooter = () => {
    if (!hasMore && !isLoading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        {/* Header with Search Toggle */}
        <View style={[
          styles.header, 
          { 
            paddingHorizontal: spacing.lg, 
            paddingTop: insets.top + spacing.md,
            backgroundColor: colors.surface 
          }
        ]}>
          {!isSearchVisible ? (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.headerTitleContainer}>
              <Text variant="headlineSmall" style={{ color: colors.onSurface }}>Transaksi</Text>
              <TouchableOpacity onPress={toggleSearch}>
                <MaterialCommunityIcons name="magnify" size={24} color={colors.onSurface} />
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.searchContainer}>
              <Input 
                autoFocus
                placeholder="Cari transaksi..."
                value={localSearch}
                onChangeText={handleSearch}
                containerStyle={{ flex: 1, marginBottom: 0 }}
              />
              <TouchableOpacity onPress={toggleSearch} style={{ marginLeft: spacing.sm }}>
                <Text variant="labelLg" style={{ color: colors.primary }}>Batal</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        <SectionList
          sections={groupedTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={[
            styles.listContent, 
            { 
              paddingHorizontal: spacing.lg,
              paddingBottom: insets.bottom + 64 + spacing.xl * 2 // 64 is tab bar height
            }
          ]}
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
          ListFooterComponent={ListFooter}
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
                title={searchQuery ? "Hasil tidak ditemukan" : "Belum ada transaksi"} 
                message={searchQuery ? `Tidak ada transaksi dengan kata kunci "${searchQuery}"` : "Mulai catat pengeluaran dan pemasukanmu hari ini."}
                icon={searchQuery ? "search-off" : "swap-vertical-outline"}
              />
            ) : null
          }
        />

        <TouchableOpacity 
          style={[
            styles.fab, 
            { 
              backgroundColor: colors.primary, 
              bottom: insets.bottom + 64 + spacing.lg, // Adjust for Tab Bar height
              right: spacing.lg 
            }
          ]}
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
  header: {
    paddingBottom: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  listContent: {
    // Moved paddingBottom to inline style to use insets
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
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
    zIndex: 10,
  }
});

