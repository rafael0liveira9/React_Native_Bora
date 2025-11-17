import {
  MFPrimaryButton,
  MFPrimaryOutlinedButton,
} from "@/components/eai-bora-ui/buttons";
import { MFDefaultCard } from "@/components/eai-bora-ui/cards";
import { MFPasswordInput, MFTextInput } from "@/components/eai-bora-ui/inputs";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { getErrorText } from "@/controllers/utils";
import { register } from "@/service/user";
import { authStyles } from "@/styles/auth";
import { globalStyles } from "@/styles/global";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const { theme } = useTheme(),
    [isLoading, setIsLoading] = useState<boolean>(false),
    [isPasswordVisible, setIsPasswordVisible] = useState(false),
    [errors, setErrors] = useState<string[]>([]),
    [name, setName] = useState<string>(""),
    [email, setEmail] = useState<string>(""),
    [password, setPassword] = useState<string>(""),
    [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const themeColors = Colors[theme];

  async function handleRegister() {
    if (name.length == 0 || password.length == 0 || email.length == 0) {
      Toast.show({
        type: "error",
        text1: "❌ Atenção, preencha todos os campos.",
      });

      if (name.length == 0) {
        Toast.show({
          type: "error",
          text1: "❌ Atenção, preencha o nome.",
        });
      }
      if (password.length == 0) {
        Toast.show({
          type: "error",
          text1: "❌ Atenção, preencha a senha.",
        });
      }
      if (email.length == 0) {
        Toast.show({
          type: "error",
          text1: "❌ Atenção, preencha o e-mail.",
        });
      }

      return null;
    }

    if (errors.length > 0) {
      for (let index = 0; index < errors.length; index++) {
        Toast.show({
          type: "error",
          text1: getErrorText(errors[index]),
        });
      }
      return null;
    }
    setIsLoading(true);
    Keyboard.dismiss();

    const res = await register({ email, password, name });

    if (res?.data) {
      try {
        await SecureStore.setItemAsync(
          "userId",
          res?.data?.user?.id.toString()
        );
        await SecureStore.setItemAsync("userToken", res?.data?.user?.token);
        await SecureStore.setItemAsync("userEmail", res?.data?.user?.email);
        await SecureStore.setItemAsync("userName", res?.data?.client?.name);
        await SecureStore.setItemAsync(
          "userType",
          res?.data?.client?.userType.toString()
        );

        Toast.show({
          type: "success",
          text1: "✅ Cadastro salvo, seja bem-vindo.",
        });

        router.replace("/(tabs)");
      } catch (error) {
        setIsLoading(false);
        console.error("Erro ao salvar token:", error);
      }
    } else {
      setIsLoading(false);

      switch (res?.status) {
        case 302:
          Toast.show({
            type: "error",
            text1: "❌ Endereço já existe.",
          });
          break;
        case 404:
          Toast.show({
            type: "error",
            text1: "❌ Fora do ar, tente mais tarde.",
          });
          break;
        case 500:
          Toast.show({
            type: "error",
            text1: "❌ Fora do ar, tente mais tarde.",
          });
          break;

        default:
          Toast.show({
            type: "error",
            text1: "❌ Ocorreu um erro desconhecido, tente mais tarde.",
          });
          break;
      }
    }
    setIsLoading(false);
  }

  function handleAlready() {
    router.push("./");
  }

  function errorCheck() {
    let updatedErrors = [];

    if (name && name.length < 3) {
      updatedErrors.push("name");
    }
    if (password && password.length < 4) {
      updatedErrors.push("password");
    }
    if (
      password &&
      passwordConfirm &&
      password.length > 0 &&
      passwordConfirm.length > 0
    ) {
      if (password !== passwordConfirm) {
        updatedErrors.push("passwordConfirm");
      }
    }
    if (email && email.length > 0) {
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;

      if (!emailRegex.test(email)) {
        updatedErrors.push("email");
      }
    }

    setErrors(updatedErrors);
  }

  useEffect(() => {
    errorCheck();
  }, [name, password, passwordConfirm, email]);

  return (
    <KeyboardAvoidingView
      style={[
        authStyles.container,
        { backgroundColor: themeColors.background },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
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
                globalStyles.flexr,
                { width: "100%", justifyContent: "flex-start" },
              ]}
            >
              <Text style={[authStyles.title, { color: themeColors.text }]}>
                Cadastre-se
              </Text>
            </View>
            <MFTextInput
              themeColors={themeColors}
              placeholder="Digite o nome"
              value={name}
              onChangeText={setName}
              error={
                name.length > 0 && errors.includes("name")
                  ? getErrorText("name")
                  : ""
              }
            />

            <MFTextInput
              themeColors={themeColors}
              placeholder="Digite o e-mail"
              value={email}
              onChangeText={setEmail}
              error={
                email.length > 0 && errors.includes("email")
                  ? getErrorText("email")
                  : ""
              }
            />

            <MFPasswordInput
              themeColors={themeColors}
              placeholder="Digite uma senha"
              value={password}
              onChangeText={setPassword}
              error={
                password.length > 0 && errors.includes("password")
                  ? getErrorText("password")
                  : ""
              }
            />

            <MFPasswordInput
              themeColors={themeColors}
              placeholder="Confirme a senha"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              error={
                password.length > 0 &&
                passwordConfirm.length > 0 &&
                errors.includes("passwordConfirm")
                  ? getErrorText("passwordConfirm")
                  : ""
              }
            />

            <View style={{ width: "80%", paddingTop: 10 }}>
              <MFPrimaryButton
                title="Salvar"
                onPress={handleRegister}
                isLoading={isLoading}
                isDisabled={false}
                themeColors={themeColors}
              />
            </View>

            <View style={{ width: "80%" }}>
              <MFPrimaryOutlinedButton
                title="Já tenho cadastro"
                onPress={handleAlready}
                isLoading={false}
                isDisabled={false}
                themeColors={themeColors}
              />
            </View>
          </MFDefaultCard>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
