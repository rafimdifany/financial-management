import React, { useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  FlatList, 
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { Text } from '../common/Text';
import { CategoryIcon } from '../common/CategoryIcon';
import { Category } from '../../types/category';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInUp, 
  SlideOutDown 
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: Category) => void;
  selectedId?: number;
  type: 'income' | 'expense';
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CategoryPicker: React.FC<Props> = ({ 
  visible, 
  onClose, 
  onSelect, 
  selectedId,
  type 
}) => {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    if (visible) {
      fetchCategories();
    }
  }, [visible]);

  const filteredCategories = categories.filter(c => c.type === type);

  const renderItem = ({ item }: { item: Category }) => {
    const isSelected = item.id === selectedId;

    return (
      <TouchableOpacity 
        style={styles.categoryItem}
        onPress={() => {
          onSelect(item);
          onClose();
        }}
      >
        <View style={[
          styles.iconContainer,
          isSelected && { 
            borderWidth: 2, 
            borderColor: colors.primary,
            padding: 2
          },
          { borderRadius: radius.full }
        ]}>
          <CategoryIcon 
            icon={item.icon} 
            color={item.color} 
            size={28}
          />
        </View>
        <Text 
          variant="labelMd" 
          style={[
            styles.categoryName,
            { color: isSelected ? colors.primary : colors.onSurface }
          ]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut}
          style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
        >
          <TouchableWithoutFeedback>
            <Animated.View 
              entering={SlideInUp}
              exiting={SlideOutDown}
              style={[
                styles.content, 
                { 
                  backgroundColor: colors.surface,
                  borderTopLeftRadius: radius.xl,
                  borderTopRightRadius: radius.xl,
                  paddingBottom: insets.bottom + spacing.lg
                }
              ]}
            >
              <View style={[styles.handle, { backgroundColor: colors.outlineVariant }]} />
              
              <View style={styles.header}>
                <Text variant="titleLg">Pilih Kategori</Text>
              </View>

              <FlatList
                data={filteredCategories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={3}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    maxHeight: SCREEN_HEIGHT * 0.7,
    width: '100%',
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  iconContainer: {
    marginBottom: 8,
  },
  categoryName: {
    textAlign: 'center',
  }
});
