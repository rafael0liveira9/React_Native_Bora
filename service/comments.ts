import axios from "axios";
import Constants from "expo-constants";

const getApiUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (debuggerHost) {
    return `http://${debuggerHost}:3001`;
  }
  return "http://192.168.1.10:3001";
};

const apiUrl = getApiUrl();

export async function getCommentsByPost({ postId, token }: { postId: number; token: string }) {
    try {
        const response = await axios.get(`${apiUrl}/comments/${postId}`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar comentários:", error);
        return null;
    }
}

export async function createComment({
    content,
    postId,
    parentCommentId,
    token,
}: {
    content: string;
    postId: number;
    parentCommentId?: number;
    token: string;
}) {
    try {
        const response = await axios.post(
            `${apiUrl}/comment`,
            {
                content,
                postId,
                parentCommentId,
            },
            {
                headers: {
                    Authorization: token,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao criar comentário:", error);
        return null;
    }
}

export async function deleteComment({ commentId, token }: { commentId: number; token: string }) {
    try {
        const response = await axios.delete(`${apiUrl}/comment`, {
            headers: {
                Authorization: token,
            },
            data: {
                commentId,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao deletar comentário:", error);
        return null;
    }
}
