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

// Get all event types
export async function getAllEventTypes() {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(`${API_URL}/event-types`);

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

// Create new event
export async function createEvent({
  token,
  name,
  description,
  eventTypeId,
  startAt,
  endAt,
  photo,
  backgroundImage,
  isPublic,
  isPublicMetrics,
  promotionalText,
  promotionalVideo,
  promotionalImage,
  promotionalUrl,
}: {
  token: string;
  name: string;
  description: string;
  eventTypeId: number;
  startAt: string;
  endAt: string;
  photo?: string;
  backgroundImage?: string;
  isPublic?: boolean;
  isPublicMetrics?: boolean;
  promotionalText?: string;
  promotionalVideo?: string;
  promotionalImage?: string;
  promotionalUrl?: string;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.post(
      `${API_URL}/event`,
      {
        name,
        description,
        eventTypeId,
        startAt,
        endAt,
        photo,
        backgroundImage,
        isPublic,
        isPublicMetrics,
        promotionalText,
        promotionalVideo,
        promotionalImage,
        promotionalUrl,
      },
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

// Get all events
export async function getAllEvents({
  token,
  page = 1,
  pageSize = 10,
  search,
}: {
  token: string;
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    let url = `${API_URL}/events?page=${page}&pageSize=${pageSize}`;
    if (search) {
      url += `&search=${search}`;
    }

    const response = await axios.get(url, {
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

// Get my company events
export async function getMyCompanyEvents({
  token,
  page = 1,
  pageSize = 10,
}: {
  token: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(
      `${API_URL}/my-company-events?page=${page}&pageSize=${pageSize}`,
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

// Get event by ID
export async function getEventById({
  token,
  eventId,
}: {
  token: string;
  eventId: number;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(`${API_URL}/event/${eventId}`, {
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

// Update event
export async function updateEvent({
  token,
  id,
  name,
  description,
  eventTypeId,
  startAt,
  endAt,
  photo,
  backgroundImage,
  isPublic,
  isPublicMetrics,
  promotionalText,
  promotionalVideo,
  promotionalImage,
  promotionalUrl,
}: {
  token: string;
  id: number;
  name?: string;
  description?: string;
  eventTypeId?: number;
  startAt?: string;
  endAt?: string;
  photo?: string;
  backgroundImage?: string;
  isPublic?: boolean;
  isPublicMetrics?: boolean;
  promotionalText?: string;
  promotionalVideo?: string;
  promotionalImage?: string;
  promotionalUrl?: string;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.put(
      `${API_URL}/event`,
      {
        id,
        name,
        description,
        eventTypeId,
        startAt,
        endAt,
        photo,
        backgroundImage,
        isPublic,
        isPublicMetrics,
        promotionalText,
        promotionalVideo,
        promotionalImage,
        promotionalUrl,
      },
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

// Delete event
export async function deleteEvent({
  token,
  id,
}: {
  token: string;
  id: number;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.delete(`${API_URL}/event`, {
      headers: {
        Authorization: token,
      },
      data: {
        id,
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

// Get public active events
export async function getPublicEvents({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(
      `${API_URL}/public-events?page=${page}&pageSize=${pageSize}`
    );

    console.log("📡 Eventos públicos recebidos:", JSON.stringify(response.data.events?.[0], null, 2));

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
