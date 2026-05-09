import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { Category } from '../../types/category';

export const TransactionFormScreen = () => {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactionStore();

  const mode = route.params?.mode || 'create';
  const initialTransaction = route.params?.transaction;

  // Form States
  const [type, setType] = useState<'expense' | 'income'>(initialTransaction?.type || 'expense');
  const [amount, setAmount] = useState(initialTransaction ? new Intl.NumberFormat('en-US').format(initialTransaction.amount) : '');
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
  const [isSaving, setIsSaving] = useState(false);

  const formatCurrency = (val: string) => {
    const numericValue = val.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('en-US').format(parseInt(numericValue));
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
    if (!amount) newErrors.amount = 'Amount is required';
    else if (parseInt(amount.replace(/[^0-9]/g, '')) <= 0)
      newErrors.amount = 'Amount must be greater than 0';
    if (!category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || isSaving) return;
    setIsSaving(true);

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
      Alert.alert('Error', 'Failed to save transaction');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialTransaction) return;
    try {
      await deleteTransaction(initialTransaction.id);
      setShowDeleteConfirm(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete transaction');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={[
        styles.header, 
        { 
          paddingHorizontal: spacing.lg, 
          paddingTop: insets.top + spacing.md,
          backgroundColor: colors.surface
        }
      ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={28} color={colors.onSurface} />
        </TouchableOpacity>
        <Text variant="headlineSm" style={styles.headerTitle}>
          {mode === 'edit' ? 'Edit Transaction' : 'New Transaction'}
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
            <Text style={{ color: type === 'expense' ? colors.onError : colors.onSurfaceVariant }}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.typeButton, 
              type === 'income' && { backgroundColor: colors.primary, borderRadius: radius.full }
            ]}
            onPress={() => handleTypeChange('income')}
          >
            <Text style={{ color: type === 'income' ? colors.onPrimary : colors.onSurfaceVariant }}>Income</Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <Text variant="labelMd" style={[styles.centeredLabel, { color: colors.onSurfaceVariant }]}>AMOUNT</Text>
          <View style={[styles.amountInputWrapper, { borderRadius: radius.xl }]}>
            <Text variant="displayMd" style={{ color: colors.onSurface, marginRight: 8 }}>Rp</Text>
            <TextInput 
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.outline}
              style={[styles.amountInputLarge, { color: colors.onSurface }]}
            />
          </View>
          {errors.amount && (
            <Text variant="labelSm" style={{ color: colors.error, marginTop: 8 }}>{errors.amount}</Text>
          )}
        </View>

        {/* Side-by-side Category & Date */}
        <View style={styles.rowContainer}>
          {/* Category Picker Trigger */}
          <View style={styles.halfField}>
            <Text variant="labelMd" style={{ color: colors.onSurfaceVariant, marginBottom: 8, fontWeight: '500', letterSpacing: 0.1 }}>CATEGORY</Text>
            <TouchableOpacity 
              style={[
                styles.fieldTrigger, 
                { backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.md, padding: spacing.md }
              ]}
              onPress={() => setShowCategoryPicker(true)}
            >
              <View style={{ flex: 1 }}>
                <Text variant="bodyMd" style={{ color: category ? colors.onSurface : colors.outline }} numberOfLines={1}>
                  {category ? category.name : 'Select'}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-down" size={20} color={colors.outline} />
            </TouchableOpacity>
            {errors.category && (
              <Text variant="labelSm" style={{ color: colors.error, marginTop: 4 }}>{errors.category}</Text>
            )}
          </View>

          <View style={{ width: spacing.md }} />

          {/* Date Picker Trigger */}
          <View style={styles.halfField}>
            <Text variant="labelMd" style={{ color: colors.onSurfaceVariant, marginBottom: 8, fontWeight: '500', letterSpacing: 0.1 }}>DATE</Text>
            <TouchableOpacity 
              style={[
                styles.fieldTrigger, 
                { backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.md, padding: spacing.md }
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={{ flex: 1 }}>
                <Text variant="bodyMd" style={{ color: colors.onSurface }} numberOfLines={1}>
                  {format(date, 'MMM d, yyyy')}
                </Text>
              </View>
              <MaterialCommunityIcons name="calendar" size={20} color={colors.outline} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Note Input */}
        <View style={{ marginTop: spacing.xl }}>
          <Input 
            label="NOTE"
            value={description}
            onChangeText={setDescription}
            placeholder="Add a note (optional)"
            multiline
            numberOfLines={3}
            maxLength={200}
          />
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Button 
            title="Save Transaction" 
            onPress={handleSave} 
            loading={isSaving}
          />
          
          {mode === 'edit' && (
            <Button 
              title="Delete Transaction" 
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
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction?"
        confirmLabel="Delete"
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
    marginBottom: 32,
    alignItems: 'center',
  },
  centeredLabel: {
    marginBottom: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
  },
  amountInputLarge: {
    fontSize: 44,
    fontWeight: '700',
    minWidth: 120,
    height: 60,
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 52,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  halfField: {
    flex: 1,
  },
  fieldTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
