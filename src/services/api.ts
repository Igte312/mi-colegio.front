// src/services/api.ts

import axios from "axios";

// URL del backend, idealmente configurable via .env
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

// 🎯 Instancia de Axios sin encabezado de Authorization por defecto (se añadirá dinámicamente)
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================================================
// INTERFACES (Definiciones de tipos de TypeScript)
// =========================================================
// ... (Tus interfaces Course, Student, CourseDetails, ApiResponse permanecen iguales)

export interface Course {
  id: number;
  name: string;
  level: string;
  letter: string;
  schoolId: number;
}

export interface Student {
    id: number;
    name: string;
    guardian: string; 
    email: string;
}

export interface CourseDetails {
    course: Course;
    professor: string;
    students: Student[];
}

interface ApiResponse<T> {
  code: number;
  message: string;
  traceId: string;
  data: T;
}


// =========================================================
// FUNCIÓN AUXILIAR DE PETICIÓN (Maneja el token y errores)
// =========================================================

/**
 * Función genérica para hacer llamadas GET con token.
 */
const apiGetWithToken = async <T>(endpoint: string, accessToken: string): Promise<T> => {
    try {
        const response = await api.get<ApiResponse<T>>(endpoint, {
            // 🔑 CLAVE: Incluir el token en el encabezado Authorization
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // Devolvemos el array de datos T (Course[] o CourseDetails)
        return response.data.data; 
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error en el endpoint ${endpoint}:`, error.response?.data || error.message);
            // Propagamos un error que es más fácil de manejar en el componente
            throw new Error(`Fallo en la solicitud: ${error.response?.data.message || error.message}`);
        }
        console.error("Error inesperado:", error);
        throw error;
    }
};


// =========================================================
// FUNCIONES DE SERVICIO (Endpoints)
// =========================================================

/**
 * 🎯 Endpoint 1: Lista los cursos de un colegio.
 * @param schoolId Identificador único del colegio.
 * @param accessToken Token de autenticación de MSAL.
 * @returns Una promesa que resuelve a un array de objetos Course.
 */
export const getCoursesBySchool = async (schoolId: number, accessToken: string): Promise<Course[]> => {
  if (!schoolId || !accessToken) {
    throw new Error("schoolId y accessToken son requeridos para listar los cursos.");
  }
  
  const endpoint = `/courses/school/${schoolId}`;
  
  // Usamos la función auxiliar con el token
  return apiGetWithToken<Course[]>(endpoint, accessToken);
};


/**
 * 🎯 Endpoint 2: Obtiene los detalles completos (profesor, alumnos).
 * @param courseId Identificador único del curso.
 * @param accessToken Token de autenticación de MSAL.
 * @returns Una promesa que resuelve a un objeto CourseDetails.
 */
export const getCourseDetails = async (courseId: number, accessToken: string): Promise<CourseDetails> => {
    if (!courseId || !accessToken) {
        throw new Error("courseId y accessToken son requeridos para obtener los detalles del curso.");
    }

    const endpoint = `/course-details/${courseId}`; 
    
    // Usamos la función auxiliar con el token
    return apiGetWithToken<CourseDetails>(endpoint, accessToken);
};


// función de ejemplo (original, mantenida)
export const getHello = async () => {
  const response = await api.get("/example/hello");
  return response.data;
};