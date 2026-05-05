import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from '../../constants/typography';

interface SettingRowProps {
  label: string;
  value?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  destructive?: boolean;
  rightElement?: React.ReactNode;
}

export const SettingRow = ({ label, value, icon, onPress, destructive, rightElement }: SettingRowProps) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.container,
        {
          paddingVertical: spacing.base,
        }
      ]}
    >
      <View style={styles.left}>
        {icon && (
          <View
            style={[
              styles.iconContainer,
              {
                marginRight: spacing.md,
                backgroundColor: destructive ? `${colors.error}14` : colors.surfaceContainerHigh,
                borderRadius: radius.sm,
              },
            ]}
          >
            <Ionicons name={icon} size={18} color={destructive ? colors.error : colors.primary} />
          </View>
        )}
        <Text
          style={[
            styles.label,
            {
              color: destructive ? colors.error : colors.onSurface,
              fontFamily: Typography.fontFamily.medium,
            }
          ]}
        >
          {label}
        </Text>
      </View>
      
      <View style={styles.right}>
        {value && (
          <Text style={[styles.value, { color: colors.onSurfaceVariant, marginRight: 8 }]}>
            {value}
          </Text>
        )}
        {rightElement}
        {onPress && !rightElement && (
          <Ionicons name="chevron-forward" size={18} color={colors.outline} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.regular,
  },
});
