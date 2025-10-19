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


export const getActiveSchoolSupplies = async () => {
// Utiliza el endpoint definido: GET /school-supply/active
 const response = await api.get("/school-supply/active");
 return response.data.data; // <-- Extrae el array de 'data'
};

// 
// HU11: Carga de Útiles ASIGNADOS por curso
export const getAssignedSchoolSuppliesByCourse = async (courseId: number) => {
 const response = await api.get(`/school-supply/course/${courseId}`);
 // CORRECCIÓN: Devolvemos response.data.data para obtener el array de útiles.
 // Esto se alinea con el patrón de getActiveSchoolSupplies y resuelve el crash.
 return response.data.data; 
};









// 🔄 FUNCIÓN ACTUALIZADA (PUT /course-supply-list/update) 🔄
export const saveCourseSuppliesAssignments = async (
    courseId: number, 
    // Tipo de datos que espera el backend: ID del útil y la cantidad
    assignments: { schoolSupplyId: number; quantity: number }[]
) => {
    // 1. Definir el Payload (Cuerpo de la Solicitud)
    const payload = {
        courseId: courseId,
        supplies: assignments // La lista de asignaciones se llama 'supplies' en el payload
    };

    // 2. Usar PUT con la URL CORRECTA: 
    //    1. Se elimina la 'S' mayúscula que causaba el error de ruta.
    //    2. Se elimina la barra inicial '/' para evitar conflictos con baseURL.
    const response = await api.put("course-supply-list/update", payload); 
    //                         ^ SIN BARRA INICIAL (PRÁCTICA DEFENSA AXIOS)
    //                         ^ RUTA CORREGIDA

    return response.data;
};


