import MFStackEditSubtitle from "@/components/eai-bora-ui/stackEditSubtitle";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { getEventById } from "@/service/events";
import { getUserParticipation, upsertParticipation } from "@/service/participation";
import { globalStyles } from "@/styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function EventDetailsScreen() {
  const { theme } = useTheme();
  const themeColors = Colors[theme];
  const router = useRouter();
  const params = useLocalSearchParams();
  const width = Dimensions.get("window").width;

  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [participation, setParticipation] = useState<any>(null);
  const [isUpdatingParticipation, setIsUpdatingParticipation] = useState(false);

  useEffect(() => {
    loadEventDetails();
  }, []);

  const loadEventDetails = async () => {
    try {
      const t = await SecureStore.getItemAsync("userToken");
      setToken(t);

      if (!params.eventId) {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "ID do evento não encontrado",
        });
        router.back();
        return;
      }

      if (t) {
        const result = await getEventById({
          token: t,
          eventId: Number(params.eventId),
        });

        if (result.event) {
          setEvent(result.event);

          // Load user participation
          const participationResult = await getUserParticipation({
            eventId: Number(params.eventId),
            token: t,
          });

          if (participationResult.participation) {
            setParticipation(participationResult.participation);
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Erro",
            text2: result.message || "Erro ao carregar evento",
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Erro ao carregar detalhes do evento",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventStatus = () => {
    if (!event) return { label: "", color: "" };

    const now = new Date();
    const start = new Date(event.startAt);
    const end = new Date(event.endAt);

    if (now < start) {
      const date = new Date(event.startAt);
      const formattedDate = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const formattedTime = formatTime(event.startAt);
      return {
        label: `📅 ${formattedDate} às ${formattedTime}`,
        color: themeColors.warning
      };
    } else if (now >= start && now <= end) {
      return { label: "🔥 Acontecendo agora", color: themeColors.danger };
    } else {
      return { label: "Encerrado", color: themeColors.themeGrey };
    }
  };

  const getParticipationButton = () => {
    if (!event) return null;

    const now = new Date();
    const start = new Date(event.startAt);
    const end = new Date(event.endAt);
    const currentStatus = participation?.status || 0;

    // Event hasn't started yet
    if (now < start) {
      if (currentStatus === 0 || currentStatus === 3 || currentStatus === 4) {
        return {
          label: "Vou participar",
          icon: "calendar-check",
          color: themeColors.success,
          newStatus: 1,
        };
      } else if (currentStatus === 1) {
        return {
          label: "Desistir de participar",
          icon: "calendar-remove",
          color: themeColors.danger,
          newStatus: 3,
        };
      }
    }

    // Event is happening now
    if (now >= start && now <= end) {
      if (currentStatus === 0 || currentStatus === 1 || currentStatus === 3) {
        return {
          label: "Fazer check-in",
          icon: "check-circle",
          color: themeColors.success,
          newStatus: 2,
        };
      } else if (currentStatus === 2) {
        return {
          label: "Já saí do evento",
          icon: "exit-run",
          color: themeColors.textSecondary,
          newStatus: 4,
        };
      }
    }

    // Event has ended
    return null;
  };

  const handleParticipation = async () => {
    if (!token || !event) return;

    const buttonConfig = getParticipationButton();
    if (!buttonConfig) return;

    setIsUpdatingParticipation(true);

    try {
      const result = await upsertParticipation({
        eventId: event.id,
        status: buttonConfig.newStatus,
        token,
      });

      if (result.participation) {
        setParticipation(result.participation);
        Toast.show({
          type: "success",
          text1: "Sucesso!",
          text2: buttonConfig.label,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: result.message || "Erro ao atualizar participação",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Erro ao atualizar participação",
      });
    } finally {
      setIsUpdatingParticipation(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: themeColors.background,
        }}
      >
        <View
          style={[
            globalStyles.stackHeader,
            {
              backgroundColor: themeColors.background,
              borderBottomWidth: 1,
              borderBottomColor: themeColors.border,
            },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={themeColors.text} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: themeColors.text,
            }}
          >
            Detalhes do Evento
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={[globalStyles.flexc, { flex: 1 }]}>
          <ActivityIndicator size="large" color={themeColors.primary} />
          <Text
            style={{
              fontSize: 14,
              color: themeColors.textSecondary,
              marginTop: 12,
            }}
          >
            Carregando evento...
          </Text>
        </View>
      </View>
    );
  }

  if (!event) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: themeColors.background,
        }}
      >
        <View
          style={[
            globalStyles.stackHeader,
            {
              backgroundColor: themeColors.background,
              borderBottomWidth: 1,
              borderBottomColor: themeColors.border,
            },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={themeColors.text} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: themeColors.text,
            }}
          >
            Evento não encontrado
          </Text>
          <View style={{ width: 28 }} />
        </View>
      </View>
    );
  }

  const status = getEventStatus();
  const imageUrl = event.backgroundImage || event.photo;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeColors.background,
      }}
    >
      {/* Header */}
      <View
        style={[
          globalStyles.stackHeader,
          {
            backgroundColor: themeColors.background,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={themeColors.text} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: themeColors.text,
          }}
        >
          Detalhes do Evento
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView>
        {/* Event Image */}
        <View
          style={{
            width: "100%",
            height: 250,
            backgroundColor: themeColors.border,
          }}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: themeColors.primaryContrast,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name="event"
                size={80}
                color={themeColors.white + "50"}
              />
            </View>
          )}

          {/* Status Badge */}
          <View
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              backgroundColor: status.color,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 25,
            }}
          >
            <Text
              style={{
                color: themeColors.white,
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              {status.label}
            </Text>
          </View>

          {/* Event Type Badge */}
          <View
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              backgroundColor: themeColors.primary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 25,
            }}
          >
            <Text
              style={{
                color: themeColors.white,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              {event.eventType.name}
            </Text>
          </View>
        </View>

        {/* Event Info */}
        <View style={{ padding: 20 }}>
          {/* Participation Button */}
          {(() => {
            const buttonConfig = getParticipationButton();
            if (!buttonConfig) return null;

            return (
              <TouchableOpacity
                onPress={handleParticipation}
                disabled={isUpdatingParticipation}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: buttonConfig.color,
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  marginBottom: 20,
                  gap: 10,
                }}
              >
                {isUpdatingParticipation ? (
                  <ActivityIndicator size="small" color={themeColors.white} />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name={buttonConfig.icon as any}
                      size={22}
                      color={themeColors.white}
                    />
                    <Text
                      style={{
                        color: themeColors.white,
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      {buttonConfig.label}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            );
          })()}

          {/* Event Name */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: themeColors.text,
              marginBottom: 12,
            }}
          >
            {event.name}
          </Text>

          {/* Event Description */}
          <Text
            style={{
              fontSize: 16,
              color: themeColors.textSecondary,
              marginBottom: 24,
              lineHeight: 24,
            }}
          >
            {event.description}
          </Text>

          {/* Date and Time Section */}
          <View
            style={{
              backgroundColor: themeColors.secondary,
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <MFStackEditSubtitle
              themeColors={themeColors}
              title="📅 Data e Horário"
            />

            <View style={{ marginTop: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-start"
                  size={20}
                  color={themeColors.success}
                />
                <Text
                  style={{
                    fontSize: 15,
                    color: themeColors.text,
                    marginLeft: 10,
                    fontWeight: "600",
                  }}
                >
                  Início: {formatDate(event.startAt)}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: themeColors.textSecondary,
                  marginLeft: 30,
                  marginBottom: 16,
                }}
              >
                às {formatTime(event.startAt)}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-end"
                  size={20}
                  color={themeColors.danger}
                />
                <Text
                  style={{
                    fontSize: 15,
                    color: themeColors.text,
                    marginLeft: 10,
                    fontWeight: "600",
                  }}
                >
                  Término: {formatDate(event.endAt)}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: themeColors.textSecondary,
                  marginLeft: 30,
                }}
              >
                às {formatTime(event.endAt)}
              </Text>
            </View>
          </View>

          {/* Company Section */}
          <View
            style={{
              backgroundColor: themeColors.secondary,
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <MFStackEditSubtitle
              themeColors={themeColors}
              title="🏢 Organizado por"
            />

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(stack)/companyProfile",
                  params: { companyId: event.company.id },
                })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              {event.company.photo ? (
                <Image
                  source={{ uri: event.company.photo }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    marginRight: 12,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: themeColors.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <MaterialIcons
                    name="business"
                    size={24}
                    color={themeColors.white}
                  />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: themeColors.text,
                  }}
                >
                  {event.company.name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: themeColors.textSecondary,
                  }}
                >
                  Toque para ver perfil
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={28}
                color={themeColors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Promotional Section (if exists) */}
          {(event.promotionalText || event.promotionalUrl) && (
            <View
              style={{
                backgroundColor: themeColors.secondary,
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <MFStackEditSubtitle
                themeColors={themeColors}
                title="📢 Informações Adicionais"
              />

              {event.promotionalText && (
                <Text
                  style={{
                    fontSize: 14,
                    color: themeColors.textSecondary,
                    marginTop: 12,
                    lineHeight: 20,
                  }}
                >
                  {event.promotionalText}
                </Text>
              )}

              {event.promotionalUrl && (
                <TouchableOpacity
                  style={{
                    marginTop: 12,
                    padding: 12,
                    backgroundColor: themeColors.primary + "15",
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons
                    name="link"
                    size={20}
                    color={themeColors.primary}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: themeColors.primary,
                      marginLeft: 8,
                      fontWeight: "600",
                    }}
                    numberOfLines={1}
                  >
                    {event.promotionalUrl}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Settings */}
          <View
            style={{
              backgroundColor: themeColors.secondary,
              borderRadius: 12,
              padding: 16,
              marginBottom: 100,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <MaterialIcons
                name={event.isPublic ? "public" : "lock"}
                size={20}
                color={themeColors.primary}
              />
              <Text
                style={{
                  fontSize: 15,
                  color: themeColors.text,
                  marginLeft: 10,
                  fontWeight: "600",
                }}
              >
                {event.isPublic ? "Evento Público" : "Evento Privado"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name={event.isPublicMetrics ? "visibility" : "visibility-off"}
                size={20}
                color={themeColors.primary}
              />
              <Text
                style={{
                  fontSize: 15,
                  color: themeColors.text,
                  marginLeft: 10,
                  fontWeight: "600",
                }}
              >
                {event.isPublicMetrics
                  ? "Métricas Públicas"
                  : "Métricas Privadas"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
