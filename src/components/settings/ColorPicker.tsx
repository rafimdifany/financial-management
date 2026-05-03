import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

const PRESET_COLORS = [
  '#FF5252', // Red
  '#FF4081', // Pink
  '#7C4DFF', // Deep Purple
  '#536DFE', // Indigo
  '#448AFF', // Blue
  '#00BCD4', // Cyan
  '#009688', // Teal
  '#4CAF50', // Green
  '#8BC34A', // Light Green
  '#FFEB3B', // Yellow
  '#FFC107', // Amber
  '#FF9800', // Orange
  '#795548', // Brown
  '#9E9E9E', // Grey
  '#607D8B', // Blue Grey
];

export const ColorPicker = ({ selectedColor, onSelect }: ColorPickerProps) => {
  const { spacing } = useTheme();

  return (
    <View style={styles.container}>
      {PRESET_COLORS.map((color) => {
        const isSelected = selectedColor === color;
        return (
          <TouchableOpacity
            key={color}
            onPress={() => onSelect(color)}
            style={[
              styles.colorCircle,
              { 
                backgroundColor: color,
                margin: spacing.xs,
              }
            ]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={20} color="white" />
            )}
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
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});
