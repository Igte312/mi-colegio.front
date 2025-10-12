// src/services/api.ts
import axios from "axios";

// URL del backend, idealmente configurable via .env
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// función de ejemplo
export const getHello = async () => {
  const response = await api.get("/example/hello");
  return response.data; // { message: "Hola desde API" }
};