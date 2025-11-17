import axios from "axios";
import { sendToS3 } from "./s3";
import Constants from "expo-constants";

const getApiUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (debuggerHost) {
    return `http://${debuggerHost}:3001`;
  }
  return "http://192.168.1.10:3001";
};

const API_URL = getApiUrl();

export async function getAllPosts({
  token,
  page = 1,
  pageSize = 50
}: {
  token: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(`${API_URL}/posts?page=${page}&pageSize=${pageSize}`, {
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

export async function getMyPosts({ token }: { token: string }) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(`${API_URL}/my-posts`, {
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

export async function getUserPosts({ clientId, token }: { clientId: number; token: string }) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(`${API_URL}/user-posts/${clientId}`, {
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

export async function newPost({
  token,
  title,
  description,
  image,
  postStatus,
}: {
  token: string;
  title?: string | null;
  description?: string | null;
  image?: any | null;
  postStatus?: string | null;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }
    let imageUrl;
    if (!!image) {
      imageUrl = await sendToS3(image, "post", token);
    }

    const body = {
      title: title ? title : null,
      description: description ? description : null,
      image: imageUrl ? imageUrl : null,
      type: postStatus ? +postStatus : 1,
    };

    // console.log(image ? image : "null");

    const response = await axios.post(`${API_URL}/post`, body, {
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

export async function updatePost({
  token,
  title,
  id,
  description,
  image,
  postStatus,
}: {
  token: string;
  id: number;
  title?: string | null;
  description?: string | null;
  image?: any;
  postStatus?: string | null;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    let imageUrl;
    if (!!image) {
      imageUrl = await sendToS3(image, "post", token);
    }

    const body = {
      id: id,
      title: title ? title : null,
      description: description ? description : null,
      image: imageUrl ? imageUrl : null,
      type: postStatus ? +postStatus : 1,
    };

    const response = await axios.put(`${API_URL}/post`, body, {
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

export async function deletePost({
  token,
  id,
}: {
  token: string;
  id: number;
  title?: string;
  description?: string;
  image?: any;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const body = {
      id: id,
    };

    const response = await axios.put(`${API_URL}/delete-post`, body, {
      headers: {
        Authorization: token,
      },
    });

    return response;
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

// Company Posts Functions
export async function getCompanyPosts({ token }: { token: string }) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    const response = await axios.get(`${API_URL}/company-posts`, {
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

export async function newCompanyPost({
  token,
  title,
  description,
  image,
  postStatus,
}: {
  token: string;
  title?: string | null;
  description?: string | null;
  image?: any | null;
  postStatus?: string | null;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }
    let imageUrl;
    if (!!image) {
      imageUrl = await sendToS3(image, "post", token);
    }

    const body = {
      title: title ? title : null,
      description: description ? description : null,
      image: imageUrl ? imageUrl : null,
      type: postStatus ? +postStatus : 1,
    };

    const response = await axios.post(`${API_URL}/company-post`, body, {
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

export async function updateCompanyPost({
  token,
  title,
  id,
  description,
  image,
  postStatus,
}: {
  token: string;
  id: number;
  title?: string | null;
  description?: string | null;
  image?: any;
  postStatus?: string | null;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL não encontrada no extra do app.json.");
    }

    let imageUrl;
    if (!!image) {
      imageUrl = await sendToS3(image, "post", token);
    }

    const body = {
      id: id,
      title: title ? title : null,
      description: description ? description : null,
      image: imageUrl ? imageUrl : null,
      type: postStatus ? +postStatus : 1,
    };

    const response = await axios.put(`${API_URL}/company-post`, body, {
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

export async function deleteCompanyPost({
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

    const response = await axios.delete(`${API_URL}/company-post`, {
      headers: {
        Authorization: token,
      },
      data: body,
    });

    return response;
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
