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
import { getMyData } from "@/service/user";
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
  const [clientId, setClientId] = useState<number>(0);
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
    if (userToken) {
      setToken(userToken);

      // Buscar dados do usuário para pegar o clientId
      const userData = await getMyData({ token: userToken });
      console.log('👤 Dados do usuário:', userData);
      if (userData?.user?.client?.id) {
        setClientId(userData.user.client.id);
        console.log('👤 ClientId setado:', userData.user.client.id);
      }
    }
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
    const friendsData = await getMyFriends(token);
    console.log('📊 Dados recebidos:', JSON.stringify(friendsData, null, 2));

    if (friendsData) {
      // Combina requests (enviados) e receives (recebidos) em friendships
      const allFriendships = [
        ...(friendsData.requests || []),
        ...(friendsData.receives || []),
      ];
      console.log('📊 Total friendships:', allFriendships.length);
      console.log('📊 Total friends:', (friendsData.friends || []).length);

      setFriendships(allFriendships);

      // Amigos aceitos
      setFriends(friendsData.friends || []);
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
    console.log(`🔍 Verificando status para personId=${personId}, clientId=${clientId}`);
    console.log(`🔍 Total friends:`, friends.length);
    console.log(`🔍 Total friendships:`, friendships.length);

    // Check if already friends
    const isFriend = friends.find(
      (f) =>
        (f.sender === clientId && f.friend === personId) ||
        (f.friend === clientId && f.sender === personId)
    );
    console.log(`🔍 isFriend:`, isFriend);
    if (isFriend && isFriend.accept === 1) {
      console.log(`✅ Status: 2 (Amigo)`);
      return 2; // Amigo
    }

    // Check if there's a pending request sent by me
    const sentRequest = friendships.find(
      (f) =>
        f.sender === clientId && f.friend === personId && f.accept === 0
    );
    console.log(`🔍 sentRequest:`, sentRequest);
    if (sentRequest) {
      console.log(`✅ Status: 3 (Pedido enviado)`);
      return 3; // Pedido enviado
    }

    // Check if there's a pending request received
    const receivedRequest = friendships.find(
      (f) =>
        f.friend === clientId && f.sender === personId && f.accept === 0
    );
    console.log(`🔍 receivedRequest:`, receivedRequest);
    if (receivedRequest) {
      console.log(`✅ Status: 4 (Pedido recebido)`);
      return 4; // Pedido recebido
    }

    console.log(`✅ Status: 1 (Não amigo)`);
    return 1; // Não amigo
  }

  async function handleAddFriend(personId: number, friendshipStatus: number) {
    try {
      if (friendshipStatus === 1) {
        // Enviar pedido
        console.log('📤 Enviando pedido para:', personId);
        const res = await sendFriendRequest(token, personId);
        console.log('📤 Resposta:', res);
        if (res?.success || res?.data) {
          Toast.show({
            type: "success",
            text1: res?.message || "✅ Pedido enviado!",
          });
          loadFriendships();
        }
      } else if (friendshipStatus === 4) {
        // Aceitar pedido recebido
        console.log('✅ Procurando pedido para aceitar...');
        console.log('✅ clientId:', clientId, 'personId:', personId);

        const request = friendships.find(
          (f) =>
            f.friend === clientId &&
            f.sender === personId &&
            f.accept === 0
        );
        console.log('✅ Pedido encontrado:', request);

        if (request) {
          console.log('✅ Aceitando pedido. Sender:', request.sender);
          const res = await acceptFriendRequest(token, request.sender, true);
          console.log('✅ Resposta:', res);

          if (res?.success || res?.data) {
            Toast.show({
              type: "success",
              text1: res?.message || "✅ Amizade aceita!",
            });
            loadFriendships();
          }
        } else {
          console.log('❌ Pedido não encontrado!');
        }
      }
    } catch (error: any) {
      console.log('❌ Erro:', error);
      Toast.show({
        type: "error",
        text1: `❌ ${error?.message || "Erro ao processar ação"}`,
      });
    }
  }

  function handleViewProfile(person: any, friendshipStatus: number) {
    console.log('🔗 Navegando para perfil:', person);
    console.log('🔗 userId:', person.userId);
    console.log('🔗 clientId:', person.id);
    console.log('🔗 friendStatus:', friendshipStatus);

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
