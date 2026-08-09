import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://ai-knowledge-agent-backend.onrender.com",
  timeout: 30000,
});

export default api;