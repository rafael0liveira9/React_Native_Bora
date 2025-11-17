import { HelloWave } from "@/components/HelloWave";
import {
  MFPrimaryButton,
  MFInfoButton,
} from "@/components/eai-bora-ui/buttons";
import { MFDefaultCard } from "@/components/eai-bora-ui/cards";
import { MFTextInput, MFPasswordInput } from "@/components/eai-bora-ui/inputs";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { resetPassword } from "@/service/user";
import { authStyles } from "@/styles/auth";
import { globalStyles } from "@/styles/global";
import { router, useLocalSearchParams } from "expo-router";
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

export default function ResetPasswordScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>((params.email as string) || "");
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const themeColors = Colors[theme];

  async function handleResetPassword() {
    if (
      email.length == 0 ||
      code.length == 0 ||
      newPassword.length == 0 ||
      confirmPassword.length == 0
    ) {
      Toast.show({
        type: "error",
        text1: "❌ Atenção, preencha todos os campos.",
      });
      return null;
    }

    if (newPassword.length < 4) {
      Toast.show({
        type: "error",
        text1: "❌ A senha deve ter no mínimo 4 caracteres.",
      });
      return null;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "❌ As senhas não coincidem.",
      });
      return null;
    }

    setIsLoading(true);
    Keyboard.dismiss();
    const res = await resetPassword(email, code, newPassword);

    if (res?.message === "Senha redefinida com sucesso.") {
      setIsLoading(false);
      Toast.show({
        type: "success",
        text1: "✅ Senha alterada com sucesso!",
        text2: "Faça login com sua nova senha",
      });

      // Navigate back to login
      router.replace("/(auth)");
    } else {
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: `❌ ${res?.message || "Erro ao redefinir senha"}`,
      });
    }
  }

  function handleBackToLogin() {
    router.replace("/(auth)");
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
            Nova senha 🔐<HelloWave></HelloWave>
          </Text>
          <Text
            style={[authStyles.subtitle, { color: themeColors.textSecondary }]}
          >
            Digite o código recebido e sua nova senha.
          </Text>
        </View>

        <MFTextInput
          themeColors={themeColors}
          placeholder="E-mail..."
          value={email}
          onChangeText={setEmail}
          error=""
        ></MFTextInput>

        <MFTextInput
          themeColors={themeColors}
          placeholder="Código de recuperação..."
          value={code}
          onChangeText={setCode}
          error=""
        ></MFTextInput>

        <MFPasswordInput
          themeColors={themeColors}
          placeholder="Nova senha..."
          value={newPassword}
          onChangeText={setNewPassword}
          error=""
        ></MFPasswordInput>

        <MFPasswordInput
          themeColors={themeColors}
          placeholder="Confirmar senha..."
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error=""
        ></MFPasswordInput>

        <View style={{ width: "80%", paddingTop: 10 }}>
          <MFPrimaryButton
            title="Redefinir senha"
            onPress={handleResetPassword}
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
