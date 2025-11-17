import { globalStyles } from "@/styles/global";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import { MFCreatePostCard, MFMyPostCard } from "./cards";
import MFStackEditSubtitle from "./stackEditSubtitle";

interface MFDefaultCardProps extends ViewProps {
  isLoading: boolean;
  themeColors?: any;
  posts?: any;
  deleteThisPost: (value: number) => void;
  unassignOpen: boolean;
  tempDel?: any;
  isPostLoading: boolean;
  setUnassignOpen: (value: boolean) => void;
  goToEditPost: (data: any) => void;
  HandleSendPost: () => void;
  HandleEditPost: () => void;
  title: string | null;
  setTitle: (value: string | null) => void;
  description: string | null;
  setDescription: (value: string | null) => void;
  pickImage: () => void;
  openCamera: () => void;
  image: any;
  postStatus: string;
  setPostStatus: (value: string) => void;
  isPostOpen: boolean;
  setIsPostOpen: (value: boolean) => void;
  noImage: () => void;
  imageUrl?: string | null;
  postId?: number | null;
  setPostId: (value: number | null) => void;
  token?: string;
  userId?: number;
}

export default function MFProfilePostsCard({
  isLoading,
  themeColors,
  posts,
  tempDel,
  deleteThisPost,
  unassignOpen,
  setUnassignOpen,
  goToEditPost,
  HandleSendPost,
  HandleEditPost,
  title,
  setTitle,
  description,
  isPostLoading,
  setDescription,
  pickImage,
  openCamera,
  image,
  postStatus,
  setPostStatus,
  isPostOpen,
  setIsPostOpen,
  noImage,
  imageUrl,
  postId,
  setPostId,
  token,
  userId,
}: MFDefaultCardProps) {
  const [user, setUser] = useState<any>(),
    [myPosts, setMyPosts] = useState<any>();

  useEffect(() => {
    if (posts?.alreadyClient) {
      setUser(posts.alreadyClient);
    }
    if (posts?.posts) {
      setMyPosts(posts?.posts);
    }
  }, [posts]);

  return (
    <View
      style={[
        styles.container,
        {
          flex: 1,
          backgroundColor: themeColors.background,
        },
      ]}
    >
      <View style={{ paddingBottom: 20, paddingHorizontal: 15 }}>
        <MFStackEditSubtitle
          themeColors={themeColors}
          title="Minhas postagens"
          info="Aqui você pode ver e gerenciar as postagens de sua autoria."
        ></MFStackEditSubtitle>
      </View>
      {myPosts &&
        Array.isArray(myPosts) &&
        myPosts.map((e: any, y: number) => {
          if (tempDel && tempDel.includes(e.id)) {
            return null;
          }
          if (postId === e.id) {
            return (
              <MFCreatePostCard
                key={e.id}
                isLoading={isPostLoading}
                themeColors={themeColors}
                HandleSendPost={() => {}}
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
                noImage={noImage}
              />
            );
          } else {
            return (
              <View key={`post-${e.id}`} style={{ width: "100%" }}>
                <MFMyPostCard
                  themeColors={themeColors}
                  data={e}
                  user={user}
                  deleteThisPost={deleteThisPost}
                  isLoading={isLoading}
                  isPostLoading={isPostLoading}
                  unassignOpen={unassignOpen}
                  setUnassignOpen={setUnassignOpen}
                  goToEditPost={goToEditPost}
                  token={token}
                  userId={userId}
                />
              </View>
            );
          }
        })}

      <View
        style={[
          globalStyles.flexr,
          { width: "100%", height: 70, marginBottom: 50 },
        ]}
      >
        <Text style={{ color: themeColors.text, fontSize: 16 }}>
          {myPosts && Array.isArray(myPosts) && myPosts.length > 0
            ? `Não há mais postagens.`
            : `Não há postagens.`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingVertical: 30,
  },
});
