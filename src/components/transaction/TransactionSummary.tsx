import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../common/Text';
import { Card } from '../common/Card';

interface Props {
  income: number;
  expense: number;
}

export const TransactionSummary: React.FC<Props> = ({ income, expense }) => {
  const { colors, spacing, radius } = useTheme();
  const net = income - expense;

  return (
    <Card 
      level={1} 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.surfaceContainerLowest, 
          borderRadius: radius.md,
          padding: spacing.lg,
          marginBottom: spacing.lg
        }
      ]}
    >
      <View style={styles.row}>
        <View style={styles.column}>
          <Text variant="labelMd" style={{ color: colors.onSurfaceVariant, marginBottom: spacing.xs }}>
            INCOME
          </Text>
          <Text variant="titleMd" numberOfLines={1} style={{ color: colors.secondary }}>
            Rp {income.toLocaleString('id-ID')}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />
        <View style={styles.column}>
          <Text variant="labelMd" style={{ color: colors.onSurfaceVariant, marginBottom: spacing.xs }}>
            EXPENSE
          </Text>
          <Text variant="titleMd" numberOfLines={1} style={{ color: colors.error }}>
            Rp {expense.toLocaleString('id-ID')}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />
        <View style={styles.column}>
          <Text variant="labelMd" style={{ color: colors.onSurfaceVariant, marginBottom: spacing.xs }}>
            NET
          </Text>
          <Text variant="titleMd" numberOfLines={1} style={{ color: colors.primary }}>
            Rp {net.toLocaleString('id-ID')}
          </Text>
        </View>
      </View>
    </Card>
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
  column: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 32,
    marginHorizontal: 12,
  },
});
