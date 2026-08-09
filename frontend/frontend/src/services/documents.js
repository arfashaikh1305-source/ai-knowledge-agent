import api from "./api";
import { getToken } from "./auth";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    "/documents/upload",
    formData,
    {
      headers: {
        ...getAuthHeaders(),
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
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const deleteDocument = async (documentId) => {
  const response = await api.delete(
    `/documents/${documentId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};