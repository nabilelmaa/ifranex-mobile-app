import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Image, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-reanimated";
import { ToastProvider } from "@/contexts/ToastContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Freedom-10eM": require("../assets/fonts/Kanit-SemiBold.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
        setAppIsReady(true);
      }, 2000);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (!appIsReady) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width: 72, height: 72 }}
        />

        <View className="flex-grow" />

        <Text className="text-black text-lg font-semibold mb-4">
          Ifane<Text className="text-primaryColor">X</Text>
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <ToastProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(root)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </ToastProvider>
  );
}
