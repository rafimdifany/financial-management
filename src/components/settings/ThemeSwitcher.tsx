import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';

export const ThemeSwitcher = () => {
  const { theme, setTheme, colors, radius, spacing } = useTheme();

  const options = [
    { id: 'light', label: 'Light', icon: 'sunny-outline' },
    { id: 'dark', label: 'Dark', icon: 'moon-outline' },
  ] as const;

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.full }]}>
      {options.map((option) => {
        const isSelected = theme === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => setTheme(option.id)}
            style={[
              styles.option,
              isSelected && { backgroundColor: colors.primary, borderRadius: radius.full }
            ]}
          >
            <Ionicons 
              name={option.icon} 
              size={18} 
              color={isSelected ? colors.onPrimary : colors.onSurfaceVariant} 
              style={{ marginRight: 8 }}
            />
            <Text 
              style={[
                styles.label, 
                { color: isSelected ? colors.onPrimary : colors.onSurfaceVariant }
              ]}
            >
              {option.label}
            </Text>
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
    height: 48,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.medium,
  },
});
