import { useViewMode } from "@/context/ViewModeContext";
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MFDefaultCard } from "./cards";

export default function HeaderPopUp({
  globalStyles,
  themeColors,
  theme,
  toggleTheme,
  user,
  isLoading,
  onOpenChange,
  onOpenWarning,
  faq,
}: {
  globalStyles: any;
  themeColors: any;
  faq: any;
  theme: string;
  toggleTheme: () => void;
  onOpenChange: () => void;
  onOpenWarning: () => void;
  user: any;
  isLoading: boolean;
}) {
  const [opennedFaq, setOppenedFaq] = useState<number | null>(null),
    appName = Constants.expoConfig?.name,
    appVersion = Constants.expoConfig?.version,
    appVersionStatus = "",
    createdBy = "BAY Digital Services",
    policyPrivacy =
      "https://github.com/rafael0liveira9/React_Native_My_Fit_Club/blob/master/privacy-policy.txt",
    createdByUrl = "https://www.linkedin.com/in/rafael-oliveira-18934a160/";

  const { viewMode, setViewMode, hasCompany } = useViewMode();

  return (
    <View style={globalStyles.headerInfoBox}>
      <TouchableWithoutFeedback>
        <MFDefaultCard themeColors={themeColors} withoutPadding={true}>
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            {/* Header com Avatar e Info do Usuário */}
            <View
              style={[
                styles.userHeader,
                {
                  backgroundColor: `${themeColors.primary}15`,
                  borderBottomColor: themeColors.primary,
                },
              ]}
            >
              <View
                style={[
                  styles.avatarCircle,
                  { backgroundColor: themeColors.primary },
                ]}
              >
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text
                  style={[styles.userName, { color: themeColors.text }]}
                  numberOfLines={1}
                >
                  {user?.name || "Usuário"}
                </Text>
                <Text
                  style={[
                    styles.userEmail,
                    { color: themeColors.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {user?.email}
                </Text>
              </View>
            </View>

            {/* Menu de Ações Rápidas */}
            <View style={styles.section}>
              <View style={styles.quickActions}>
                <TouchableOpacity
                  style={[
                    styles.quickActionCard,
                    {
                      backgroundColor: themeColors.secondary,
                      borderColor: themeColors.border,
                    },
                  ]}
                  onPress={() => {
                    onOpenChange();
                    router.push("/(stack)/profile/page");
                  }}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: `${themeColors.primary}20` },
                    ]}
                  >
                    <MaterialIcons
                      name="edit"
                      size={20}
                      color={themeColors.primary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.quickActionText,
                      { color: themeColors.text },
                    ]}
                  >
                    Editar Perfil
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.quickActionCard,
                    {
                      backgroundColor: themeColors.secondary,
                      borderColor: themeColors.border,
                    },
                  ]}
                  onPress={toggleTheme}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: `${themeColors.orange}20` },
                    ]}
                  >
                    {theme === "dark" ? (
                      <Ionicons
                        name="moon"
                        size={20}
                        color={themeColors.orange}
                      />
                    ) : (
                      <Ionicons
                        name="sunny"
                        size={20}
                        color={themeColors.orange}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.quickActionText,
                      { color: themeColors.text },
                    ]}
                  >
                    {theme === "dark" ? "Modo Escuro" : "Modo Claro"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Modo de Visualização - Só aparece se tiver empresa */}
            {hasCompany && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="swap-horizontal"
                    size={20}
                    color={themeColors.primary}
                  />
                  <Text
                    style={[styles.sectionTitle, { color: themeColors.text }]}
                  >
                    Modo de Visualização
                  </Text>
                </View>

                <View style={styles.viewModeContainer}>
                  <TouchableOpacity
                    onPress={() => setViewMode("client")}
                    style={[
                      styles.viewModeOption,
                      {
                        backgroundColor:
                          viewMode === "client"
                            ? themeColors.primary
                            : themeColors.secondary,
                        borderColor:
                          viewMode === "client"
                            ? themeColors.primary
                            : themeColors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        {
                          borderColor:
                            viewMode === "client" ? "#fff" : themeColors.border,
                        },
                      ]}
                    >
                      {viewMode === "client" && (
                        <View
                          style={[
                            styles.radioCircleInner,
                            { backgroundColor: "#fff" },
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.viewModeContent}>
                      <Ionicons
                        name="person"
                        size={24}
                        color={
                          viewMode === "client" ? "#fff" : themeColors.text
                        }
                      />
                      <View style={styles.viewModeTextBox}>
                        <Text
                          style={[
                            styles.viewModeTitle,
                            {
                              color:
                                viewMode === "client"
                                  ? "#fff"
                                  : themeColors.text,
                            },
                          ]}
                        >
                          Cliente
                        </Text>
                        <Text
                          style={[
                            styles.viewModeDescription,
                            {
                              color:
                                viewMode === "client"
                                  ? "rgba(255,255,255,0.8)"
                                  : themeColors.textSecondary,
                            },
                          ]}
                        >
                          Visualização pessoal
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setViewMode("company")}
                    style={[
                      styles.viewModeOption,
                      {
                        backgroundColor:
                          viewMode === "company"
                            ? themeColors.primary
                            : themeColors.secondary,
                        borderColor:
                          viewMode === "company"
                            ? themeColors.primary
                            : themeColors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        {
                          borderColor:
                            viewMode === "company"
                              ? "#fff"
                              : themeColors.border,
                        },
                      ]}
                    >
                      {viewMode === "company" && (
                        <View
                          style={[
                            styles.radioCircleInner,
                            { backgroundColor: "#fff" },
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.viewModeContent}>
                      <MaterialIcons
                        name="business"
                        size={24}
                        color={
                          viewMode === "company" ? "#fff" : themeColors.text
                        }
                      />
                      <View style={styles.viewModeTextBox}>
                        <Text
                          style={[
                            styles.viewModeTitle,
                            {
                              color:
                                viewMode === "company"
                                  ? "#fff"
                                  : themeColors.text,
                            },
                          ]}
                        >
                          Empresa
                        </Text>
                        <Text
                          style={[
                            styles.viewModeDescription,
                            {
                              color:
                                viewMode === "company"
                                  ? "rgba(255,255,255,0.8)"
                                  : themeColors.textSecondary,
                            },
                          ]}
                        >
                          Gestão empresarial
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Sobre o App */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="information-circle"
                  size={20}
                  color={themeColors.primary}
                />
                <Text
                  style={[styles.sectionTitle, { color: themeColors.text }]}
                >
                  Sobre o App
                </Text>
              </View>

              <View
                style={[
                  styles.infoCard,
                  {
                    backgroundColor: themeColors.secondary,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <View style={styles.infoRow}>
                  <View style={styles.infoIconBox}>
                    <Feather
                      name="smartphone"
                      size={18}
                      color={themeColors.primary}
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      Nome
                    </Text>
                    <Text
                      style={[styles.infoValue, { color: themeColors.text }]}
                    >
                      {appName}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: themeColors.border },
                  ]}
                />

                <View style={styles.infoRow}>
                  <View style={styles.infoIconBox}>
                    <Octicons
                      name="number"
                      size={18}
                      color={themeColors.primary}
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      Versão
                    </Text>
                    <Text
                      style={[styles.infoValue, { color: themeColors.text }]}
                    >
                      {appVersionStatus} {appVersion}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: themeColors.border },
                  ]}
                />

                <TouchableOpacity
                  onPress={() => Linking.openURL(createdByUrl)}
                  style={styles.infoRow}
                >
                  <View style={styles.infoIconBox}>
                    <MaterialCommunityIcons
                      name="account-heart"
                      size={18}
                      color={themeColors.primary}
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      Desenvolvido por
                    </Text>
                    <Text
                      style={[styles.infoValue, { color: themeColors.info }]}
                    >
                      {createdBy}
                    </Text>
                  </View>
                  <Feather
                    name="external-link"
                    size={16}
                    color={themeColors.info}
                  />
                </TouchableOpacity>

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: themeColors.border },
                  ]}
                />

                <TouchableOpacity
                  onPress={() => Linking.openURL(policyPrivacy)}
                  style={styles.infoRow}
                >
                  <View style={styles.infoIconBox}>
                    <MaterialIcons
                      name="privacy-tip"
                      size={18}
                      color={themeColors.primary}
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      Política de Privacidade
                    </Text>
                  </View>
                  <Feather
                    name="external-link"
                    size={16}
                    color={themeColors.info}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* FAQ */}
            {!!faq && Array.isArray(faq) && faq.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <FontAwesome
                    name="question-circle"
                    size={20}
                    color={themeColors.primary}
                  />
                  <Text
                    style={[styles.sectionTitle, { color: themeColors.text }]}
                  >
                    Perguntas Frequentes
                  </Text>
                </View>

                <View style={styles.faqContainer}>
                  {faq.map((e: any) => (
                    <Pressable
                      key={e.id}
                      onPress={() =>
                        setOppenedFaq(opennedFaq === e.id ? null : e.id)
                      }
                      style={[
                        styles.faqItem,
                        {
                          backgroundColor: themeColors.secondary,
                          borderColor:
                            opennedFaq === e.id
                              ? themeColors.primary
                              : themeColors.border,
                        },
                      ]}
                    >
                      <View style={styles.faqQuestion}>
                        <View style={styles.faqQuestionLeft}>
                          <View
                            style={[
                              styles.faqIconBox,
                              {
                                backgroundColor:
                                  opennedFaq === e.id
                                    ? `${themeColors.primary}20`
                                    : `${themeColors.primary}10`,
                              },
                            ]}
                          >
                            {opennedFaq === e.id ? (
                              <AntDesign
                                name="minus"
                                size={16}
                                color={themeColors.primary}
                              />
                            ) : (
                              <AntDesign
                                name="plus"
                                size={16}
                                color={themeColors.primary}
                              />
                            )}
                          </View>
                          <Text
                            style={[
                              styles.faqQuestionText,
                              { color: themeColors.text },
                            ]}
                          >
                            {e.question}
                          </Text>
                        </View>
                      </View>
                      {opennedFaq === e.id && (
                        <View
                          style={[
                            styles.faqAnswer,
                            {
                              backgroundColor: `${themeColors.primary}08`,
                              borderTopColor: themeColors.border,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.faqAnswerText,
                              { color: themeColors.textSecondary },
                            ]}
                          >
                            {e.answer}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Botão Sair */}
            <TouchableOpacity
              onPress={onOpenWarning}
              style={[
                styles.logoutButton,
                {
                  backgroundColor: `${themeColors.danger}15`,
                  borderColor: themeColors.danger,
                },
              ]}
            >
              <MaterialIcons
                name="logout"
                size={20}
                color={themeColors.danger}
              />
              <Text style={[styles.logoutText, { color: themeColors.danger }]}>
                Sair da Conta
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </MFDefaultCard>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 20,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderBottomWidth: 3,
    gap: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  faqContainer: {
    gap: 12,
  },
  faqItem: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  faqQuestion: {
    padding: 16,
  },
  faqQuestionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  faqIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
  },
  viewModeContainer: {
    gap: 12,
  },
  viewModeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  viewModeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  viewModeTextBox: {
    flex: 1,
  },
  viewModeTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  viewModeDescription: {
    fontSize: 12,
  },
});
