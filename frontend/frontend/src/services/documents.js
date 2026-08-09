import api from "./api";
import { getToken } from "./auth";

const getAuthHeaders = () => {
  const token = getToken();

  if (!token) {
    throw new Error("You are not logged in. Please login again.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// Get all documents
export const getDocuments = async () => {
  const response = await api.get("/documents/", {
    headers: getAuthHeaders(),
  });

  return response.data;
};

// Upload document
export const uploadDocument = async (file) => {
  if (!file) {
    throw new Error("Please select a file.");
  }

  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/documents/upload",
    formData,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// Delete document
export const deleteDocument = async (documentId) => {
  const response = await api.delete(
    `/documents/${documentId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// Download document
export const downloadDocument = async (documentId) => {
  const response = await api.get(
    `/documents/${documentId}/download`,
    {
      headers: getAuthHeaders(),
      responseType: "blob",
    }
  );

  return response.data;
};