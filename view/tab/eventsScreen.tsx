import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { getPublicEvents } from "@/service/events";
import { globalStyles } from "@/styles/global";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface Event {
  id: number;
  name: string;
  description: string;
  photo?: string;
  backgroundImage?: string;
  startAt: string;
  endAt: string;
  isPublic: boolean;
  isPublicMetrics: boolean;
  eventType: {
    id: number;
    name: string;
  };
  company: {
    id: number;
    name: string;
    photo?: string;
  };
}

export default function EventsScreen() {
  const { theme } = useTheme();
  const themeColors = Colors[theme];
  const router = useRouter();
  const width = Dimensions.get("window").width;

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async (refresh = false, pageToLoad?: number) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setPage(1);
      }

      const currentPage = pageToLoad || (refresh ? 1 : page);

      const result = await getPublicEvents({
        page: currentPage,
        pageSize: 10,
      });

      if (result.events && Array.isArray(result.events)) {
        if (refresh) {
          setEvents(result.events);
        } else {
          // Filter out duplicates before adding
          setEvents((prev) => {
            const existingIds = new Set(prev.map((e) => e.id));
            const newEvents = result.events.filter(
              (e: any) => !existingIds.has(e.id)
            );
            return [...prev, ...newEvents];
          });
        }

        // Check if there are more events
        setHasMore(result.events.length === 10);
      } else {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: result.message || "Erro ao carregar eventos",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Erro ao carregar eventos",
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadEvents(true);
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadEvents(false, nextPage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
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

  const getEventStatus = (startAt: string, endAt: string) => {
    const now = new Date();
    const start = new Date(startAt);
    const end = new Date(endAt);

    if (now < start) {
      const date = new Date(startAt);
      const formattedDate = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const formattedTime = formatTime(startAt);
      return {
        label: `📅 ${formattedDate} às ${formattedTime}`,
        color: themeColors.warning,
        emoji: "📅",
      };
    } else if (now >= start && now <= end) {
      return {
        label: "🔥 Acontecendo agora",
        color: themeColors.danger,
        emoji: "🔥",
      };
    } else {
      return { label: "Encerrado", color: themeColors.themeGrey, emoji: "" };
    }
  };

  const renderEventCard = ({ item }: { item: Event }) => {
    const status = getEventStatus(item.startAt, item.endAt);
    const imageUrl = item.backgroundImage || item.photo;

    const handleEventPress = () => {
      router.push({
        pathname: "/(stack)/eventDetails",
        params: { eventId: item.id },
      });
    };

    const handleCompanyPress = (e: any) => {
      e.stopPropagation();
      router.push({
        pathname: "/(stack)/companyProfile",
        params: { companyId: item.company.id },
      });
    };

    return (
      <TouchableOpacity
        onPress={handleEventPress}
        activeOpacity={0.7}
        style={{
          marginHorizontal: 20,
          marginBottom: 20,
          borderRadius: 16,
          backgroundColor: themeColors.secondary,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          overflow: "hidden",
        }}
      >
        {/* Image Section */}
        <View
          style={{
            width: "100%",
            height: 180,
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
                size={60}
                color={themeColors.white + "50"}
              />
            </View>
          )}

          {/* Status Badge */}
          <View
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: status.color,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: themeColors.white,
                fontSize: 12,
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
              top: 12,
              left: 12,
              backgroundColor: themeColors.primary,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: themeColors.white,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {item.eventType.name}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={{ padding: 16 }}>
          {/* Event Title */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: themeColors.text,
              marginBottom: 8,
            }}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          {/* Event Description */}
          <Text
            style={{
              fontSize: 14,
              color: themeColors.textSecondary,
              marginBottom: 12,
              lineHeight: 20,
            }}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          {/* Company Info - Clickable */}
          <TouchableOpacity
            onPress={handleCompanyPress}
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: themeColors.border,
            }}
          >
            {item.company.photo ? (
              <Image
                source={{ uri: item.company.photo }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  marginRight: 8,
                }}
              />
            ) : (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: themeColors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <MaterialIcons
                  name="business"
                  size={16}
                  color={themeColors.white}
                />
              </View>
            )}
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                color: themeColors.textSecondary,
                fontWeight: "500",
              }}
              numberOfLines={1}
            >
              Evento de {item.company.name || "Empresa"}
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View
      style={[globalStyles.flexc, { paddingTop: 100, paddingHorizontal: 40 }]}
    >
      <MaterialIcons
        name="event-busy"
        size={80}
        color={themeColors.themeGrey}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: themeColors.text,
          marginTop: 20,
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Nenhum evento disponível
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: themeColors.textSecondary,
          textAlign: "center",
          lineHeight: 20,
        }}
      >
        Não há eventos públicos ativos no momento. Volte em breve para conferir
        novidades!
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View style={[globalStyles.flexr, { padding: 20 }]}>
        <ActivityIndicator size="small" color={themeColors.primary} />
      </View>
    );
  };

  if (isLoading && events.length === 0) {
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
            globalStyles.header,
            {
              backgroundColor: themeColors.background,
              borderBottomWidth: 1,
              borderBottomColor: themeColors.border,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: themeColors.text,
            }}
          >
            Eventos
          </Text>
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
            Carregando eventos...
          </Text>
        </View>
      </View>
    );
  }

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
          globalStyles.header,
          {
            backgroundColor: themeColors.background,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border,
          },
        ]}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: themeColors.text,
          }}
        >
          Eventos
        </Text>
      </View>

      {/* Events List */}
      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={(item) => `event-${item.id}`}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 100,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themeColors.primary]}
            tintColor={themeColors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
