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

export async function getMyImages({ token }: { token: string }) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(`${API_URL}/my-images`, {
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

export async function getUserImages({
  clientId,
  token
}: {
  clientId: number;
  token: string;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(`${API_URL}/user-images/${clientId}`, {
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

export async function addImage({
  url,
  token
}: {
  url: string;
  token: string;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.post(
      `${API_URL}/image`,
      { url },
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

export async function deleteImage({
  imageId,
  token
}: {
  imageId: number;
  token: string;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.delete(`${API_URL}/image`, {
      headers: {
        Authorization: token,
      },
      data: {
        imageId,
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

export async function reorderImages({
  images,
  token
}: {
  images: Array<{ id: number; order: number }>;
  token: string;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.put(
      `${API_URL}/reorder-images`,
      { images },
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
