import { useViewMode } from "@/context/ViewModeContext";
import { getFaq } from "@/service/general";
import { getMyData } from "@/service/user";
import { globalStyles } from "@/styles/global";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import HeaderPopUp from "./headerInfoPop";
import { MFDefaultInfoModal, MFLogoutModal } from "./modal";

export default function MFMainHeader({
  themeColors,
  theme,
  toggleTheme,
  isOpen,
  setIsOpen,
}: {
  themeColors: any;
  theme: string;
  toggleTheme: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const { viewMode, companyData } = useViewMode();
  const [isLoading, setIsLoading] = useState<boolean>(false),
    [user, setUser] = useState<any>(),
    [faq, setFaq] = useState<any>(),
    [warningVisible, setWarningVisible] = useState<boolean>(false);

  async function getUserData() {
    setIsLoading(true);
    try {
      const y = await SecureStore.getItemAsync("userId");
      const z = await SecureStore.getItemAsync("userToken");

      if (y && z) {
        const data: any = await getMyData({ token: z });
        const gettheFaq: any = await getFaq();

        setFaq(gettheFaq);

        if (!!data) {
          setUser({
            id: data?.user?.id,
            type: data?.typeId,
            email: data?.user?.email,
            name: data?.user?.client?.name,
            nick: data?.user?.client?.nick,
            photo: data?.user?.client?.photo,
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

  async function Logout() {
    try {
      console.log("🚪 LOGOUT - Iniciando logout...");
      setIsLoading(true);

      // Verificar se tem companyId antes de deletar
      const companyId = await SecureStore.getItemAsync("userCompanyId");
      if (companyId) {
        console.log("🏢 LOGOUT - CompanyId encontrado:", companyId);
      } else {
        console.log("❌ LOGOUT - Nenhum companyId encontrado");
      }

      console.log("🗑️ LOGOUT - Excluindo dados do SecureStore...");
      const keysToDelete = ["userToken", "userName", "userType", "userId", "userCompanyId", "viewMode"];
      await Promise.all(
        keysToDelete.map((key) => SecureStore.deleteItemAsync(key))
      );
      console.log("✅ LOGOUT - Todos os dados removidos (incluindo companyId)!");

      setIsLoading(false);
      router.replace("/(auth)");
    } catch (error) {
      console.error("❌ LOGOUT - Erro ao limpar SecureStore:", error);
      setIsLoading(false);
    }
  }

  function onOpenChange() {
    setIsOpen(!isOpen);
  }

  function onOpenWarning() {
    setWarningVisible(true);
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <View
      style={[globalStyles.header, { backgroundColor: themeColors.primary }]}
    >
      {warningVisible && (
        <MFLogoutModal
          warningVisible={warningVisible}
          themeColors={themeColors}
          text={"Deseja sair da conta?"}
          onPress={() => Logout()}
          close={() => setWarningVisible(false)}
          isLoading={isLoading}
        ></MFLogoutModal>
      )}
      <TouchableOpacity
        onPress={(e: any) => {
          e.stopPropagation();
          onOpenChange();
        }}
      >
        {isOpen ? (
          <AntDesign name="menu-unfold" size={28} color={themeColors?.white} />
        ) : (
          <AntDesign name="menu-fold" size={28} color={themeColors?.white} />
        )}
      </TouchableOpacity>
      <View style={globalStyles.headerImageBox}>
        <Image
          style={globalStyles.headerLogo}
          source={require("@/assets/images/eai-bora/logo/eai_bora_h_b.png")}
        />
      </View>
      {isOpen && (
        <MFDefaultInfoModal
          themeColors={themeColors}
          close={() => setIsOpen(false)}
          warningVisible={isOpen}
        >
          <HeaderPopUp
            globalStyles={globalStyles}
            themeColors={themeColors}
            theme={theme}
            toggleTheme={toggleTheme}
            user={user}
            isLoading={isLoading}
            onOpenChange={onOpenChange}
            onOpenWarning={onOpenWarning}
            faq={faq}
          ></HeaderPopUp>
        </MFDefaultInfoModal>
      )}
      <View
        style={{
          flexDirection: "row",
          gap: 15,
          position: "absolute",
          right: 15,
          zIndex: 10,
        }}
      >
        {/* Botão de Notificações */}
        <TouchableOpacity
          onPress={() => {
            // TODO: Implementar página de notificações
          }}
        >
          <AntDesign name="bells" size={28} color={themeColors.white} />
        </TouchableOpacity>

        {/* Botão de Mensagens/Chat */}
        <TouchableOpacity
          onPress={() => {
            // TODO: Implementar página de chat
          }}
        >
          <AntDesign name="message1" size={28} color={themeColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
