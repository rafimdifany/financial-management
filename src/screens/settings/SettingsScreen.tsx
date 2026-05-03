import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { SettingRow } from '../../components/settings/SettingRow';
import { Typography } from '../../constants/typography';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useNavigation } from '@react-navigation/native';
import appJson from '../../../app.json';

export const SettingsScreen = () => {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<any>();
  const { 
    theme, 
    currency, 
    fetchSettings, 
    updateSetting, 
    resetAllData 
  } = useSettingsStore();

  const [resetModalVisible, setResetModalVisible] = React.useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    try {
      await updateSetting('theme', newTheme);
    } catch (error) {
      Alert.alert('Error', 'Gagal mengubah tema');
    }
  };

  const handleResetData = async () => {
    try {
      await resetAllData();
      setResetModalVisible(false);
      Alert.alert('Berhasil', 'Semua data telah dihapus');
    } catch (error) {
      Alert.alert('Error', 'Gagal menghapus data');
    }
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.onSurfaceVariant, paddingHorizontal: spacing.xl }]}>
        {title.toUpperCase()}
      </Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.lg }]}>
        {children}
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.surface }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={[styles.header, { paddingTop: 60, paddingHorizontal: spacing.xl }]}>
        <Text style={[styles.title, { color: colors.onSurface }]}>Pengaturan</Text>
      </View>

      {renderSection('Tampilan', (
        <>
          <SettingRow 
            label="Tema Gelap" 
            icon="moon-outline"
            rightElement={
              <Switch 
                value={theme === 'dark'} 
                onValueChange={toggleTheme}
                trackColor={{ false: colors.surfaceContainerHigh, true: colors.primary }}
                thumbColor={colors.onPrimary}
              />
            }
          />
          <SettingRow 
            label="Mata Uang" 
            value={currency} 
            icon="cash-outline"
            onPress={() => {}} // TODO: Navigate to Currency selection
          />
        </>
      ))}

      {renderSection('Manajemen Finansial', (
        <>
          <SettingRow 
            label="Kategori Transaksi" 
            icon="list-outline"
            onPress={() => {}} // TODO: Navigate to Category Management
          />
          <SettingRow 
            label="Kategori Aset" 
            icon="wallet-outline"
            onPress={() => {}}
          />
          <SettingRow 
            label="Anggaran Bulanan" 
            icon="pie-chart-outline"
            onPress={() => {}}
          />
          <SettingRow 
            label="Target Menabung" 
            icon="trophy-outline"
            onPress={() => {}}
          />
        </>
      ))}

      {renderSection('Manajemen Data', (
        <>
          <SettingRow 
            label="Ekspor Data (CSV)" 
            icon="download-outline"
            onPress={() => {}}
          />
          <SettingRow 
            label="Impor Data" 
            icon="cloud-upload-outline"
            onPress={() => {}}
          />
          <SettingRow 
            label="Hapus Semua Data" 
            icon="trash-outline"
            destructive
            onPress={() => setResetModalVisible(true)}
          />
        </>
      ))}

      {renderSection('Tentang', (
        <SettingRow 
          label="Versi Aplikasi" 
          value={appJson.expo.version}
          icon="information-circle-outline"
        />
      ))}

      <ConfirmModal
        visible={resetModalVisible}
        title="Hapus Semua Data"
        message="Apakah Anda yakin ingin menghapus semua data? Tindakan ini akan menghapus semua transaksi, tugas, target, dan anggaran. Kategori default tidak akan dihapus."
        onConfirm={handleResetData}
        onCancel={() => setResetModalVisible(false)}
        isDestructive={true}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: Typography.fontFamily.bold,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: 8,
  },
  sectionContent: {
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
});
