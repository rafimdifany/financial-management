import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Text } from '../../components/common/Text';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { CategoryPicker } from '../../components/transaction/CategoryPicker';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useTransactionStore } from '../../stores/useTransactionStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Category } from '../../types/category';

export const TransactionFormScreen = () => {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactionStore();

  const mode = route.params?.mode || 'create';
  const initialTransaction = route.params?.transaction;

  // Form States
  const [type, setType] = useState<'expense' | 'income'>(initialTransaction?.type || 'expense');
  const [amount, setAmount] = useState(initialTransaction ? new Intl.NumberFormat('id-ID').format(initialTransaction.amount) : '');
  const [category, setCategory] = useState<Category | null>(initialTransaction ? {
    id: initialTransaction.category_id,
    name: initialTransaction.category_name,
    icon: initialTransaction.category_icon,
    color: initialTransaction.category_color,
    type: initialTransaction.type,
    is_default: 0,
    created_at: ''
  } : null);
  const [date, setDate] = useState(initialTransaction ? new Date(initialTransaction.date) : new Date());
  const [description, setDescription] = useState(initialTransaction?.description || '');

  // UI States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCurrency = (val: string) => {
    const numericValue = val.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(numericValue));
  };

  const handleAmountChange = (val: string) => {
    setAmount(formatCurrency(val));
    if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
  };

  const handleTypeChange = (newType: 'expense' | 'income') => {
    setType(newType);
    setCategory(null); // Reset category when type changes
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!amount) newErrors.amount = 'Jumlah harus diisi';
    if (!category) newErrors.category = 'Kategori harus dipilih';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''));
    const payload = {
      amount: numericAmount,
      type,
      category_id: category!.id,
      date: date.toISOString(),
      description: description.trim()
    };

    try {
      if (mode === 'edit' && initialTransaction) {
        await updateTransaction(initialTransaction.id, payload);
      } else {
        await addTransaction(payload);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan transaksi');
    }
  };

  const handleDelete = async () => {
    if (!initialTransaction) return;
    try {
      await deleteTransaction(initialTransaction.id);
      setShowDeleteConfirm(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Gagal menghapus transaksi');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.xl }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={28} color={colors.onSurface} />
        </TouchableOpacity>
        <Text variant="headlineSm" style={styles.headerTitle}>
          {mode === 'edit' ? 'Ubah Transaksi' : 'Tambah Transaksi'}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { padding: spacing.lg }]}>
        {/* Type Toggle */}
        <View style={[styles.typeToggle, { backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.full }]}>
          <TouchableOpacity 
            style={[
              styles.typeButton, 
              type === 'expense' && { backgroundColor: colors.error, borderRadius: radius.full }
            ]}
            onPress={() => handleTypeChange('expense')}
          >
            <Text style={{ color: type === 'expense' ? colors.onError : colors.onSurfaceVariant }}>Pengeluaran</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.typeButton, 
              type === 'income' && { backgroundColor: colors.primary, borderRadius: radius.full }
            ]}
            onPress={() => handleTypeChange('income')}
          >
            <Text style={{ color: type === 'income' ? colors.onPrimary : colors.onSurfaceVariant }}>Pemasukan</Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <Text variant="labelMd" style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}>JUMLAH</Text>
          <View style={styles.amountInputRow}>
            <Text variant="headlineMd" style={{ color: colors.onSurface }}>Rp</Text>
            <Input 
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholder="0"
              style={styles.amountInput}
              error={errors.amount}
            />
          </View>
        </View>

        {/* Category Picker Trigger */}
        <TouchableOpacity 
          style={styles.fieldTrigger}
          onPress={() => setShowCategoryPicker(true)}
        >
          <View style={{ flex: 1 }}>
            <Text variant="labelMd" style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}>KATEGORI</Text>
            <Text variant="bodyLg" style={{ color: category ? colors.onSurface : colors.outline }}>
              {category ? category.name : 'Pilih Kategori'}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.outline} />
        </TouchableOpacity>
        {errors.category && (
          <Text variant="labelSm" style={{ color: colors.error, marginTop: -12, marginBottom: 12 }}>{errors.category}</Text>
        )}

        {/* Date Picker Trigger */}
        <TouchableOpacity 
          style={styles.fieldTrigger}
          onPress={() => setShowDatePicker(true)}
        >
          <View style={{ flex: 1 }}>
            <Text variant="labelMd" style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}>TANGGAL</Text>
            <Text variant="bodyLg">
              {format(date, 'EEEE, d MMMM yyyy', { locale: localeId })}
            </Text>
          </View>
          <MaterialCommunityIcons name="calendar" size={24} color={colors.outline} />
        </TouchableOpacity>

        {/* Note Input */}
        <Input 
          label="CATATAN"
          value={description}
          onChangeText={setDescription}
          placeholder="Tambahkan catatan (opsional)"
          multiline
          numberOfLines={3}
        />

        <View style={{ marginTop: spacing.xl }}>
          <Button 
            title="Simpan Transaksi" 
            onPress={handleSave} 
            size="lg"
          />
          
          {mode === 'edit' && (
            <Button 
              title="Hapus Transaksi" 
              onPress={() => setShowDeleteConfirm(true)} 
              variant="error"
              style={{ marginTop: spacing.md }}
            />
          )}
        </View>
      </ScrollView>

      {/* Modals & Pickers */}
      <CategoryPicker 
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        onSelect={setCategory}
        selectedId={category?.id}
        type={type}
      />

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <ConfirmModal 
        visible={showDeleteConfirm}
        title="Hapus Transaksi"
        message="Apakah Anda yakin ingin menghapus transaksi ini?"
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isDestructive
      />
    </KeyboardAvoidingView>
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
    flexGrow: 1,
  },
  typeToggle: {
    flexDirection: 'row',
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountContainer: {
    marginBottom: 24,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    marginLeft: 8,
  },
  fieldTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    marginBottom: 24,
  },
});
