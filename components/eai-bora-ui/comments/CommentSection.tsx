import {
  createComment,
  deleteComment,
  getCommentsByPost,
} from "@/service/comments";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/pt-br";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

moment.locale("pt-br");

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    nick: string;
    photo: string;
  };
  replies: Comment[];
}

interface CommentSectionProps {
  postId: number;
  token: string;
  themeColors: any;
  userId: number;
  initialCommentsCount?: number;
}

export default function CommentSection({
  postId,
  token,
  themeColors,
  userId,
  initialCommentsCount = 0,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [inputText, setInputText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyingToName, setReplyingToName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      loadComments();
    }
  }, [isExpanded]);

  async function loadComments() {
    setLoading(true);
    const data = await getCommentsByPost({ postId, token });
    if (data?.comments) {
      setComments(data.comments);
    }
    setLoading(false);
  }

  async function handleSendMessage() {
    if (!inputText.trim()) return;

    const result = await createComment({
      content: inputText,
      postId,
      parentCommentId: replyingTo || undefined,
      token,
    });

    if (result?.comment) {
      setInputText("");
      setReplyingTo(null);
      setReplyingToName("");
      loadComments();
      Toast.show({
        type: "success",
        text1: replyingTo ? "Resposta enviada!" : "Comentário enviado!",
      });
    } else {
      Toast.show({
        type: "error",
        text1: replyingTo ? "Erro ao enviar resposta" : "Erro ao enviar comentário",
      });
    }
  }

  function handleReplyClick(commentId: number, authorName: string) {
    setReplyingTo(commentId);
    setReplyingToName(authorName);
  }

  function handleCancelReply() {
    setReplyingTo(null);
    setReplyingToName("");
    setInputText("");
  }

  async function handleDeleteComment(commentId: number) {
    const result = await deleteComment({ commentId, token });
    if (result) {
      loadComments();
      Toast.show({
        type: "success",
        text1: "Comentário deletado!",
      });
    }
  }

  function renderComment(comment: Comment, isReply: boolean = false) {
    const isMyComment =
      comment.author?.author_id === userId || comment.author?.id === userId;

    return (
      <View
        key={comment.id}
        style={{
          marginLeft: isReply ? 40 : 0,
          marginTop: isReply ? 8 : 5,
          marginBottom: isReply ? 0 : 5,
          backgroundColor: isReply ? 'transparent' : `${themeColors.primary}08`,
          borderRadius: isReply ? 0 : 12,
          padding: isReply ? 0 : 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          {/* Avatar */}
          <View
            style={{
              width: isReply ? 32 : 40,
              height: isReply ? 32 : 40,
              borderRadius: 100,
              backgroundColor: themeColors.cardBackground,
              overflow: "hidden",
              marginRight: 8,
            }}
          >
            {comment.author?.photo || comment.author_photo ? (
              <Image
                source={{ uri: comment.author?.photo || comment.author_photo }}
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
                <Text
                  style={{
                    color: "#FFF",
                    fontWeight: "bold",
                    fontSize: isReply ? 14 : 16,
                  }}
                >
                  {(comment.author?.name || comment.author_name)
                    ?.charAt(0)
                    .toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {/* Comment Content */}
          <View style={{ flex: 1 }}>
            {/* Comment Bubble */}
            <View
              style={{
                backgroundColor: themeColors.cardBackground,
                borderRadius: 18,
                padding: 12,
                paddingHorizontal: 14,
              }}
            >
              <Text
                style={{
                  color: themeColors.text,
                  fontWeight: "600",
                  fontSize: isReply ? 13 : 14,
                  marginBottom: 2,
                }}
              >
                {comment.author?.nick ||
                  comment.author?.name ||
                  comment.author_nick ||
                  comment.author_name}
              </Text>
              <Text
                style={{
                  color: themeColors.text,
                  fontSize: isReply ? 13 : 14,
                  lineHeight: 20,
                }}
              >
                {comment.content}
              </Text>
            </View>

            {/* Action Buttons */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 4,
                marginLeft: 14,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: themeColors.textSecondary,
                  fontSize: 12,
                  marginRight: 16,
                }}
              >
                {moment(comment.createdAt).fromNow()}
              </Text>

              {!isReply && (
                <TouchableOpacity
                  onPress={() =>
                    handleReplyClick(
                      comment.id,
                      comment.author?.nick ||
                        comment.author?.name ||
                        comment.author_nick ||
                        comment.author_name ||
                        "Usuário"
                    )
                  }
                >
                  <Text
                    style={{
                      color: themeColors.textSecondary,
                      fontSize: 12,
                      fontWeight: "600",
                      marginRight: 16,
                    }}
                  >
                    Responder
                  </Text>
                </TouchableOpacity>
              )}

              {isMyComment && (
                <TouchableOpacity
                  onPress={() => handleDeleteComment(comment.id)}
                >
                  <Text
                    style={{
                      color: themeColors.error,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    Deletar
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <View style={{ marginTop: 4 }}>
                {comment.replies.map((reply) => renderComment(reply, true))}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  if (!isExpanded) {
    const displayCount = comments.length > 0 ? comments.length : initialCommentsCount;
    return (
      <TouchableOpacity
        onPress={() => setIsExpanded(true)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderTopWidth: 1,
          borderTopColor: themeColors.border,
        }}
      >
        <Ionicons
          name="chatbubble-outline"
          size={20}
          color={themeColors.textSecondary}
        />
        <Text
          style={{
            color: themeColors.textSecondary,
            marginLeft: 8,
            fontSize: 14,
          }}
        >
          Comentários {displayCount > 0 && `(${displayCount})`}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: themeColors.border,
        paddingTop: 12,
      }}
    >
      {/* Header */}
      <TouchableOpacity
        onPress={() => setIsExpanded(false)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingBottom: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="chatbubbles" size={20} color={themeColors.primary} />
          <Text
            style={{
              color: themeColors.text,
              marginLeft: 8,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Comentários {comments.length > 0 && `(${comments.length})`}
          </Text>
        </View>
        <Ionicons
          name="chevron-up"
          size={20}
          color={themeColors.textSecondary}
        />
      </TouchableOpacity>

      {/* Comments List */}
      <View style={{ paddingHorizontal: 16, maxHeight: 400 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={{ paddingVertical: 20, alignItems: "center" }}>
              <ActivityIndicator size="small" color={themeColors.primary} />
            </View>
          ) : comments.length === 0 ? (
            <View style={{ paddingVertical: 20, alignItems: "center" }}>
              <Text style={{ color: themeColors.textSecondary, fontSize: 14 }}>
                Seja o primeiro a comentar!
              </Text>
            </View>
          ) : (
            comments.map((comment) => renderComment(comment))
          )}
        </ScrollView>
      </View>

      {/* Input Area */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8,
          backgroundColor: themeColors.background,
        }}
      >
        {/* Reply Label */}
        {replyingTo && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 8,
            }}
          >
            <Text
              style={{
                color: themeColors.primary,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              Respondendo a: {replyingToName}
            </Text>
            <TouchableOpacity onPress={handleCancelReply}>
              <Ionicons
                name="close-circle"
                size={20}
                color={themeColors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Input Field */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: themeColors.cardBackground,
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 8,
          }}
        >
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={
              replyingTo
                ? "Escreva uma resposta..."
                : "Escreva um comentário..."
            }
            placeholderTextColor={themeColors.textSecondary}
            style={{
              flex: 1,
              color: themeColors.text,
              fontSize: 14,
              maxHeight: 80,
            }}
            multiline
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={22}
              color={
                inputText.trim()
                  ? themeColors.primary
                  : themeColors.textSecondary
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
