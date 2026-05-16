import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { SettingRow } from '../../components/settings/SettingRow';
import { ThemeSwitcher } from '../../components/settings/ThemeSwitcher';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useNavigation } from '@react-navigation/native';
import appJson from '../../../app.json';
import { Text } from '../../components/common/Text';
import { Surface } from '../../components/common/Surface';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen = () => {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { 
    currency, 
    fetchSettings, 
  } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, []);


  const renderSection = (eyebrow: string, title: string, children: React.ReactNode, danger = false) => (
    <View style={styles.section}>
      <View style={{ paddingHorizontal: spacing.xl, marginBottom: spacing.base }}>
        <Text variant="labelSm" style={{ color: danger ? colors.error : colors.primary, fontWeight: '800' }}>
          {eyebrow}
        </Text>
        <Text variant="titleLg" style={{ color: colors.onSurface, marginTop: 2 }}>
          {title}
        </Text>
      </View>
      <Surface level={1} style={[styles.sectionContent, { borderRadius: radius.md }]}>
        {children}
      </Surface>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView 
        style={styles.container}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ 
          paddingTop: insets.top,
          paddingBottom: 112 
        }}
      >
        <View style={[styles.profileHeader, { paddingTop: spacing["3xl"], paddingHorizontal: spacing.xl, marginBottom: spacing["3xl"] }]}>
          <View style={styles.themeToggleWrapper}>
            <ThemeSwitcher />
          </View>
          <View style={[styles.profileAvatarRing, { borderRadius: radius.full, backgroundColor: colors.primary }]}>
            <View style={[styles.profileAvatar, { borderRadius: radius.full, backgroundColor: colors.primaryContainer, borderColor: colors.surface }]}>
              <Text variant="headlineMd" style={{ color: colors.primary }}>R</Text>
            </View>
            <View style={[styles.editBadge, { backgroundColor: colors.primary, borderColor: colors.surface, borderRadius: radius.full }]}>
              <Ionicons name="pencil" size={12} color={colors.onPrimary} />
            </View>
          </View>
          <Text variant="headlineMd" style={{ color: colors.onSurface, marginTop: spacing.lg }}>
            Rafi
          </Text>
          <Text variant="bodyMd" style={{ color: colors.onSurfaceVariant }}>
            rafi.sanctuary@finance.io
          </Text>
        </View>

      {renderSection('PREFERENCES', 'Localization', (
        <>
          <SettingRow 
            label="Currency" 
            value={`${currency} (Rp)`}
            icon="cash-outline"
            onPress={() => {}} // TODO: Create Currency selection screen
          />
        </>
      ))}

      {renderSection('WEALTH MANAGEMENT', 'My Assets', (
        <>
          <SettingRow 
            label="Bank BCA" 
            value="Rp 12.450.000"
            icon="business-outline"
            onPress={() => navigation.navigate('BudgetManage')}
          />
          <SettingRow 
            label="Physical Cash" 
            value="Rp 850.000"
            icon="wallet-outline"
            onPress={() => navigation.navigate('BudgetManage')}
          />
          <SettingRow 
            label="GoPay" 
            value="Rp 2.100.500"
            icon="card-outline"
            onPress={() => navigation.navigate('BudgetManage')}
          />
        </>
      ))}

      {renderSection('ORGANIZATION', 'Categories', (
        <>
          <SettingRow 
            label="Kategori Transaksi" 
            icon="list-outline"
            onPress={() => navigation.navigate('CategoryManage')}
          />
          <SettingRow 
            label="Anggaran Bulanan" 
            icon="pie-chart-outline"
            onPress={() => navigation.navigate('BudgetManage')}
          />
          <SettingRow 
            label="Target Menabung" 
            icon="trophy-outline"
            onPress={() => navigation.navigate('GoalManage')}
          />
        </>
      ))}

      {renderSection('PRIVACY & SECURITY', 'Data Management', (
        <>
          <SettingRow 
            label="Export Financial Report" 
            icon="download-outline"
            onPress={() => navigation.navigate('DataManage')}
          />
          <SettingRow 
            label="Import Data" 
            icon="cloud-upload-outline"
            onPress={() => navigation.navigate('DataManage')}
          />
          <SettingRow 
            label="Clear All History" 
            icon="trash-outline"
            destructive
            onPress={() => navigation.navigate('DataManage')}
          />
        </>
      ), true)}

      <Text variant="labelSm" style={[styles.version, { color: colors.onSurfaceVariant }]}>
        FINANCIAL SANCTUARY V{appJson.expo.version}
      </Text>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    position: 'relative',
  },
  themeToggleWrapper: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 10,
  },
  profileAvatarRing: {
    width: 128,
    height: 128,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 116,
    height: 116,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 32,
    height: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionContent: {
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  version: {
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.6,
  },
});
