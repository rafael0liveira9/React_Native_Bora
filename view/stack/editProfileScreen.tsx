import {
  MFDateInputText2,
  MFLongTextInput,
  MFSelectInput,
  MFTextInput,
} from "@/components/eai-bora-ui/inputs";
import MFStackEditSubtitle from "@/components/eai-bora-ui/stackEditSubtitle";
import MFStackHeader from "@/components/eai-bora-ui/stackHeader";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import {
  cellPhoneRegex,
  cpfFormat,
  cpfRegex,
  emailRegex,
  getErrorText,
  phoneFormat,
} from "@/controllers/utils";
import { EditUserBody } from "@/model/user";
import { getAllGenders } from "@/service/genders";
import { getMyData, update } from "@/service/user";
import { profileStyles } from "@/styles/profile";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function EditProfileScreen() {
  const { theme } = useTheme(),
    themeColors = Colors[`${theme}`],
    router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false),
    [isSaveLoading, setIsSaveLoading] = useState<boolean>(false),
    [errors, setErrors] = useState<string[]>([]),
    [name, setName] = useState<string>(),
    [email, setEmail] = useState<string>(),
    [description, setDescription] = useState<string>(),
    [document, setDocument] = useState<string>(),
    [nick, setNick] = useState<string>(),
    [phone, setPhone] = useState<string>(),
    [gender, setGender] = useState<string>(),
    [birthDate, setBirthDate] = useState<string>(),
    [instagram, setInstagram] = useState<string>(),
    [genderOptions, setGenderOptions] = useState<
      { label: string; value: string }[]
    >([]),
    [user, setUser] = useState<{ id: number; type: number }>();

  async function loadGenders() {
    try {
      const data: any = await getAllGenders();

      if (data?.genders && Array.isArray(data.genders)) {
        const options = data.genders.map((g: any) => ({
          label: g.name,
          value: g.id.toString(),
        }));
        setGenderOptions(options);
      }
    } catch (error) {
      console.error("Erro ao carregar gêneros:", error);
    }
  }

  async function getUserData() {
    setIsLoading(true);
    try {
      const y = await SecureStore.getItemAsync("userId");
      const z = await SecureStore.getItemAsync("userToken");

      if (y && z) {
        const data: any = await getMyData({ token: z });

        if (!!data) {
          setName(data?.user?.client?.name);
          setEmail(data?.user?.email);
          setDescription(data?.user?.client?.description);
          setNick(data?.user?.client?.nick);
          setPhone(
            data?.user?.client?.phone
              ? phoneFormat(data?.user?.client?.phone)
              : ""
          );
          setInstagram(data?.user?.client?.instagram);
          setGender(data?.user?.client?.gender?.toString() || "0");
          setDocument(
            data?.user?.client?.document
              ? cpfFormat(data?.user?.client?.document)
              : ""
          );
          setBirthDate(data?.user?.client?.birthDate);
          setUser({
            id: data?.user?.id,
            type: data?.typeId,
          });
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro ao recuperar usuário:", error);
      setIsLoading(false);
      return null;
    }
  }

  function errorCheck() {
    let updatedErrors = [];

    if (name && name.length < 3) {
      updatedErrors.push("name");
    }
    if (email && email.length > 0) {
      if (!emailRegex.test(email)) {
        updatedErrors.push("email");
      }
    }

    if (document && document.length > 0) {
      if (!cpfRegex.test(document)) {
        updatedErrors.push("document");
      }
    }
    // if (cnpj && cnpj.length > 0) {
    //   const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    //   if (!cnpjRegex.test(cnpj)) {
    //     updatedErrors.push("cnpj");
    //   }
    // }

    if (phone && phone.length > 0) {
      if (!cellPhoneRegex.test(phone)) {
        updatedErrors.push("phone");
      }
    }

    setErrors(updatedErrors);
  }

  async function handleSubmit() {
    const x: EditUserBody = {
      name: name,
      description: description,
      nick: nick,
      phone: phone?.replace(/\D/g, ""),
      instagram: instagram,
      gender: parseInt(gender!),
      birthDate: birthDate,
      document: document?.replace(/\D/g, ""),
    };

    setIsSaveLoading(true);
    try {
      const z = await SecureStore.getItemAsync("userToken");

      if (z) {
        const data: any = await update(x, z);

        if (
          !!data &&
          data.message === "Usuário e cliente editados com sucesso"
        ) {
          Toast.show({
            type: "success",
            text1: `✅ Usuário salvo com sucesso.`,
          });

          setIsSaveLoading(false);
          router.replace("/(stack)/profile/page");
        } else {
          Toast.show({
            type: "error",
            text1: `❌ Erro: ${data?.message}`,
          });
        }
        setIsSaveLoading(false);
      }
    } catch (error) {
      console.error("Erro ao recuperar usuário:", error);
      setIsLoading(false);
      return null;
    }
  }

  useEffect(() => {
    loadGenders();
    getUserData();
  }, []);

  useEffect(() => {
    errorCheck();
  }, [name, document, phone]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: themeColors.background,
        }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <MFStackHeader
          title="Editar dados"
          isLoading={isSaveLoading}
          onPress={handleSubmit}
        ></MFStackHeader>
        {isLoading ? (
          <View
            style={{
              height: "100%",
              minHeight: 500,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={40} color={themeColors.primary} />
          </View>
        ) : (
          <View style={profileStyles.profileEditBox}>
            {/* Banner Informativo */}
            <View
              style={[
                styles.infoBanner,
                {
                  backgroundColor: `${themeColors.primary}15`,
                  borderLeftColor: themeColors.primary,
                },
              ]}
            >
              <Ionicons name="information-circle" size={20} color={themeColors.primary} />
              <Text style={[styles.infoBannerText, { color: themeColors.text }]}>
                Mantenha seus dados atualizados para uma melhor experiência
              </Text>
            </View>

            {/* Seção: Dados Pessoais */}
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: themeColors.secondary,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <FontAwesome name="user-circle" size={24} color={themeColors.primary} />
                <View style={styles.sectionHeaderText}>
                  <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                    Dados Pessoais
                  </Text>
                  <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>
                    Informações básicas do seu perfil
                  </Text>
                </View>
              </View>
            <MFTextInput
              label="Nome: "
              labelIcon={
                <FontAwesome name="user" size={16} color={themeColors.text} />
              }
              themeColors={themeColors}
              placeholder="Digite o nome"
              value={name}
              onChangeText={setName}
              error={
                name && name.length > 0
                  ? errors.includes("name")
                    ? getErrorText("name")
                    : ""
                  : "Preencha com um nome"
              }
            ></MFTextInput>
            <MFTextInput
              isNumeric={true}
              label="CPF: "
              labelIcon={
                <Ionicons
                  name="document-lock"
                  size={16}
                  color={themeColors.text}
                />
              }
              themeColors={themeColors}
              placeholder="Digite o documento"
              value={document}
              onChangeText={(text: string) => {
                if (text) {
                  setDocument(cpfFormat(text.toString()));
                } else {
                  setDocument("");
                }
              }}
              error={
                document && document.length > 0
                  ? errors.includes("document")
                    ? getErrorText("document")
                    : ""
                  : "Preencha com um documento válido"
              }
            ></MFTextInput>
            <MFTextInput
              label="Apelido: "
              labelIcon={
                <FontAwesome
                  name="user-secret"
                  size={16}
                  color={themeColors.text}
                />
              }
              themeColors={themeColors}
              placeholder="Digite o apelido"
              value={nick}
              onChangeText={setNick}
              error={nick && nick.length > 0 ? "" : "Preencha com um apelido."}
            ></MFTextInput>
            <MFSelectInput
              label="Gênero"
              labelIcon={
                <FontAwesome5
                  name="transgender"
                  size={16}
                  color={themeColors.text}
                />
              }
              selectedValue={gender || "0"}
              onValueChange={setGender}
              options={[
                { label: "Selecione...", value: "0" },
                ...genderOptions,
              ]}
              themeColors={Colors[theme]}
              isDisabled={false}
              error={!gender || gender === "0" ? "Preencha o seu gênero." : ""}
            />
            <MFDateInputText2
              label="Data de Nascimento"
              labelIcon={
                <FontAwesome
                  name="birthday-cake"
                  size={16}
                  color={themeColors.text}
                />
              }
              value={birthDate || ""}
              onChange={setBirthDate}
              error={birthDate ? "" : "Preencha com a Data de Nascimento."}
              themeColors={themeColors}
            />
            <MFLongTextInput
              label="Sobre mim: "
              labelIcon={
                <FontAwesome
                  name="paragraph"
                  size={16}
                  color={themeColors.text}
                />
              }
              themeColors={themeColors}
              placeholder="Digite aqui"
              value={description}
              onChangeText={setDescription}
              error={description ? "" : "Escreva um pouco sobre você."}
            ></MFLongTextInput>
            </View>

            {/* Seção: Dados de Contato */}
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: themeColors.secondary,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <MaterialIcons name="contact-phone" size={24} color={themeColors.primary} />
                <View style={styles.sectionHeaderText}>
                  <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                    Dados de Contato
                  </Text>
                  <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>
                    Como as pessoas podem te encontrar
                  </Text>
                </View>
              </View>
            <MFTextInput
              isDisabled={true}
              label="E-mail: "
              labelIcon={
                <MaterialIcons
                  name="email"
                  size={16}
                  color={themeColors.text}
                />
              }
              themeColors={themeColors}
              placeholder="Digite o e-mail"
              value={email}
            ></MFTextInput>
            <MFTextInput
              label="Whatsapp: "
              isNumeric={true}
              labelIcon={
                <FontAwesome5
                  name="whatsapp-square"
                  size={16}
                  color={themeColors.text}
                />
              }
              themeColors={themeColors}
              placeholder="Digite o whatsapp"
              value={phone}
              onChangeText={(text: string) => {
                if (text) {
                  setPhone(phoneFormat(text.toString()));
                } else {
                  setPhone("");
                }
              }}
              error={
                phone && phone.length > 0
                  ? errors.includes("phone")
                    ? getErrorText("phone")
                    : ""
                  : "Preencha com o Whatsapp."
              }
            ></MFTextInput>
            <MFTextInput
              label="Instagram: "
              labelIcon={
                <Entypo
                  name="instagram-with-circle"
                  size={16}
                  color={themeColors.text}
                />
              }
              themeColors={themeColors}
              placeholder="Digite o e-mail"
              value={instagram}
              onChangeText={setInstagram}
              error={instagram ? "" : "Preencha com o Instagram."}
            ></MFTextInput>
            </View>

            <View style={{ height: 30 }}></View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    gap: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionCard: {
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150, 150, 150, 0.1)",
  },
  sectionHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
});
