import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { 
  useFonts,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_500Medium,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";

import { ThemeProvider } from "./src/constants/theme";
import { useDatabase } from "./src/hooks/useDatabase";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Bold": PlusJakartaSans_700Bold,
    "PlusJakartaSans-SemiBold": PlusJakartaSans_600SemiBold,
    "PlusJakartaSans-Medium": PlusJakartaSans_500Medium,
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
  });

  const { isReady: dbReady, error: dbError } = useDatabase();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && (dbReady || dbError)) {
      // This tells the splash screen to hide immediately!
      // We do this when the RootNavigator/SplashScreen is ready to be rendered
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, dbReady, dbError]);

  if (!fontsLoaded || (!dbReady && !dbError)) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <View style={styles.container} onLayout={onLayoutRootView}>
            <StatusBar style="auto" />
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </View>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
