import React from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface IconPickerProps {
  selectedIcon: string;
  onSelect: (icon: string) => void;
  color: string;
}

const CATEGORY_ICONS = [
  'cart-outline', 'fast-food-outline', 'bus-outline', 'home-outline',
  'medkit-outline', 'gift-outline', 'school-outline', 'game-controller-outline',
  'airplane-outline', 'shirt-outline', 'barbell-outline', 'car-outline',
  'tv-outline', 'wallet-outline', 'card-outline', 'cash-outline',
  'trending-up-outline', 'trending-down-outline', 'analytics-outline', 'pie-chart-outline',
  'book-outline', 'camera-outline', 'construct-outline', 'heart-outline',
  'paw-outline', 'restaurant-outline', 'storefront-outline', 'water-outline',
  'flash-outline', 'phone-portrait-outline', 'wifi-outline', 'brush-outline',
];

export const IconPicker = ({ selectedIcon, onSelect, color }: IconPickerProps) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={styles.container}>
      {CATEGORY_ICONS.map((icon) => {
        const isSelected = selectedIcon === icon;
        return (
          <TouchableOpacity
            key={icon}
            onPress={() => onSelect(icon)}
            style={[
              styles.iconItem,
              { 
                backgroundColor: isSelected ? color + '20' : colors.surfaceContainerLow,
                borderRadius: radius.md,
                margin: spacing.xs,
              }
            ]}
          >
            <Ionicons 
              name={icon as any} 
              size={24} 
              color={isSelected ? color : colors.onSurfaceVariant} 
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconItem: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
