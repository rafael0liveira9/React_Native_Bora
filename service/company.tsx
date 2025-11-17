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

export async function getCompanyById({
  companyId,
  token,
}: {
  companyId: number;
  token: string;
}) {
  try {
    console.log("📡 Chamando API:", `${API_URL}/company/${companyId}`);
    const response = await axios.get(`${API_URL}/company/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("✅ Resposta recebida:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("❌ Erro na API:", error.response?.data || error.message);
    return {
      company: null,
      message: error.response?.data?.message || "Erro ao buscar empresa",
    };
  }
}

export async function getCompanyPosts({
  companyId,
  token,
}: {
  companyId: number;
  token: string;
}) {
  try {
    const response = await axios.get(`${API_URL}/company-posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        companyId,
      },
    });
    return response.data;
  } catch (error: any) {
    return {
      posts: [],
      message: error.response?.data?.message || "Erro ao buscar posts",
    };
  }
}

export async function getCompanyEvents({
  companyId,
  token,
  page = 1,
  pageSize = 10,
}: {
  companyId: number;
  token: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    const response = await axios.get(
      `${API_URL}/company-events/${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          pageSize,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      events: [],
      message: error.response?.data?.message || "Erro ao buscar eventos",
    };
  }
}
