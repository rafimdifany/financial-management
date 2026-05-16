import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';

export const ThemeSwitcher = () => {
  const { theme, setTheme, colors, radius } = useTheme();

  const options = [
    { id: 'light', icon: 'sunny' },
    { id: 'dark', icon: 'moon' },
    { id: 'system', icon: 'phone-portrait' },
  ] as const;

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.full }]}>
      {options.map((option) => {
        const isSelected = theme === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => setTheme(option.id as any)}
            style={[
              styles.option,
              isSelected && { 
                backgroundColor: colors.primary, 
                borderRadius: radius.full,
                // Add subtle shadow for selected state
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2
              }
            ]}
          >
            <Ionicons 
              name={isSelected ? (option.icon as any) : (`${option.icon}-outline` as any)} 
              size={18} 
              color={isSelected ? colors.onPrimary : colors.onSurfaceVariant} 
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
    padding: 4,
    height: 36,
    width: 120,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
