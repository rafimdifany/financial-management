import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../common/Text';
import { Card } from '../common/Card';
import { CategoryIcon } from '../common/CategoryIcon';
import { TransactionWithCategory } from '../../types/transaction';
import { format, parseISO } from 'date-fns';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  transaction: TransactionWithCategory;
  onPress: () => void;
  onDelete: () => void;
}

export const TransactionItem: React.FC<Props> = ({ transaction, onPress, onDelete }) => {
  const { colors, spacing } = useTheme();

  const renderRightActions = () => (
    <TouchableOpacity 
      style={[styles.deleteAction, { backgroundColor: colors.error, marginBottom: spacing.base }]}
      onPress={onDelete}
    >
      <MaterialCommunityIcons name="delete" size={24} color={colors.onError} />
    </TouchableOpacity>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
    >
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={onPress}
        style={{ marginBottom: spacing.base }}
      >
        <Card level={1} style={[styles.card, { padding: spacing.xl }]}>
          <View style={styles.row}>
            <CategoryIcon 
              icon={transaction.category_icon || 'cash'} 
              color={transaction.category_color || colors.primary} 
              size={24}
            />
            <View style={styles.info}>
              <Text variant="titleMd" numberOfLines={2}>{transaction.description || transaction.category_name || 'Tanpa Kategori'}</Text>
              {transaction.description ? (
                <Text variant="bodySm" style={{ color: colors.onSurfaceVariant }} numberOfLines={1}>
                  {transaction.category_name}
                </Text>
              ) : null}
            </View>
            <View style={styles.amountContainer}>
              <Text 
                variant="titleMd" 
                numberOfLines={1}
                style={[
                  styles.amount,
                  { color: transaction.type === 'income' ? colors.secondary : colors.error }
                ]}
              >
                {transaction.type === 'income' ? '+ Rp ' : '- Rp '}
                {transaction.amount.toLocaleString('id-ID')}
              </Text>
              <Text variant="bodySm" style={{ color: colors.onSurfaceVariant }}>
                {format(parseISO(transaction.date), 'HH:mm')}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    // padding moved to inline style to use theme spacing
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  amountContainer: {
    alignItems: 'flex-end',
    maxWidth: 104,
  },
  amount: {
    fontVariant: ['tabular-nums'],
  },
  deleteAction: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 8,
  },
});
