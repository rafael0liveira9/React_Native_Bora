import {
  MFAdmimPostCard,
  MFCreatePostCard,
  MFMyPostCard,
  MFPostCard,
  MFPubliCard,
} from "@/components/eai-bora-ui/cards";
import { EventFloatingButton } from "@/components/eai-bora-ui/eventFloatingButton";
import { PostSkeleton } from "@/components/eai-bora-ui/skeleton";
import MFStackEditSubtitle from "@/components/eai-bora-ui/stackEditSubtitle";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { useViewMode } from "@/context/ViewModeContext";
import {
  deletePost,
  getAllPosts,
  newCompanyPost,
  newPost,
  updatePost,
} from "@/service/posts";
import {
  acceptFriendRequest,
  getAllMyFriends,
  newFriendRequest,
} from "@/service/relations";
import { getMyData } from "@/service/user";
import { globalStyles } from "@/styles/global";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  findNodeHandle,
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

import Toast from "react-native-toast-message";

export default function HomeScren() {
  const scrollRef = useRef<ScrollView>(null);
  const targetRef = useRef<View>(null);
  const lastScrollY = useRef(0);
  const scrollDirectionStartY = useRef(0);
  const currentDirection = useRef<"up" | "down" | null>(null);
  const createPostAnimation = useRef(new Animated.Value(1)).current;

  const width = Dimensions.get("window").width;
  const { theme } = useTheme();
  const { viewMode } = useViewMode();
  const themeColors = Colors[`${theme}`],
    router = useRouter(),
    [isPostOpen, setIsPostOpen] = useState<boolean>(false),
    [token, setToken] = useState<string>(),
    [user, setUser] = useState<any>(),
    [postStatus, setPostStatus] = useState<string>("1"),
    [posts, setPosts] = useState<any>(),
    [myFriends, setMyFriends] = useState<any>(),
    [postId, setPostId] = useState<number | null>(null),
    [title, setTitle] = useState<string | null>(null),
    [description, setDescription] = useState<string | null>(null),
    [image, setImage] = useState<any>(null),
    [imageUrl, setImageUrl] = useState<any>(null),
    [tempDel, setTempDel] = useState<number[]>([]),
    [isPostLoading, setIsPostLoading] = useState<boolean>(false),
    [refreshing, setRefreshing] = useState(false),
    [isLoading, setIsLoading] = useState<boolean>(false),
    [unassignOpen, setUnassignOpen] = useState<boolean>(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowScrollButton(scrollY > 300);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const y = await SecureStore.getItemAsync("userId");
      const z = await SecureStore.getItemAsync("userToken");

      setToken(z ?? undefined);

      if (y && z) {
        const data: any = await getAllPosts({ token: z });
        const MyData: any = await getMyData({ token: z });

        if (!!MyData) {
          setUser({
            id: MyData?.user?.id,
            type: MyData?.typeId,
            email: MyData?.user?.email,
            client: {
              id: MyData?.user?.client?.id,
              document: MyData?.user?.client?.document,
              cref: MyData?.user?.client?.cref,
              name: MyData?.user?.client?.name,
              nick: MyData?.user?.client?.nick,
              description: MyData?.user?.client?.description,
              phone: MyData?.user?.client?.phone,
              photo: MyData?.user?.client?.photo,
              backgroundImage: MyData?.user?.client?.backgroundImage,
              objective: MyData?.user?.client?.objective,
              instagram: MyData?.user?.client?.instagram,
              gender: MyData?.user?.client?.gender,
              birthDate: MyData?.user?.client?.birthDate,
            },
          });
        }

        if (!!data) {
          setPosts(data);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro ao recuperar usuário:", error);
      setIsLoading(false);
      return null;
    }
    setRefreshing(false);
  };

  async function getData() {
    setIsLoading(true);

    try {
      const y = await SecureStore.getItemAsync("userId");
      const z = await SecureStore.getItemAsync("userToken");

      setToken(z ?? undefined);

      if (y && z) {
        const data: any = await getAllPosts({ token: z });
        const MyData: any = await getMyData({ token: z });
        const friends: any = await getAllMyFriends({ token: z });

        if (!!friends) {
          let xx = friends.friends.map((e: any) => {
            if (!!e.sender || !!e.friend) {
              if (MyData?.user?.client?.id !== e.sender) {
                return e.sender;
              }
              if (MyData?.user?.client?.id !== e.friend) {
                return e.friend;
              }
            }
          });
          let yy = friends.requests.map((e: any) => {
            if (!!e.friend) {
              if (MyData?.user?.client?.id !== e.friend) {
                return e.friend;
              }
            }
          });
          let zz = friends.receives.map((e: any) => {
            if (!!e.sender) {
              if (MyData?.user?.client?.id !== e.sender) {
                return e.sender;
              }
            }
          });

          setMyFriends({ friends: xx, requests: yy, receives: zz });
        }

        if (!!MyData) {
          setUser({
            id: MyData?.user?.id,
            type: MyData?.typeId,
            email: MyData?.user?.email,
            client: {
              id: MyData?.user?.client?.id,
              document: MyData?.user?.client?.document,
              cref: MyData?.user?.client?.cref,
              name: MyData?.user?.client?.name,
              nick: MyData?.user?.client?.nick,
              description: MyData?.user?.client?.description,
              phone: MyData?.user?.client?.phone,
              photo: MyData?.user?.client?.photo,
              backgroundImage: MyData?.user?.client?.backgroundImage,
              objective: MyData?.user?.client?.objective,
              instagram: MyData?.user?.client?.instagram,
              gender: MyData?.user?.client?.gender,
              birthDate: MyData?.user?.client?.birthDate,
            },
          });
        }

        if (!!data) {
          setPosts(data);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro ao recuperar usuário:", error);
      setIsLoading(false);
      return null;
    }
  }

  function getMimeType(uri: string): string {
    const extension = uri.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "webp":
        return "image/webp";
      default:
        return "image/jpeg";
    }
  }

  async function pickImage() {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Você precisa permitir acesso à galeria!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setIsPostLoading(true);
      const selectedAsset = result.assets[0];
      const name = selectedAsset.uri.split("/").pop() || "photo.jpg";
      const type = getMimeType(selectedAsset.uri) || "image/jpeg";

      const file = {
        uri: selectedAsset.uri,
        name: name,
        type: type,
      } as any;

      if (file) {
        setImage(file);
        Keyboard.dismiss();
        setIsPostLoading(false);
      } else {
        Toast.show({
          type: "error",
          text1: `Erro ao carregar imagem.`,
        });
      }
      setIsPostLoading(false);
    }
  }

  async function openCamera() {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Você precisa permitir acesso à câmera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setIsPostLoading(true);
      const selectedAsset = result.assets[0];
      const token = await SecureStore.getItemAsync("userToken");
      const name = selectedAsset.uri.split("/").pop() || "photo.jpg";
      const type = getMimeType(selectedAsset.uri) || "image/jpeg";

      const file = {
        uri: selectedAsset.uri,
        name: name,
        type: type,
      } as any;

      if (file) {
        setImage(file);
        Keyboard.dismiss();
        setIsPostLoading(false);
      } else {
        Toast.show({
          type: "error",
          text1: `Erro ao carregar imagem.`,
        });
      }
      setIsPostLoading(false);
    }
  }

  const publi = [
    {
      id: 1,
      image: require("@/assets/images/eai-bora/anuncio-test.png"),
      url: "https://wa.me/5541992730204?text=Ol%C3%A1%2C%20quero%20anunciar",
    },
  ];

  async function HandleSendPost() {
    if (!!postStatus && !!token && (!!title || !!description || !!image)) {
      setIsPostLoading(true);

      const postPost =
        viewMode === "company"
          ? await newCompanyPost({
              token: token,
              title: title,
              description: description,
              image: image,
              postStatus: postStatus,
            })
          : await newPost({
              token: token,
              title: title,
              description: description,
              image: image,
              postStatus: postStatus,
            });

      if (!!postPost.post) {
        setIsPostOpen(false);
        setImage(null);
        setTitle(null);
        setDescription(null);
        getData();
        Toast.show({
          type: "success",
          text1:
            viewMode === "company"
              ? "Post da empresa criado com sucesso."
              : "Post criado com sucesso.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Falha ao criar postagem.",
        });
      }

      setIsPostLoading(false);
    }
  }

  async function HandleEditPost() {
    if (
      !!postId &&
      !!postStatus &&
      !!token &&
      (!!title || !!description || !!image)
    ) {
      setIsPostLoading(true);
      const postPost = await updatePost({
        id: postId,
        token: token,
        title: title,
        description: description,
        image: image,
        postStatus: postStatus,
      });

      if (!!postPost.post) {
        setIsPostOpen(false);
        setImage(null);
        setTitle(null);
        setDescription(null);
        setPostId(null);
        getData();
        Toast.show({
          type: "success",
          text1: "Post alterado com sucesso.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Falha ao alterar postagem.",
        });
      }

      setIsPostLoading(false);
    }
  }

  async function deleteThisPost(id: number) {
    if (id && token) {
      setIsPostLoading(true);
      const x = await deletePost({
        id: id,
        token: token,
      });

      if (x?.status === 200) {
        setTempDel([...tempDel, id]);
        Toast.show({
          type: "success",
          text1: `Post removido.`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: `Erro ao remover o post.`,
        });
      }
      setIsPostLoading(false);
      setUnassignOpen(false);
    }
  }

  function goToEditPost(data: any) {
    setPostId(data?.id);
    setTitle(data?.title ? data?.title : null);
    setDescription(data?.description ? data?.description : null);
    setImageUrl(data?.image ? data?.image : null);
    setPostStatus(data?.type ? data?.type : "1");

    setIsPostOpen(true);
  }

  async function addFriendFunction({
    friendStatus,
    id,
  }: {
    friendStatus: number;
    id: number;
  }) {
    try {
      switch (friendStatus) {
        case 1:
          const response = await newFriendRequest({ id: id, token: token! });
          if (response?.success || response?.data) {
            Toast.show({
              type: "success",
              text1: response?.message || "Solicitação enviada!",
            });
          }
          break;

        case 3:
          await acceptFriendRequest({ id: id, token: token!, accept: false });
          Toast.show({
            type: "info",
            text1: "Solicitação cancelada",
          });
          break;

        case 4:
          await acceptFriendRequest({ id: id, token: token!, accept: true });
          Toast.show({
            type: "success",
            text1: "Agora vocês são amigos!",
          });
          break;

        default:
          break;
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error?.message || "Erro ao processar ação",
      });
    }
  }

  const scrollToSubtitle = () => {
    const targetHandle = findNodeHandle(targetRef.current);
    const scrollHandle = findNodeHandle(scrollRef.current);

    if (targetHandle != null && scrollHandle != null) {
      UIManager.measureLayout(
        targetHandle,
        scrollHandle,
        () => {},
        (x, y) => {
          scrollRef.current?.scrollTo({ y, animated: true });
        }
      );
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!!image || !!title || !!description) {
      setIsPostOpen(true);
    }
  }, [image, title, description]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeColors.background,
        position: "relative",
      }}
    >
      {showScrollButton && (
        <View
          style={[
            globalStyles.flexr,
            {
              position: "absolute",
              top: 80,
              zIndex: 999,
              width: "100%",
              opacity: 0.7,
            },
          ]}
        >
          <TouchableOpacity
            onPress={scrollToSubtitle}
            style={{
              backgroundColor: themeColors.background,
              borderRadius: 200,
              borderWidth: 2,
              borderColor: themeColors.background,
            }}
          >
            <AntDesign name="upcircle" size={50} color={themeColors.primary} />
          </TouchableOpacity>
        </View>
      )}
      <View style={{ flex: 1, paddingTop: 20 }}>
        <Animated.View
          style={{
            opacity: createPostAnimation,
            transform: [
              {
                translateY: createPostAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              },
              {
                scaleY: createPostAnimation,
              },
            ],
          }}
        >
          <MFCreatePostCard
            isLoading={isPostLoading}
            themeColors={themeColors}
            HandleSendPost={HandleSendPost}
            HandleEditPost={HandleEditPost}
            title={title}
            setTitle={setTitle}
            postStatus={postStatus}
            setPostStatus={setPostStatus}
            description={description}
            setDescription={setDescription}
            pickImage={pickImage}
            openCamera={openCamera}
            image={image}
            imageUrl={imageUrl}
            postId={postId}
            isPostOpen={isPostOpen}
            setIsPostOpen={setIsPostOpen}
            setPostId={setPostId}
            noImage={() => {
              setImage(null);
              setImageUrl(null);
            }}
          />
        </Animated.View>

        {isLoading ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[themeColors.primary]}
                tintColor={themeColors.primary}
              />
            }
          >
            <PostSkeleton themeColors={themeColors} />
            <PostSkeleton themeColors={themeColors} />
            <PostSkeleton themeColors={themeColors} />
          </ScrollView>
        ) : (
          <ScrollView
            ref={scrollRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[themeColors.primary]}
                tintColor={themeColors.primary}
              />
            }
          >
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 20,
              }}
            >
              <MFStackEditSubtitle
                themeColors={themeColors}
                title={`Olá${
                  user?.client?.nick
                    ? ", " + user?.client?.nick
                    : user?.client?.name
                    ? ", " + user?.client?.name
                    : ""
                }!`}
                align="left"
              ></MFStackEditSubtitle>
            </View>
            {posts?.posts &&
              Array.isArray(posts.posts) &&
              posts.posts
                .filter((e: any, y: number) => y <= 3)
                .map((e: any, y: number) => {
                  // Get author client for friend status checks
                  const authorClient = e.authorId
                    ? e.client
                    : e.company?.responsible?.client;

                  let friendStatus = 1;

                  if (
                    !!myFriends.friends &&
                    Array.isArray(myFriends.friends) &&
                    myFriends.friends.includes(authorClient?.id)
                  ) {
                    friendStatus = 2;
                  }

                  if (
                    !!myFriends.requests &&
                    Array.isArray(myFriends.requests) &&
                    myFriends.requests.includes(authorClient?.id)
                  ) {
                    friendStatus = 3;
                  }

                  if (
                    !!myFriends.receives &&
                    Array.isArray(myFriends.receives) &&
                    myFriends.receives.includes(authorClient?.id)
                  ) {
                    friendStatus = 4;
                  }

                  if (!e.authorId) {
                    friendStatus = 5;
                  }

                  if (authorClient?.userType === 3) {
                    return (
                      <View key={`post-${e.id}`}>
                        <MFAdmimPostCard
                          themeColors={themeColors}
                          data={e}
                          token={token}
                          userId={user?.client?.id}
                        />
                      </View>
                    );
                  }

                  if (e.authorId && e.authorId === user?.client?.id) {
                    if (tempDel.includes(e.id)) return null;
                    return (
                      <View key={`post-${e.id}`}>
                        <MFMyPostCard
                          themeColors={themeColors}
                          data={e}
                          user={user}
                          deleteThisPost={deleteThisPost}
                          isLoading={isPostLoading}
                          unassignOpen={unassignOpen}
                          setUnassignOpen={setUnassignOpen}
                          goToEditPost={goToEditPost}
                          token={token}
                          userId={user?.client?.id}
                        />
                      </View>
                    );
                  }

                  return (
                    <View key={`post-${e.id}`}>
                      <MFPostCard
                        themeColors={themeColors}
                        data={e}
                        friendStatus={friendStatus}
                        onPress={() =>
                          addFriendFunction({
                            friendStatus: friendStatus,
                            id: authorClient?.id,
                          })
                        }
                        token={token}
                        userId={user?.client?.id}
                      />
                    </View>
                  );
                })}
            {publi &&
              Array.isArray(publi) &&
              publi.map((pub: any, index: number) => (
                <View key={`publi-${pub.id}`}>
                  <MFPubliCard themeColors={themeColors} data={pub} />
                </View>
              ))}
            {posts?.posts &&
              Array.isArray(posts.posts) &&
              posts.posts
                .filter((e: any, y: number) => y > 3)
                .map((e: any, y: number) => {
                  // Get author client for friend status checks
                  const authorClient = e.authorId
                    ? e.client
                    : e.company?.responsible?.client;

                  let friendStatus = 1;

                  if (
                    !!myFriends.receives &&
                    Array.isArray(myFriends.receives) &&
                    myFriends.receives.includes(authorClient?.id)
                  ) {
                    friendStatus = 4;
                  }

                  if (
                    !!myFriends.requests &&
                    Array.isArray(myFriends.requests) &&
                    myFriends.requests.includes(authorClient?.id)
                  ) {
                    friendStatus = 3;
                  }

                  if (
                    !!myFriends.friends &&
                    Array.isArray(myFriends.friends) &&
                    myFriends.friends.includes(authorClient?.id)
                  ) {
                    friendStatus = 2;
                  }

                  // Check if it's my post (authorId exists and is mine)
                  if (e.authorId && e.authorId === user?.client?.id) {
                    if (tempDel.includes(e.id)) return null;
                    return (
                      <View key={`post-${e.id}`}>
                        <MFMyPostCard
                          themeColors={themeColors}
                          data={e}
                          user={user}
                          deleteThisPost={deleteThisPost}
                          isLoading={isPostLoading}
                          unassignOpen={unassignOpen}
                          setUnassignOpen={setUnassignOpen}
                          goToEditPost={goToEditPost}
                          token={token}
                          userId={user?.client?.id}
                        />
                      </View>
                    );
                  }

                  // All other posts (including company posts)
                  return (
                    <View key={`post-${e.id}`}>
                      <MFPostCard
                        themeColors={themeColors}
                        data={e}
                        friendStatus={friendStatus}
                        onPress={() =>
                          addFriendFunction({
                            friendStatus: friendStatus,
                            id: authorClient?.id,
                          })
                        }
                        token={token}
                        userId={user?.client?.id}
                      />
                    </View>
                  );
                })}
            <View
              style={[
                globalStyles.flexr,
                { width: "100%", height: 70, marginBottom: 100 },
              ]}
            >
              <Text style={{ color: themeColors.text, fontSize: 16 }}>
                {posts?.posts &&
                Array.isArray(posts.posts) &&
                posts.posts.length > 0
                  ? `Não há mais postagens.`
                  : `Não há postagens.`}
              </Text>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Float Button para criar evento - apenas modo empresa */}
      {viewMode === "company" && (
        <EventFloatingButton themeColors={themeColors} />
      )}
    </View>
  );
}
