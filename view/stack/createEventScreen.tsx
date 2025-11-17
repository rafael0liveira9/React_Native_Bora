import { MFPrimaryButton } from "@/components/eai-bora-ui/buttons";
import { MFTextInput } from "@/components/eai-bora-ui/inputs";
import MFStackEditSubtitle from "@/components/eai-bora-ui/stackEditSubtitle";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { createEvent, getAllEventTypes } from "@/service/events";
import { globalStyles } from "@/styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface EventType {
  id: number;
  name: string;
  description?: string;
}

export default function CreateEventScreen() {
  const { theme } = useTheme();
  const themeColors = Colors[theme];
  const router = useRouter();
  const width = Dimensions.get("window").width;

  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

  // Event types
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);

  // Required fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEventType, setSelectedEventType] = useState<number | null>(
    null
  );

  // Date and time
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 2 * 60 * 60 * 1000)
  ); // 2 hours later
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Toggles
  const [isPublic, setIsPublic] = useState(false);
  const [isPublicMetrics, setIsPublicMetrics] = useState(true);

  // Promotional fields (collapsed by default)
  const [showPromotional, setShowPromotional] = useState(false);
  const [promotionalText, setPromotionalText] = useState("");
  const [promotionalUrl, setPromotionalUrl] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const t = await SecureStore.getItemAsync("userToken");
      setToken(t);

      // Load event types
      const types = await getAllEventTypes();
      if (types.eventTypes && Array.isArray(types.eventTypes)) {
        setEventTypes(types.eventTypes);
        // Set first type as default selected
        if (types.eventTypes.length > 0) {
          setSelectedEventType(types.eventTypes[0].id);
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Erro ao carregar tipos de eventos",
      });
    } finally {
      setIsLoadingTypes(false);
    }
  };

  const handleCreateEvent = async () => {
    // Validations
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Nome obrigatório",
        text2: "Por favor, informe o nome do evento",
      });
      return;
    }

    if (!description.trim()) {
      Toast.show({
        type: "error",
        text1: "Descrição obrigatória",
        text2: "Por favor, informe a descrição do evento",
      });
      return;
    }

    if (!selectedEventType) {
      Toast.show({
        type: "error",
        text1: "Tipo obrigatório",
        text2: "Por favor, selecione o tipo do evento",
      });
      return;
    }

    if (endDate <= startDate) {
      Toast.show({
        type: "error",
        text1: "Data inválida",
        text2: "A data de término deve ser posterior à data de início",
      });
      return;
    }

    if (!token) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Token não encontrado. Por favor, faça login novamente.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await createEvent({
        token,
        name: name.trim(),
        description: description.trim(),
        eventTypeId: selectedEventType,
        startAt: startDate.toISOString(),
        endAt: endDate.toISOString(),
        isPublic,
        isPublicMetrics,
        promotionalText: promotionalText.trim() || undefined,
        promotionalUrl: promotionalUrl.trim() || undefined,
      });

      if (result.event) {
        Toast.show({
          type: "success",
          text1: "Sucesso!",
          text2: result.message || "Evento criado com sucesso!",
          visibilityTime: 3000,
        });

        // Navigate back after a short delay
        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: result.message || "Erro ao criar evento",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Erro ao criar evento. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: themeColors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
          Criar Evento
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        {/* Nome do evento */}
        <View style={{ marginBottom: 20 }}>
          <MFTextInput
            themeColors={themeColors}
            label="Nome do Evento *"
            placeholder="Ex: Festa do vermelho"
            value={name}
            onChangeText={setName}
            maxLength={100}
          />
        </View>

        {/* Descrição */}
        <View style={{ marginBottom: 20 }}>
          <MFTextInput
            themeColors={themeColors}
            label="Descrição *"
            placeholder="Descreva os detalhes do seu evento"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>

        {/* Event Type Selection */}
        <View style={{ marginBottom: 20 }}>
          <MFStackEditSubtitle
            themeColors={themeColors}
            title="Tipo de Evento *"
          />

          {isLoadingTypes ? (
            <View style={[globalStyles.flexr, { padding: 20 }]}>
              <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 10,
              }}
            >
              {eventTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setSelectedEventType(type.id)}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor:
                      selectedEventType === type.id
                        ? themeColors.primary
                        : themeColors.border,
                    backgroundColor:
                      selectedEventType === type.id
                        ? themeColors.primaryContrast
                        : themeColors.secondary,
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedEventType === type.id
                          ? themeColors.white
                          : themeColors.text,
                      fontWeight: selectedEventType === type.id ? "700" : "500",
                      fontSize: 15,
                    }}
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Date and Time */}
        <View style={{ marginBottom: 20 }}>
          <MFStackEditSubtitle
            themeColors={themeColors}
            title="Data e Horário *"
          />

          {/* Start Date & Time */}
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowStartDatePicker(true)}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: 15,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: themeColors.border,
                backgroundColor: themeColors.secondary,
              }}
            >
              <MaterialIcons
                name="event"
                size={22}
                color={themeColors.primary}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: themeColors.textSecondary,
                    marginBottom: 2,
                  }}
                >
                  Início
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: themeColors.text,
                  }}
                >
                  {formatDate(startDate)}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowStartTimePicker(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                padding: 15,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: themeColors.border,
                backgroundColor: themeColors.secondary,
              }}
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={22}
                color={themeColors.primary}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: themeColors.text,
                }}
              >
                {formatTime(startDate)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* End Date & Time */}
          <View
            style={{
              flexDirection: "row",
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowEndDatePicker(true)}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: 15,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: themeColors.border,
                backgroundColor: themeColors.secondary,
              }}
            >
              <MaterialIcons
                name="event"
                size={22}
                color={themeColors.danger}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: themeColors.textSecondary,
                    marginBottom: 2,
                  }}
                >
                  Término
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: themeColors.text,
                  }}
                >
                  {formatDate(endDate)}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowEndTimePicker(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                padding: 15,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: themeColors.border,
                backgroundColor: themeColors.secondary,
              }}
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={22}
                color={themeColors.danger}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: themeColors.text,
                }}
              >
                {formatTime(endDate)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(Platform.OS === "ios");
              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
          />
        )}

        {showStartTimePicker && (
          <DateTimePicker
            value={startDate}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowStartTimePicker(Platform.OS === "ios");
              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(Platform.OS === "ios");
              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
          />
        )}

        {showEndTimePicker && (
          <DateTimePicker
            value={endDate}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowEndTimePicker(Platform.OS === "ios");
              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
          />
        )}

        {/* Settings Toggles */}
        <View style={{ marginBottom: 20 }}>
          <MFStackEditSubtitle
            themeColors={themeColors}
            title="Configurações"
          />

          <View
            style={{
              backgroundColor: themeColors.secondary,
              borderRadius: 12,
              padding: 15,
              marginTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: themeColors.text,
                    marginBottom: 4,
                  }}
                >
                  Evento Público
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: themeColors.textSecondary,
                  }}
                >
                  Qualquer pessoa pode visualizar
                </Text>
              </View>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{
                  false: themeColors.border,
                  true: themeColors.primary,
                }}
                thumbColor={themeColors.white}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: themeColors.text,
                    marginBottom: 4,
                  }}
                >
                  Métricas Públicas
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: themeColors.textSecondary,
                  }}
                >
                  Exibir estatísticas do evento
                </Text>
              </View>
              <Switch
                value={isPublicMetrics}
                onValueChange={setIsPublicMetrics}
                trackColor={{
                  false: themeColors.border,
                  true: themeColors.primary,
                }}
                thumbColor={themeColors.white}
              />
            </View>
          </View>
        </View>

        {/* Promotional Section (Collapsible) */}
        <View style={{ marginBottom: 30 }}>
          <TouchableOpacity
            onPress={() => setShowPromotional(!showPromotional)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 15,
              backgroundColor: themeColors.secondary,
              borderRadius: 12,
              marginBottom: showPromotional ? 15 : 0,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <MaterialIcons
                name="campaign"
                size={24}
                color={themeColors.primary}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: themeColors.text,
                }}
              >
                Informações Promocionais
              </Text>
            </View>
            <MaterialIcons
              name={
                showPromotional ? "keyboard-arrow-up" : "keyboard-arrow-down"
              }
              size={24}
              color={themeColors.text}
            />
          </TouchableOpacity>

          {showPromotional && (
            <View>
              <View style={{ marginBottom: 15 }}>
                <MFTextInput
                  themeColors={themeColors}
                  label="Texto Promocional"
                  placeholder="Descreva os destaques e diferenciais do evento"
                  value={promotionalText}
                  onChangeText={setPromotionalText}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View>
                <MFTextInput
                  themeColors={themeColors}
                  label="URL Promocional"
                  placeholder="https://exemplo.com/inscricao"
                  value={promotionalUrl}
                  onChangeText={setPromotionalUrl}
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}
        </View>

        {/* Info Box */}
        <View
          style={{
            flexDirection: "row",
            padding: 15,
            backgroundColor: themeColors.primaryContrast + "15",
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <MaterialIcons
            name="info-outline"
            size={22}
            color={themeColors.primary}
            style={{ marginRight: 10 }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: 13,
              color: themeColors.text,
              lineHeight: 20,
            }}
          >
            Seu evento será criado com capacidade inicial de 100 pessoas. Você
            poderá adicionar mais capacidade posteriormente.
          </Text>
        </View>

        {/* Create Button */}
        <MFPrimaryButton
          themeColors={themeColors}
          title="Criar Evento"
          onPress={handleCreateEvent}
          isLoading={isLoading}
          isDisabled={isLoading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
