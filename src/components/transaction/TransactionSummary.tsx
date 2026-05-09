import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../common/Text';
import { Surface } from '../common/Surface';
import { formatCurrency } from '../../utils/formatCurrency';

interface Props {
  income: number;
  expense: number;
}

export const TransactionSummary: React.FC<Props> = ({ income, expense }) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: spacing.xl, gap: spacing.base }]}>
      <Surface 
        level={1} 
        style={[
          styles.summaryCard, 
          { 
            backgroundColor: colors.secondaryContainer,
            padding: spacing.lg,
            borderRadius: radius.xl,
          }
        ]}
      >
        <Text variant="labelMd" style={{ color: colors.onSecondaryContainer, opacity: 0.8, marginBottom: spacing.xs }}>
          Income
        </Text>
        <Text variant="titleLg" numberOfLines={1} style={{ color: colors.onSecondaryContainer, fontWeight: '700' }}>
          {formatCurrency(income)}
        </Text>
      </Surface>

      <Surface 
        level={1} 
        style={[
          styles.summaryCard, 
          { 
            backgroundColor: colors.tertiaryContainer,
            padding: spacing.lg,
            borderRadius: radius.xl,
          }
        ]}
      >
        <Text variant="labelMd" style={{ color: colors.onTertiaryContainer, opacity: 0.8, marginBottom: spacing.xs }}>
          Expense
        </Text>
        <Text variant="titleLg" numberOfLines={1} style={{ color: colors.onTertiaryContainer, fontWeight: '700' }}>
          {formatCurrency(expense)}
        </Text>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
  },
  summaryCard: {
    flex: 1,
  },
});

