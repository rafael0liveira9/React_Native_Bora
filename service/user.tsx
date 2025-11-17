import { EditUserBody, RegisterUser } from "@/model/user";
import axios from "axios";
import Constants from "expo-constants";

// Use o IP do computador automaticamente ou configure manualmente
const getApiUrl = () => {
  // Para desenvolvimento, use o IP do Expo
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];

  // Se estiver rodando no Android Emulator, use 10.0.2.2
  // Se estiver em dispositivo físico, use o IP do computador
  if (debuggerHost) {
    return `http://${debuggerHost}:3001`;
  }

  // Fallback: configure seu IP manualmente aqui se necessário
  return "http://192.168.1.10:3001"; // ALTERE PARA SEU IP
};

const API_URL = getApiUrl();

export async function getMyData({ token }: { token: string }) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(`${API_URL}/get-my-user`, {
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

export async function getUserById({ userId, token }: { userId: number; token: string }) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(`${API_URL}/user/${userId}`, {
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

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.post(`${API_URL}/sign-in`, {
      email,
      password,
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

export async function register({ email, password, name }: RegisterUser) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.post(`${API_URL}/user/1`, {
      name: name,
      email: email,
      password: password,
    });

    return response.data;
  } catch (error: any) {
    console.error("Erro no registro:", error);

    return {
      status: error?.status,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Ocorreu um erro desconhecido.",
    };
  }
}

export async function update(data: EditUserBody, token: string) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.put(`${API_URL}/user`, data, {
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

export async function updatePhoto(file: any, path: string, token: string) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);

    const response = await axios.put(`${API_URL}/photo-user`, formData, {
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

export async function updateBackground(file: any, path: string, token: string) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);

    const response = await axios.put(`${API_URL}/background-user`, formData, {
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

export async function forgotPassword(email: string) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.post(`${API_URL}/forgot-password`, {
      email,
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

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.post(`${API_URL}/reset-password`, {
      email,
      code,
      newPassword,
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
