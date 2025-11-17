import { CommentSection } from "@/components/eai-bora-ui/comments";
import MFStackHeader from "@/components/eai-bora-ui/stackHeader";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { getCompanyById, getCompanyEvents, getCompanyPosts } from "@/service/company";
import { formatTimeAgo } from "@/controllers/utils";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Linking,
} from "react-native";
import Toast from "react-native-toast-message";

export default function CompanyProfile() {
  const { theme } = useTheme();
  const themeColors = Colors[`${theme}`];
  const router = useRouter();
  const { companyId } = useLocalSearchParams();
  const width = Dimensions.get("window").width;

  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);
  const [companyEvents, setCompanyEvents] = useState<any[]>([]);
  const [companyPosts, setCompanyPosts] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [myUserId, setMyUserId] = useState<number | null>(null);

  useEffect(() => {
    loadCompanyData();
  }, [companyId]);

  async function loadCompanyData() {
    setIsLoading(true);
    try {
      const userToken = await SecureStore.getItemAsync("userToken");
      const myUserIdStr = await SecureStore.getItemAsync("userId");
      setToken(userToken);
      if (myUserIdStr) setMyUserId(parseInt(myUserIdStr));

      console.log("🏢 CompanyId recebido:", companyId);

      if (userToken && companyId) {
        // Fetch company data
        const company = await getCompanyById({
          companyId: parseInt(companyId as string),
          token: userToken,
        });

        console.log("🏢 Resposta da API:", company);

        if (company?.company) {
          setCompanyData(company.company);
        } else {
          console.log("❌ Empresa não encontrada na resposta:", company);
        }

        // Fetch company events
        const events = await getCompanyEvents({
          companyId: parseInt(companyId as string),
          token: userToken,
          page: 1,
          pageSize: 20,
        });

        if (events?.events) {
          setCompanyEvents(events.events);
        }

        // Fetch company posts
        const posts = await getCompanyPosts({
          companyId: parseInt(companyId as string),
          token: userToken,
        });

        if (posts?.posts) {
          setCompanyPosts(posts.posts);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados da empresa:", error);
      setIsLoading(false);
    }
  }

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
        color: themeColors.warning
      };
    } else if (now >= start && now <= end) {
      return { label: "🔥 Acontecendo agora", color: themeColors.danger };
    } else {
      return { label: "Encerrado", color: themeColors.themeGrey };
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: themeColors.background }}>
        <MFStackHeader title="Empresa" router={router} themeColors={themeColors} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      </View>
    );
  }

  if (!companyData) {
    return (
      <View style={{ flex: 1, backgroundColor: themeColors.background }}>
        <MFStackHeader title="Empresa" router={router} themeColors={themeColors} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: themeColors.text }}>Empresa não encontrada</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <MFStackHeader title="Empresa" router={router} themeColors={themeColors} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Background Image */}
        <View style={{ width: "100%", height: 200, position: "relative" }}>
          {companyData.backgroundImage ? (
            <Image
              source={{ uri: companyData.backgroundImage }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: themeColors.primary,
                opacity: 0.3,
              }}
            />
          )}

          {/* Gradient Overlay */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: 100,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />
        </View>

        {/* Company Info */}
        <View style={{ paddingHorizontal: 20, marginTop: -50 }}>
          {/* Logo */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 4,
              borderColor: themeColors.background,
              overflow: "hidden",
              backgroundColor: themeColors.cardBackground,
            }}
          >
            {companyData.photo ? (
              <Image
                source={{ uri: companyData.photo }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: themeColors.primary,
                }}
              >
                <MaterialIcons name="business" size={50} color="#FFF" />
              </View>
            )}
          </View>

          {/* Company Name */}
          <View style={{ marginTop: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: themeColors.text }}>
              {companyData.name}
            </Text>
          </View>

          {/* Description */}
          {companyData.description && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 15, color: themeColors.text, lineHeight: 22 }}>
                {companyData.description}
              </Text>
            </View>
          )}

          {/* Contact Info */}
          {(companyData.phone || companyData.email || companyData.website) && (
            <View
              style={{
                marginBottom: 20,
                paddingVertical: 16,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: themeColors.border,
              }}
            >
              {companyData.phone && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${companyData.phone}`)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="call" size={20} color={themeColors.primary} />
                  <Text
                    style={{
                      fontSize: 15,
                      color: themeColors.text,
                      marginLeft: 10,
                    }}
                  >
                    {companyData.phone}
                  </Text>
                </TouchableOpacity>
              )}

              {companyData.email && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`mailto:${companyData.email}`)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="mail" size={20} color={themeColors.primary} />
                  <Text
                    style={{
                      fontSize: 15,
                      color: themeColors.text,
                      marginLeft: 10,
                    }}
                  >
                    {companyData.email}
                  </Text>
                </TouchableOpacity>
              )}

              {companyData.website && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(companyData.website)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="globe" size={20} color={themeColors.primary} />
                  <Text
                    style={{
                      fontSize: 15,
                      color: themeColors.text,
                      marginLeft: 10,
                    }}
                  >
                    {companyData.website}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Stats */}
          <View
            style={{
              flexDirection: "row",
              gap: 24,
              marginBottom: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderColor: themeColors.border,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: themeColors.text }}>
                {companyEvents.length}
              </Text>
              <Text style={{ fontSize: 14, color: themeColors.textSecondary }}>Eventos</Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: themeColors.text }}>
                {companyPosts.length}
              </Text>
              <Text style={{ fontSize: 14, color: themeColors.textSecondary }}>Posts</Text>
            </View>
          </View>

          {/* Events Section */}
          <View style={{ marginTop: 8 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: themeColors.text,
                marginBottom: 16,
              }}
            >
              Eventos
            </Text>

            {companyEvents.length === 0 ? (
              <View
                style={{
                  padding: 40,
                  alignItems: "center",
                  backgroundColor: themeColors.cardBackground,
                  borderRadius: 12,
                  marginBottom: 20,
                }}
              >
                <MaterialIcons name="event-busy" size={48} color={themeColors.textSecondary} />
                <Text
                  style={{
                    marginTop: 12,
                    fontSize: 16,
                    color: themeColors.textSecondary,
                    textAlign: "center",
                  }}
                >
                  Nenhum evento criado
                </Text>
              </View>
            ) : (
              companyEvents.map((event) => {
                const status = getEventStatus(event.startAt, event.endAt);
                const imageUrl = event.backgroundImage || event.photo;

                return (
                  <TouchableOpacity
                    key={event.id}
                    onPress={() =>
                      router.push({
                        pathname: "/(stack)/eventDetails",
                        params: { eventId: event.id },
                      })
                    }
                    style={{
                      backgroundColor: themeColors.cardBackground,
                      borderRadius: 12,
                      marginBottom: 16,
                      overflow: "hidden",
                    }}
                  >
                    {/* Event Image */}
                    <View
                      style={{
                        width: "100%",
                        height: 150,
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
                            size={50}
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
                      {event.eventType && (
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
                            {event.eventType.name}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Event Content */}
                    <View style={{ padding: 16 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: themeColors.text,
                          marginBottom: 8,
                        }}
                        numberOfLines={2}
                      >
                        {event.name}
                      </Text>

                      <Text
                        style={{
                          fontSize: 14,
                          color: themeColors.textSecondary,
                          marginBottom: 12,
                          lineHeight: 20,
                        }}
                        numberOfLines={2}
                      >
                        {event.description}
                      </Text>

                      {/* Date and Time */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <MaterialCommunityIcons
                          name="calendar-clock"
                          size={18}
                          color={themeColors.primary}
                        />
                        <Text
                          style={{
                            fontSize: 14,
                            color: themeColors.text,
                            marginLeft: 8,
                            fontWeight: "600",
                          }}
                        >
                          {formatDate(event.startAt)} às {formatTime(event.startAt)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* Posts Section */}
          {companyPosts.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: themeColors.text,
                  marginBottom: 16,
                }}
              >
                Posts
              </Text>

              {companyPosts.map((post) => (
                <View
                  key={post.id}
                  style={{
                    backgroundColor: themeColors.cardBackground,
                    borderRadius: 12,
                    marginBottom: 16,
                    overflow: "hidden",
                  }}
                >
                  {/* Post Header */}
                  <View style={{ padding: 16, flexDirection: "row", alignItems: "center" }}>
                    {companyData.photo ? (
                      <Image
                        source={{ uri: companyData.photo }}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: themeColors.primary,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialIcons name="business" size={20} color="#FFF" />
                      </View>
                    )}
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "600", color: themeColors.text }}>
                        {companyData.name}
                      </Text>
                      {post.createdAt && (
                        <Text style={{ fontSize: 12, color: themeColors.textSecondary }}>
                          {formatTimeAgo(post.createdAt)}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Post Content */}
                  <View style={{ paddingHorizontal: 16 }}>
                    {post.title && (
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: themeColors.text,
                          marginBottom: 8,
                        }}
                      >
                        {post.title}
                      </Text>
                    )}
                    {post.description && (
                      <Text style={{ fontSize: 15, color: themeColors.text, lineHeight: 22 }}>
                        {post.description}
                      </Text>
                    )}
                  </View>

                  {/* Post Image */}
                  {post.image && (
                    <Image
                      source={{ uri: post.image }}
                      style={{ width: "100%", height: 300, marginTop: 12 }}
                      resizeMode="cover"
                    />
                  )}

                  {/* Comments Section */}
                  {token && myUserId && (
                    <CommentSection
                      postId={post.id}
                      token={token}
                      themeColors={themeColors}
                      userId={myUserId}
                      initialCommentsCount={post._count?.comments || 0}
                    />
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
