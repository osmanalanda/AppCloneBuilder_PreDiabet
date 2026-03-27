import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppDataProvider, useAppData } from "@/providers/AppDataProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isLoggedIn, authLoading } = useAppData();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (authLoading) return;
    const onLoginPage = segments[0] === ('login' as string);
    if (!isLoggedIn && !onLoginPage) {
      router.replace('/login' as any);
    } else if (isLoggedIn && onLoginPage) {
      router.replace('/');
    }
  }, [isLoggedIn, authLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="index" />
      <Stack.Screen name="profil" />
      <Stack.Screen name="bilgilendirme" />
      <Stack.Screen name="bki-hesaplama" />
      <Stack.Screen name="on-testler" />
      <Stack.Screen name="son-testler" />
      <Stack.Screen name="iletisim" />
      <Stack.Screen name="hakkimizda" />
      <Stack.Screen name="sss" />
      <Stack.Screen name="besin-ekle" />
      <Stack.Screen name="besin-gecmisi" />
      <Stack.Screen name="adimsayar" />
      <Stack.Screen name="su-takibi" />
      <Stack.Screen name="kan-sekeri" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppDataProvider>
        <GestureHandlerRootView>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </AppDataProvider>
    </QueryClientProvider>
  );
}
