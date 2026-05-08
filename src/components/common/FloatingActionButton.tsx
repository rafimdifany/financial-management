import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  interpolate,
  Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FloatingActionButton: React.FC<Props> = ({ onPress, children, style }) => {
  const { colors, spacing, radius, isDark } = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(pressed.value, [0, 1], [1, 0.95]) },
      ],
    };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 200, easing: Easing.bezier(0.4, 0, 0.2, 1) });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 200, easing: Easing.bezier(0.4, 0, 0.2, 1) });
      }}
      style={[styles.fabWrapper, animatedStyle, style]}
    >
      <LinearGradient
        colors={isDark ? [colors.primary, colors.primaryContainer] : ["#006b5f", "#14b8a6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.fab,
          {
            borderRadius: radius.full,
            width: 56,
            height: 56,
          }
        ]}
      >
        {children}
      </LinearGradient>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  fabWrapper: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
