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

export async function getAllFriendRequests({ token }: { token: string }) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
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

export async function getAllPersonalRequests({ token }: { token: string }) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(`${API_URL}/personal-request`, {
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

export async function newFriendRequest({
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

    const body = {
      id: id,
    };

    const response = await axios.post(`${API_URL}/friends-request-post`, body, {
      headers: {
        Authorization: token,
      },
    });

    if (!!response.data) {
      return response.data;
    }
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

export async function newPersonalRequest({
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

    const body = {
      id: id,
    };

    const response = await axios.post(
      `${API_URL}/personal-request-post`,
      body,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (!!response.data) {
      return response.data;
    }
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

export async function acceptPersonalRequest({
  token,
  id,
  accept,
}: {
  token: string;
  id: number;
  accept: boolean;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const body = {
      id: id,
      accept: accept,
    };

    const response = await axios.put(`${API_URL}/personal-accept`, body, {
      headers: {
        Authorization: token,
      },
    });

    if (!!response.data) {
      return response.data;
    }
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

export async function acceptFriendRequest({
  token,
  id,
  accept,
}: {
  token: string;
  id: number;
  accept: boolean;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const body = {
      id: id,
      accept: accept,
    };

    const response = await axios.put(`${API_URL}/friends-accept`, body, {
      headers: {
        Authorization: token,
      },
    });

    if (!!response.data) {
      return response.data;
    }
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

export async function getAllMyFriends({ token }: { token: string }) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(`${API_URL}/friends`, {
      headers: {
        Authorization: token,
      },
    });

    if (!!response.data) {
      return response.data;
    }
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

export async function getMyPersonals({ token }: { token: string }) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(`${API_URL}/personals`, {
      headers: {
        Authorization: token,
      },
    });

    if (!!response.data) {
      return response.data;
    }
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

export async function getPersonalsEvaluations({
  token,
  personalId,
  evaluation,
}: {
  token: string;
  personalId: number;
  evaluation?: number;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(
      `${API_URL}/personal-evaluations?personalId=${personalId}${
        evaluation ? `&evaluation=${evaluation}` : ""
      }`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (!!response.data) {
      return response.data;
    }
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

export async function sendPersonalEvaluation({
  token,
  personalId,
  evaluation,
  observations,
}: {
  token: string;
  personalId: number;
  evaluation: number;
  observations?: string;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const body = {
      id: personalId,
      evaluation: evaluation,
      observations: observations ? observations : null,
    };

    const response = await axios.post(`${API_URL}/personal-evaluate`, body, {
      headers: {
        Authorization: token,
      },
    });

    if (!!response.data) {
      return response.data;
    }
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
