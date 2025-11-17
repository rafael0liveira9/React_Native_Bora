import { ConfettiOverlay } from "@/components/eai-bora-ui/animations";
import { toastConfig } from "@/components/eai-bora-ui/ToastConfig";
import { MFThemeProvider } from "@/context/ThemeContext";
import { ViewModeProvider } from "@/context/ViewModeContext";
import SplashScreen from "@/view/splashScreen";
import { getMyData } from "@/service/user";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Orbitron: require("../assets/fonts/Orbitron-VariableFont_wght.ttf"),
  });
  const router = useRouter();
  const [token, setToken] = useState<string | null>(),
    [theme, setTheme] = useState<string | null>("light"),
    [hasRedirected, setHasRedirected] = useState(false),
    [isReady, setIsReady] = useState(false);

  async function getToken() {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      return token;
    } catch (error) {
      console.error("Erro ao recuperar token:", error);
      return null;
    }
  }

  async function getTheme() {
    try {
      const theme = await SecureStore.getItemAsync("theme");
      return theme;
    } catch (error) {
      console.error("Erro ao recuperar theme:", error);
      return null;
    }
  }

  async function checkIfUserIsBlocked() {
    try {
      const storedToken = await SecureStore.getItemAsync("userToken");

      if (!storedToken) return;

      const userData = await getMyData({ token: storedToken });

      if (userData?.user?.client?.bannedUntil) {
        const now = new Date();
        const bannedUntil = new Date(userData.user.client.bannedUntil);

        if (bannedUntil > now) {
          // Usuário está bloqueado - limpar store e deslogar
          await SecureStore.deleteItemAsync("userToken");
          await SecureStore.deleteItemAsync("userId");

          Toast.show({
            type: "error",
            text1: "Usuário bloqueado",
            text2: `Sua conta está bloqueada até ${bannedUntil.toLocaleDateString("pt-BR")}`,
            visibilityTime: 5000,
          });

          setToken(null);
          router.replace("/(auth)");
        }
      }
    } catch (error) {
      console.error("Erro ao verificar bloqueio:", error);
    }
  }

  useEffect(() => {
    const prepare = async () => {
      try {
        const storedToken = await getToken();
        const storedTheme = await getTheme();
        setToken(storedToken);
        setTheme(storedTheme);
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(true);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (!loaded || !isReady || hasRedirected) return;

    setHasRedirected(true);

    if (token) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)");
    }
  }, [loaded, isReady, token, hasRedirected, router]);

  // Verificar bloqueio periodicamente quando o usuário estiver logado
  useEffect(() => {
    if (!token) return;

    // Verificar imediatamente
    checkIfUserIsBlocked();

    // Verificar a cada 30 segundos
    const interval = setInterval(() => {
      checkIfUserIsBlocked();
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  if (!isReady || !loaded) {
    return <SplashScreen></SplashScreen>;
  }

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} backgroundColor={theme === "dark" ? "#111111" : "#dddddd"} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme === "dark" ? "#111111" : "#dddddd",
        }}
      >
        <MFThemeProvider colorScheme={theme}>
          <ViewModeProvider>
            <ConfettiOverlay />
            <Stack screenOptions={{ headerShown: false }} />
            <Toast
              config={toastConfig}
              position="top"
              topOffset={60}
            />
          </ViewModeProvider>
        </MFThemeProvider>
      </SafeAreaView>
    </>
  );
}
