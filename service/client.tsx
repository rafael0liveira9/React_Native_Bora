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

export async function getClients({
  token,
  searchString = "",
  page = 0,
  pageSize = 20,
}: {
  token: string;
  searchString?: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada.");
    }

    const response = await axios.get(`${API_URL}/get-clients`, {
      headers: {
        Authorization: token,
      },
      params: {
        string: searchString,
        page,
        pageSize,
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
