import axios from "axios";
import Constants from "expo-constants";

const getApiUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];
  if (debuggerHost) {
    return `http://${debuggerHost}:3001`;
  }
  return "http://192.168.1.10:3001";
};

const API_URL = getApiUrl();

export async function upsertParticipation({
  eventId,
  status,
  token,
}: {
  eventId: number;
  status: number;
  token: string;
}) {
  try {
    const response = await axios.post(
      `${API_URL}/participation`,
      {
        eventId,
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      participation: null,
      message: error.response?.data?.message || "Erro ao atualizar participação",
    };
  }
}

export async function getUserParticipation({
  eventId,
  token,
}: {
  eventId: number;
  token: string;
}) {
  try {
    const response = await axios.get(`${API_URL}/participation/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return {
      participation: null,
      message: error.response?.data?.message || "Erro ao buscar participação",
    };
  }
}

export async function getEventParticipations({
  eventId,
  token,
}: {
  eventId: number;
  token: string;
}) {
  try {
    const response = await axios.get(
      `${API_URL}/event-participations/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      participations: [],
      stats: null,
      message:
        error.response?.data?.message || "Erro ao buscar participações",
    };
  }
}
