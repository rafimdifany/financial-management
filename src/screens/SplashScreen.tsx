import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withDelay,
  Easing,
  interpolate,
  Extrapolate
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../hooks/useTheme";
import { Text } from "../components/common/Text";
import { RootStackParamList } from "../types/navigation";
import { WalletIllustration } from "../components/splash/WalletIllustration";

const { width } = Dimensions.get("window");

export const SplashScreen = () => {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Animation values
  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const walletOpening = useSharedValue(0);
  const shieldScale = useSharedValue(0.5);
  const shieldOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(20);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const shieldAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shieldScale.value }],
    opacity: shieldOpacity.value * 0.1, // Subtle background effect
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  useEffect(() => {
    // Stage 1: Shield appears
    shieldOpacity.value = withTiming(1, { duration: 1000 });
    shieldScale.value = withTiming(1, { 
      duration: 1200, 
      easing: Easing.out(Easing.cubic) 
    });

    // Stage 2: Logo (Wallet) appears
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    logoScale.value = withDelay(200, withTiming(1, { 
      duration: 1000,
      easing: Easing.out(Easing.back(1.2))
    }));

    // Stage 3: Wallet opens
    walletOpening.value = withDelay(800, withTiming(1, { 
      duration: 1200,
      easing: Easing.inOut(Easing.quad)
    }));

    // Stage 4: Text slides up
    textOpacity.value = withDelay(1200, withTiming(1, { duration: 800 }));
    textY.value = withDelay(1200, withTiming(0, { 
      duration: 800,
      easing: Easing.out(Easing.cubic)
    }));

    // Navigate to MainTabs
    const timer = setTimeout(() => {
      navigation.replace("MainTabs");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Background Shield/Ambience */}
      <Animated.View style={[styles.shieldContainer, shieldAnimatedStyle]}>
        <Ionicons name="shield-sharp" size={width * 0.8} color={colors.primary} />
      </Animated.View>

      <View style={styles.centerContent}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle, { marginBottom: spacing.xl }]}>
          <WalletIllustration progress={walletOpening} color={colors.primary} size={140} />
        </Animated.View>

        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <Text 
            variant="headlineLg" 
            style={[
              styles.appName, 
              { 
                color: colors.onSurface, 
                marginBottom: spacing.xs,
                letterSpacing: 2,
                textAlign: 'center',
                textTransform: 'uppercase'
              }
            ]}
          >
            Financial Sanctuary
          </Text>
          <View style={[styles.taglineRow, { gap: spacing.sm }]}>
            <View style={[styles.line, { backgroundColor: colors.outlineVariant }]} />
            <Text 
              variant="labelSm" 
              style={[
                styles.tagline, 
                { color: colors.onSurfaceVariant, letterSpacing: 4 }
              ]}
            >
              PRODUCTIVITY SANCTUARY
            </Text>
            <View style={[styles.line, { backgroundColor: colors.outlineVariant }]} />
          </View>
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
  shieldContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  logoContainer: {
    // shadow effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  appName: {
    fontWeight: '900',
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    textTransform: "uppercase",
    fontSize: 9,
  },
  line: {
    height: 1,
    width: 20,
    opacity: 0.5,
  }
});

