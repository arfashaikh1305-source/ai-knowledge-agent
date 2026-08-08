import api from "./api";
import { getToken } from "./auth";

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    "/documents/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get(
    "/documents/",
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await api.delete(
    `/documents/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

export const getDocumentStats = async () => {
  const response = await api.get(
    "/documents/stats",
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

export const downloadDocument = async (id) => {
  const response = await api.get(
    `/documents/download/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      responseType: "blob",
    }
  );

  return response.data;
};

export const generateSummary = async (id) => {
  const response = await api.get(
    `/chat/summary/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};