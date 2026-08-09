import api from "./api";
import { getToken } from "./auth";

export const getDocuments = async () => {
  const token = getToken();

  const response = await api.get("/documents/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const uploadDocument = async (file) => {
  const token = getToken();

  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/documents/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteDocument = async (documentId) => {
  const token = getToken();

  const response = await api.delete(`/documents/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const downloadDocument = async (documentId) => {
  const token = getToken();

  const response = await api.get(`/documents/${documentId}/download`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  });

  return response.data;
};