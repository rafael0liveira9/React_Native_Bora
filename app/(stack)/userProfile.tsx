import { CommentSection } from "@/components/eai-bora-ui/comments";
import MFStackHeader from "@/components/eai-bora-ui/stackHeader";
import ImageGalleryView from "@/components/eai-bora-ui/ImageGalleryView";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { getUserPosts } from "@/service/posts";
import { newFriendRequest, acceptFriendRequest } from "@/service/relations";
import { getUserById } from "@/service/user";
import { Ionicons, MaterialIcons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
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
import { formatTimeAgo } from "@/controllers/utils";

export default function UserProfile() {
  const { theme } = useTheme();
  const themeColors = Colors[`${theme}`];
  const router = useRouter();
  const { userId, clientId, friendStatus: initialFriendStatus } = useLocalSearchParams();
  const width = Dimensions.get("window").width;

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [friendStatus, setFriendStatus] = useState<number>(
    initialFriendStatus ? parseInt(initialFriendStatus as string) : 1
  );

  useEffect(() => {
    loadUserData();
  }, [userId]);

  async function loadUserData() {
    setIsLoading(true);
    try {
      const userToken = await SecureStore.getItemAsync("userToken");
      const myUserIdStr = await SecureStore.getItemAsync("userId");
      setToken(userToken);
      if (myUserIdStr) setMyUserId(parseInt(myUserIdStr));

      if (userToken && userId) {
        // Buscar dados do usuário
        const user = await getUserById({ userId: parseInt(userId as string), token: userToken });

        if (user?.user) {
          setUserData(user.user);
        }

        // Buscar posts do usuário
        if (clientId) {
          const posts = await getUserPosts({
            clientId: parseInt(clientId as string),
            token: userToken,
          });
          if (posts?.posts) {
            setUserPosts(posts.posts);
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      setIsLoading(false);
    }
  }

  async function handleFriendAction() {
    if (!token || !clientId) return;

    try {
      switch (friendStatus) {
        case 1: // Adicionar amigo
          const response = await newFriendRequest({ id: parseInt(clientId as string), token });
          if (response?.success || response?.data) {
            setFriendStatus(3);
            Toast.show({
              type: "success",
              text1: response?.message || "Solicitação enviada!",
            });
          } else if (response?.message) {
            Toast.show({
              type: "error",
              text1: response.message,
            });
          }
          break;

        case 3: // Cancelar solicitação
          await acceptFriendRequest({
            id: parseInt(clientId as string),
            token,
            accept: false,
          });
          setFriendStatus(1);
          Toast.show({
            type: "info",
            text1: "Solicitação cancelada",
          });
          break;

        case 4: // Aceitar solicitação
          await acceptFriendRequest({
            id: parseInt(clientId as string),
            token,
            accept: true,
          });
          setFriendStatus(2);
          Toast.show({
            type: "success",
            text1: "Agora vocês são amigos!",
          });
          break;
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error?.message || "Erro ao processar ação",
      });
    }
  }

  const getFriendButtonConfig = () => {
    switch (friendStatus) {
      case 1:
        return { icon: "person-add", text: "Adicionar", color: themeColors.primary };
      case 2:
        return { icon: "people", text: "Amigos", color: themeColors.success };
      case 3:
        return { icon: "hourglass", text: "Pendente", color: themeColors.textSecondary };
      case 4:
        return { icon: "checkmark-circle", text: "Aceitar", color: themeColors.success };
      default:
        return { icon: "person-add", text: "Adicionar", color: themeColors.primary };
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: themeColors.background }}>
        <MFStackHeader title="Perfil" router={router} themeColors={themeColors} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={{ flex: 1, backgroundColor: themeColors.background }}>
        <MFStackHeader title="Perfil" router={router} themeColors={themeColors} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: themeColors.text }}>Usuário não encontrado</Text>
        </View>
      </View>
    );
  }

  const friendButtonConfig = getFriendButtonConfig();

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <MFStackHeader title="Perfil" router={router} themeColors={themeColors} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Background Image */}
        <View style={{ width: "100%", height: 200, position: "relative" }}>
          {userData.client?.backgroundImage ? (
            <Image
              source={{ uri: userData.client.backgroundImage }}
              style={{ width: "100%", height: "100%"}}
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

        {/* Profile Info */}
        <View style={{ paddingHorizontal: 20, marginTop: -50 }}>
          {/* Avatar */}
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
            {userData.client?.photo ? (
              <Image
                source={{ uri: userData.client.photo }}
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
                <Text style={{ color: "#FFF", fontSize: 40, fontWeight: "bold" }}>
                  {userData.client?.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {/* Name and Badges */}
          <View style={{ marginTop: 12, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", color: themeColors.text }}>
                {userData.client?.nick || userData.client?.name}
              </Text>

              {userData.client?.userType === 1 && (
                <Image
                  source={require("@/assets/images/eai-bora/icon-eab.png")}
                  style={{ width: 24, height: 24 }}
                  resizeMode="cover"
                />
              )}

              {(userData.client?.userType === 3 || userData.client?.userType === 4) && (
                <MaterialIcons
                  name="workspace-premium"
                  size={24}
                  color={
                    userData.client?.userType === 3
                      ? themeColors.orange
                      : themeColors.primary
                  }
                />
              )}

              {userData.client?.cref && (
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: themeColors.white,
                    borderColor: themeColors.grey,
                    borderWidth: 1,
                    alignItems: "center",
                    paddingHorizontal: 7,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "900", color: "#105661" }}>
                    Cr
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: "900", color: "#3F9933" }}>
                    ef
                  </Text>
                  <FontAwesome
                    style={{ marginLeft: 5 }}
                    name="check-circle"
                    size={12}
                    color={themeColors.success}
                  />
                </View>
              )}
            </View>

            {userData.client?.name !== userData.client?.nick && (
              <Text style={{ fontSize: 16, color: themeColors.textSecondary, marginTop: 4 }}>
                {userData.client?.name}
              </Text>
            )}
          </View>

          {/* Description */}
          {userData.client?.description && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 15, color: themeColors.text, lineHeight: 22 }}>
                {userData.client.description}
              </Text>
            </View>
          )}

          {/* Stats */}
          <View
            style={{
              flexDirection: "row",
              gap: 24,
              marginBottom: 20,
              paddingVertical: 16,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: themeColors.border,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: themeColors.text }}>
                {userPosts.length}
              </Text>
              <Text style={{ fontSize: 14, color: themeColors.textSecondary }}>Posts</Text>
            </View>
          </View>

          {/* Galeria de Fotos */}
          {token && clientId && (
            <ImageGalleryView
              themeColors={themeColors}
              token={token}
              clientId={parseInt(clientId as string)}
            />
          )}

          {/* Action Buttons */}
          {friendStatus !== 2 && (
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
              <TouchableOpacity
                onPress={handleFriendAction}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: friendButtonConfig.color,
                  paddingVertical: 12,
                  borderRadius: 8,
                  gap: 8,
                }}
              >
                <Ionicons name={friendButtonConfig.icon as any} size={20} color="#FFF" />
                <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}>
                  {friendButtonConfig.text}
                </Text>
              </TouchableOpacity>

              {userData.client?.instagram && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`https://instagram.com/${userData.client.instagram}`)}
                  style={{
                    backgroundColor: themeColors.cardBackground,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                  }}
                >
                  <FontAwesome name="instagram" size={20} color={themeColors.text} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {friendStatus === 2 && (
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: themeColors.cardBackground,
                  paddingVertical: 12,
                  borderRadius: 8,
                  gap: 8,
                  borderWidth: 1,
                  borderColor: themeColors.success,
                }}
              >
                <Ionicons name="people" size={20} color={themeColors.success} />
                <Text style={{ color: themeColors.success, fontSize: 16, fontWeight: "600" }}>
                  Amigos
                </Text>
              </View>

              {userData.client?.instagram && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`https://instagram.com/${userData.client.instagram}`)}
                  style={{
                    backgroundColor: themeColors.cardBackground,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                  }}
                >
                  <FontAwesome name="instagram" size={20} color={themeColors.text} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Posts Section */}
          <View style={{ marginTop: 8 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: themeColors.text,
                marginBottom: 16,
              }}
            >
              Posts Públicos
            </Text>

            {userPosts.length === 0 ? (
              <View
                style={{
                  padding: 40,
                  alignItems: "center",
                  backgroundColor: themeColors.cardBackground,
                  borderRadius: 12,
                  marginBottom: 20,
                }}
              >
                <Ionicons name="document-text-outline" size={48} color={themeColors.textSecondary} />
                <Text
                  style={{
                    marginTop: 12,
                    fontSize: 16,
                    color: themeColors.textSecondary,
                    textAlign: "center",
                  }}
                >
                  Nenhum post público ainda
                </Text>
              </View>
            ) : (
              userPosts.map((post) => (
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
                    <Image
                      source={{ uri: userData.client?.photo }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "600", color: themeColors.text }}>
                        {userData.client?.nick || userData.client?.name}
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
              ))
            )}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
