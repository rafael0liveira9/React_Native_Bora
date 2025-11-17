import { HelloWave } from "@/components/HelloWave";
import {
  MFPrimaryButton,
  MFInfoButton,
} from "@/components/eai-bora-ui/buttons";
import { MFDefaultCard } from "@/components/eai-bora-ui/cards";
import { MFTextInput } from "@/components/eai-bora-ui/inputs";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { forgotPassword } from "@/service/user";
import { authStyles } from "@/styles/auth";
import { globalStyles } from "@/styles/global";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ForgotPasswordScreen() {
  const { theme } = useTheme(),
    [isLoading, setIsLoading] = useState<boolean>(false),
    [email, setEmail] = useState<string>("");

  const themeColors = Colors[theme];

  async function handleForgotPassword() {
    if (email.length == 0) {
      Toast.show({
        type: "error",
        text1: "❌ Atenção, preencha o e-mail.",
      });
      return null;
    }

    setIsLoading(true);
    Keyboard.dismiss();
    const res = await forgotPassword(email);

    if (res?.message === "Código de recuperação enviado." || res?.code) {
      setIsLoading(false);
      Toast.show({
        type: "success",
        text1: "✅ Código enviado!",
        text2: res?.code ? `Código: ${res.code}` : "Verifique seu e-mail",
      });

      // Navigate to reset password screen with email
      router.push({
        pathname: "./reset-password",
        params: { email },
      });
    } else {
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: `❌ ${res?.message || "Erro ao enviar código"}`,
      });
    }
  }

  function handleBackToLogin() {
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={[
        authStyles.container,
        { backgroundColor: themeColors.background },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <MFDefaultCard themeColors={themeColors}>
        <View
          style={[
            authStyles.imageBox,
            {
              paddingBottom: 10,
            },
          ]}
        >
          <Image
            style={authStyles.mflogo}
            source={require(`@/assets/images/eai-bora/logo/eai_bora_v_br.png`)}
          />
        </View>
        <View
          style={[
            globalStyles.flexc,
            {
              width: "100%",
              justifyContent: "center",
              alignItems: "flex-start",
            },
          ]}
        >
          <Text style={[authStyles.title, { color: themeColors.text }]}>
            Recuperar senha 🔑<HelloWave></HelloWave>
          </Text>
          <Text
            style={[authStyles.subtitle, { color: themeColors.textSecondary }]}
          >
            Digite seu e-mail para receber o código de recuperação.
          </Text>
        </View>

        <MFTextInput
          themeColors={themeColors}
          placeholder="E-mail..."
          value={email}
          onChangeText={setEmail}
          error=""
        ></MFTextInput>

        <View style={{ width: "80%", paddingTop: 10 }}>
          <MFPrimaryButton
            title="Enviar código"
            onPress={handleForgotPassword}
            isLoading={isLoading}
            isDisabled={isLoading}
            themeColors={themeColors}
          />
        </View>
        {!isLoading && (
          <View style={{ marginTop: 20 }}>
            <MFInfoButton
              title=""
              themeColors={themeColors}
              text="Voltar para o login"
              onPress={handleBackToLogin}
              isDisabled={isLoading}
            ></MFInfoButton>
          </View>
        )}
      </MFDefaultCard>
    </KeyboardAvoidingView>
  );
}
