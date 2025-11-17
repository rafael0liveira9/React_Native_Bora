import { MFPersonCard } from "@/components/eai-bora-ui/cards";
import { MFTextInput } from "@/components/eai-bora-ui/inputs";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { getClients } from "@/service/client";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  sendFriendRequest,
} from "@/service/friendship";
import { globalStyles } from "@/styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function PeopleScreen() {
  const { theme } = useTheme();
  const themeColors = Colors[theme];
  const router = useRouter();

  const [people, setPeople] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [friendships, setFriendships] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (token) {
      loadPeople(""); // Carrega pessoas inicialmente (busca vazia = todos)
      loadFriendships();
    }
  }, [token]);

  async function loadUserData() {
    const userToken = await SecureStore.getItemAsync("userToken");
    const id = await SecureStore.getItemAsync("userId");
    if (userToken) setToken(userToken);
    if (id) setUserId(id);
  }

  async function loadPeople(search?: string) {
    setIsLoading(true);
    const res = await getClients({
      token,
      searchString: search || searchText,
      page: 0,
      pageSize: 50,
    });

    if (res?.clients) {
      setPeople(res.clients);
    } else {
      Toast.show({
        type: "error",
        text1: `❌ ${res?.message || "Erro ao carregar pessoas"}`,
      });
    }
    setIsLoading(false);
  }

  async function handleSearch() {
    await loadPeople(searchText.trim());
  }

  async function loadFriendships() {
    const [requestsRes, friendsRes] = await Promise.all([
      getFriendRequests(token),
      getMyFriends(token),
    ]);

    if (requestsRes?.friendsRequest) {
      setFriendships(requestsRes.friendsRequest);
    }

    if (friendsRes?.friends) {
      setFriends(friendsRes.friends);
    }
  }

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadPeople();
    await loadFriendships();
    setIsRefreshing(false);
  }, [token]);

  function getFriendshipStatus(personId: number): number {
    // Type 1=não amigo 2=amigo 3=pedido enviado 4=pedido recebido

    // Check if already friends
    const isFriend = friends.find(
      (f) =>
        (f.sender === parseInt(userId) && f.friend === personId) ||
        (f.friend === parseInt(userId) && f.sender === personId)
    );
    if (isFriend && isFriend.accept === 1) return 2; // Amigo

    // Check if there's a pending request sent by me
    const sentRequest = friendships.find(
      (f) =>
        f.sender === parseInt(userId) && f.friend === personId && f.accept === 0
    );
    if (sentRequest) return 3; // Pedido enviado

    // Check if there's a pending request received
    const receivedRequest = friendships.find(
      (f) =>
        f.friend === parseInt(userId) && f.sender === personId && f.accept === 0
    );
    if (receivedRequest) return 4; // Pedido recebido

    return 1; // Não amigo
  }

  async function handleAddFriend(personId: number, friendshipStatus: number) {
    if (friendshipStatus === 1) {
      // Enviar pedido
      const res = await sendFriendRequest(token, personId);
      if (res?.message === "Solicitação de amizade enviada.") {
        Toast.show({
          type: "success",
          text1: "✅ Pedido enviado!",
        });
        loadFriendships();
      } else {
        Toast.show({
          type: "error",
          text1: `❌ ${res?.message}`,
        });
      }
    } else if (friendshipStatus === 4) {
      // Aceitar pedido recebido
      const request = friendships.find(
        (f) =>
          f.friend === parseInt(userId) &&
          f.sender === personId &&
          f.accept === 0
      );
      if (request) {
        const res = await acceptFriendRequest(token, request.id);
        if (res?.message === "Solicitação aceita.") {
          Toast.show({
            type: "success",
            text1: "✅ Amizade aceita!",
          });
          loadFriendships();
        } else {
          Toast.show({
            type: "error",
            text1: `❌ ${res?.message}`,
          });
        }
      }
    }
  }

  function handleViewProfile(person: any, friendshipStatus: number) {
    router.push({
      pathname: "/(stack)/userProfile",
      params: {
        userId: person.userId,
        clientId: person.id,
        friendStatus: friendshipStatus,
      },
    });
  }

  if (isLoading && people.length === 0 && !isRefreshing) {
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
            Pessoas
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
            Carregando pessoas...
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
          Pessoas
        </Text>
      </View>

      {/* Search Filter */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 15,
          paddingBottom: 10,
          backgroundColor: themeColors.background,
          borderBottomWidth: 1,
          borderBottomColor: themeColors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <MFTextInput
              themeColors={themeColors}
              placeholder="Buscar pessoas..."
              value={searchText}
              onChangeText={setSearchText}
              error=""
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            onPress={handleSearch}
            disabled={isLoading}
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              backgroundColor: themeColors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={themeColors.white} />
            ) : (
              <Ionicons name="search" size={24} color={themeColors.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* People List */}
      <FlatList
        data={people}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const friendshipStatus = getFriendshipStatus(item.id);
          return (
            <MFPersonCard
              themeColors={themeColors}
              person={item}
              friendshipStatus={friendshipStatus}
              onAddFriend={() => handleAddFriend(item.id, friendshipStatus)}
              onPress={() => handleViewProfile(item, friendshipStatus)}
            />
          );
        }}
        ListEmptyComponent={
          <View
            style={{
              padding: 40,
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: themeColors.textSecondary, textAlign: "center" }}
            >
              {searchText
                ? "Nenhuma pessoa encontrada"
                : "Digite algo para buscar pessoas"}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[themeColors.primary]}
            tintColor={themeColors.primary}
          />
        }
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 100,
          paddingHorizontal: 20,
        }}
      />
    </View>
  );
}
