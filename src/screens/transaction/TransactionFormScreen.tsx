import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../components/common/Text';
import { useTheme } from '../../hooks/useTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const TransactionFormScreen = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const id = route.params?.id;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.xl }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={28} color={colors.onSurface} />
        </TouchableOpacity>
        <Text variant="headlineSm" style={styles.headerTitle}>
          {id ? 'Ubah Transaksi' : 'Tambah Transaksi'}
        </Text>
        <View style={{ width: 28 }} />
      </View>
      
      <View style={styles.content}>
        <Text variant="bodyMd" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
          Form transaksi akan diimplementasikan di Issue #18.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
});
