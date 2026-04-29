import React from 'react';
import { View } from 'react-native';
import { Text } from '../../components/common/Text';
import { useTheme } from '../../hooks/useTheme';

export const CategoryManageScreen = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant='headlineMd'>CategoryManageScreen</Text>
    </View>
  );
};
