// src/services/api.ts
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4444/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token solo si existe
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("azure_token");
    if (token) {
      config.headers.Authorization = token ? `Bearer ${token}` : '';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Llamada de prueba: example/hello
export const getExampleHello = async () => {
  const response = await api.get("/example/hello");
  return response.data;
};

// Llamada real a cursos (requiere token válido)
export const getCoursesBySchool = async () => {
  const response = await api.get("/courses/school");
  return response.data;
};
