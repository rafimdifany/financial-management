import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withDelay,
  Easing
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../hooks/useTheme";
import { Text } from "../components/common/Text";
import { RootStackParamList } from "../types/navigation";

const { width } = Dimensions.get("window");

export const SplashScreen = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  useEffect(() => {
    // Start animations
    logoScale.value = withTiming(1, { 
      duration: 800,
      easing: Easing.out(Easing.back(1.5))
    });
    logoOpacity.value = withTiming(1, { duration: 800 });
    
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));

    // Navigate to MainTabs after 2.5 seconds (including animation time)
    const timer = setTimeout(() => {
      navigation.replace("MainTabs");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.centerContent}>
        {/* Subtle glow behind logo */}
        <View 
          style={[
            styles.glow, 
            { 
              backgroundColor: colors.primary,
              opacity: 0.1,
            }
          ]} 
        />
        
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Ionicons name="wallet" size={80} color={colors.primary} />
        </Animated.View>

        <Animated.View style={[styles.textContainer, contentAnimatedStyle]}>
          <Text variant="headlineLg" style={styles.appName}>
            FinPro
          </Text>
          <Text 
            variant="bodyMd" 
            style={[styles.tagline, { color: colors.onSurfaceVariant }]}
          >
            Financial Productivity
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 16,
  },
  textContainer: {
    alignItems: "center",
  },
  appName: {
    marginBottom: 4,
  },
  tagline: {
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: 10, // Overriding for a more "architectural" feel per spec
  },
  glow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    // Note: React Native shadow/blur is limited, but we can use this subtle circle
  },
});
