import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useTransactionStore } from '../../stores/useTransactionStore';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { useBudgetStore } from '../../stores/useBudgetStore';
import { useGoalStore } from '../../stores/useGoalStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useDashboardStore } from '../../stores/useDashboardStore';
import { exportService, ExportFormat } from '../../services/exportService';
import { importService, ImportData } from '../../services/importService';
import { AppTopBar } from '../../components/common/AppTopBar';
import { Text } from '../../components/common/Text';
import { Surface } from '../../components/common/Surface';
import { SettingRow } from '../../components/settings/SettingRow';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const DataManageScreen = () => {
  const { colors, spacing, radius } = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  // Reset states
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [confirmResetModalVisible, setConfirmResetModalVisible] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  
  const settingsStore = useSettingsStore();
  const transactionStore = useTransactionStore();
  const categoryStore = useCategoryStore();
  const budgetStore = useBudgetStore();
  const goalStore = useGoalStore();
  const taskStore = useTaskStore();
  const dashboardStore = useDashboardStore();

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      await exportService.exportData(format);
    } catch (error) {
      Alert.alert('Export Gagal', error instanceof Error ? error.message : 'Terjadi kesalahan saat export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const data = await importService.pickAndParseFile();
      if (data) {
        // Show preview counts
        const counts = {
          transactions: data.transactions?.length || 0,
          tasks: data.tasks?.length || 0,
          categories: data.categories?.length || 0,
          budgets: data.budgets?.length || 0,
          goals: data.goals?.length || 0,
        };

        Alert.alert(
          'Konfirmasi Import',
          `Data yang ditemukan:\n- ${counts.transactions} Transaksi\n- ${counts.tasks} Tugas\n- ${counts.categories} Kategori\n- ${counts.budgets} Anggaran\n- ${counts.goals} Target\n\nLanjutkan import? Data yang sama akan dilewati.`,
          [
            { text: 'Batal', style: 'cancel' },
            { 
              text: 'Import', 
              onPress: async () => {
                await importService.executeImport(data);
                // Reload all stores
                await Promise.all([
                  transactionStore.fetchTransactions(true),
                  categoryStore.fetchCategories(),
                  budgetStore.fetchBudgets(),
                  goalStore.fetchGoals(),
                  taskStore.fetchTasks(),
                  dashboardStore.fetchAll(),
                  settingsStore.fetchSettings(),
                ]);
                Alert.alert('Berhasil', 'Data berhasil diimport');
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Import Gagal', error instanceof Error ? error.message : 'Terjadi kesalahan saat import data');
    } finally {
      setIsImporting(false);
    }
  };

  const executeReset = async () => {
    try {
      await settingsStore.resetAllData();
      
      // Clear all stores
      transactionStore.reset();
      categoryStore.reset();
      budgetStore.reset();
      goalStore.reset();
      taskStore.reset();
      dashboardStore.reset();
      
      // Re-fetch to get seeded data
      await Promise.all([
        settingsStore.fetchSettings(),
        categoryStore.fetchCategories(),
        dashboardStore.fetchAll(),
      ]);

      setConfirmResetModalVisible(false);
      setResetConfirmText('');
      Alert.alert('Berhasil', 'Semua data telah dihapus dan direset ke pengaturan awal.');
    } catch (error) {
      Alert.alert('Error', 'Gagal mereset data');
    }
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text variant="labelSm" style={[styles.sectionTitle, { color: colors.primary }]}>{title.toUpperCase()}</Text>
      <Surface level={1} style={[styles.sectionContent, { borderRadius: radius.md }]}>
        {children}
      </Surface>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <AppTopBar title="Manajemen Data" />
      <ScrollView contentContainerStyle={{ padding: spacing.xl }}>
        
        {renderSection('Export Data', (
          <>
            <SettingRow 
              label="Export as JSON" 
              description="Backup lengkap untuk dipulihkan nanti"
              icon="document-text-outline"
              onPress={() => handleExport('JSON')}
              isLoading={isExporting}
            />
            <SettingRow 
              label="Export as CSV" 
              description="Dapat dibuka di Excel / Google Sheets"
              icon="list-outline"
              onPress={() => handleExport('CSV')}
              isLoading={isExporting}
            />
          </>
        ))}

        {renderSection('Import Data', (
          <SettingRow 
            label="Import dari File" 
            description="Mendukung format .json yang diekspor"
            icon="cloud-upload-outline"
            onPress={handleImport}
            isLoading={isImporting}
          />
        ))}

        {renderSection('Bahaya', (
          <SettingRow 
            label="Hapus Semua Data" 
            description="Menghapus semua histori secara permanen"
            icon="trash-outline"
            destructive
            onPress={() => setResetModalVisible(true)}
          />
        ))}

      </ScrollView>

      {/* First Confirmation */}
      <ConfirmModal
        visible={resetModalVisible}
        title="Hapus Semua Data?"
        message="Tindakan ini tidak dapat dibatalkan. Semua transaksi, tugas, target, dan anggaran Anda akan dihapus permanen."
        onConfirm={() => {
          setResetModalVisible(false);
          setConfirmResetModalVisible(true);
        }}
        onCancel={() => setResetModalVisible(false)}
        isDestructive
      />

      {/* Second Confirmation with Text Input */}
      <ConfirmModal
        visible={confirmResetModalVisible}
        title="Konfirmasi Terakhir"
        message="Ketik RESET di bawah ini untuk mengonfirmasi penghapusan seluruh data aplikasi."
        onConfirm={executeReset}
        onCancel={() => {
          setConfirmResetModalVisible(false);
          setResetConfirmText('');
        }}
        isDestructive
        confirmDisabled={resetConfirmText !== 'RESET'}
      >
        <View style={{ marginTop: spacing.lg }}>
          <Input 
            placeholder="RESET"
            value={resetConfirmText}
            onChangeText={setResetConfirmText}
            autoCapitalize="characters"
          />
        </View>
      </ConfirmModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '800',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
});
