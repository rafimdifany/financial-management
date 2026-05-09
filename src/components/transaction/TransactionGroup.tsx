import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../common/Text';

interface Props {
  title: string;
}

export const TransactionGroupHeader: React.FC<Props> = ({ title }) => {
  const { colors, spacing } = useTheme();

  const isSpecialDate = title === 'Today' || title === 'Yesterday';

  return (
    <View style={[styles.header, { backgroundColor: colors.surface }]}>
      <Text 
        variant="labelLg" 
        style={{ 
          color: isSpecialDate ? colors.primary : colors.onSurfaceVariant,
          fontWeight: '600',
          letterSpacing: 0.1
        }}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingTop: 24,
  },
});

