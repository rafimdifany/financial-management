import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../common/Text';
import { Surface } from '../common/Surface';
import { TransactionWithCategory } from '../../types/transaction';
import { format, parseISO } from 'date-fns';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../../utils/formatCurrency';

interface Props {
  transaction: TransactionWithCategory;
  onPress: () => void;
  onDelete: () => void;
}

export const TransactionItem: React.FC<Props> = ({ transaction, onPress, onDelete }) => {
  const { colors, spacing, radius } = useTheme();

  const renderRightActions = () => (
    <TouchableOpacity 
      style={[
        styles.deleteAction, 
        { 
          backgroundColor: colors.errorContainer, 
          borderRadius: radius.lg,
          marginBottom: spacing.md,
          marginLeft: spacing.base
        }
      ]}
      onPress={onDelete}
    >
      <MaterialCommunityIcons name="delete-outline" size={24} color={colors.onErrorContainer} />
    </TouchableOpacity>
  );

  const isIncome = transaction.type === 'income';

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
    >
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={onPress}
        style={{ marginBottom: spacing.md }}
      >
        <Surface level={1} style={[styles.container, { padding: spacing.lg, borderRadius: radius.lg }]}>
          <View style={styles.row}>
            <View 
              style={[
                styles.iconWrapper, 
                { 
                  backgroundColor: `${transaction.category_color || colors.primary}15`,
                  borderRadius: radius.full 
                }
              ]}
            >
              <Ionicons 
                name={(transaction.category_icon as any) || 'cash-outline'} 
                size={22} 
                color={transaction.category_color || colors.primary} 
              />
            </View>
            
            <View style={styles.info}>
              <Text variant="titleMd" style={{ color: colors.onSurface, fontWeight: '600' }} numberOfLines={1}>
                {transaction.description || transaction.category_name || 'Untitled'}
              </Text>
              <Text variant="labelSm" style={{ color: colors.onSurfaceVariant, marginTop: 2 }}>
                {transaction.category_name} • {format(parseISO(transaction.date), 'HH:mm')}
              </Text>
            </View>

            <View style={styles.amountContainer}>
              <Text 
                variant="titleMd" 
                numberOfLines={1}
                style={[
                  styles.amount,
                  { color: isIncome ? colors.secondary : colors.onSurface, fontWeight: '700' }
                ]}
              >
                {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
              </Text>
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  amount: {
    fontVariant: ['tabular-nums'],
  },
  deleteAction: {
    width: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

