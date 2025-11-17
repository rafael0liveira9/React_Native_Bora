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

export async function sendToS3(file: any, path: string, token: string) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);

    const response = await axios.post(`${API_URL}/upload-image`, formData, {
      headers: {
        Authorization: token,
        "content-type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    return {
      status: error?.response?.status || error?.status,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Ocorreu um erro desconhecido.",
    };
  }
}
