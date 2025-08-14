import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  // Auth endpoints pe token attach mat karo
  if (token && !config.url?.includes("auth/register") && !config.url?.includes("auth/login")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
