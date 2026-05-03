import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../common/Text';

interface Props {
  title: string;
}

export const TransactionGroupHeader: React.FC<Props> = ({ title }) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.surface }]}>
      <Text variant="labelMd" style={{ color: colors.onSurfaceVariant }}>
        {title.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 12,
  },
});
