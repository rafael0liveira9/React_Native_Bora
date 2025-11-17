import axios from "axios";
import Constants from "expo-constants";

const getApiUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (debuggerHost) {
    return `http://${debuggerHost}:3001`;
  }
  return "http://192.168.1.10:3001";
};

const API_URL = getApiUrl();

export async function getMyFriends(token: string) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada.");
    }

    const response = await axios.get(`${API_URL}/friends`, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error: any) {
    return {
      status: error?.status,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Ocorreu um erro desconhecido.",
    };
  }
}

export async function getFriendRequests(token: string) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada.");
    }

    const response = await axios.get(`${API_URL}/friends-request`, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error: any) {
    return {
      status: error?.status,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Ocorreu um erro desconhecido.",
    };
  }
}

export async function sendFriendRequest(token: string, friendId: number) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada.");
    }

    const response = await axios.post(
      `${API_URL}/friends-request-post`,
      { friendId },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return {
      status: error?.status,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Ocorreu um erro desconhecido.",
    };
  }
}

export async function acceptFriendRequest(token: string, friendshipId: number) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada.");
    }

    const response = await axios.put(
      `${API_URL}/friends-accept`,
      { id: friendshipId },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return {
      status: error?.status,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Ocorreu um erro desconhecido.",
    };
  }
}
