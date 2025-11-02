// src/services/api.ts
import axios from "axios";
import Cookies from "js-cookie";

// La URL base se toma de variables de entorno o usa un fallback local
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4444/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT de Azure en el encabezado Authorization
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("azure_token");
    if (token) {
      // El token debe enviarse como "Bearer [token]"
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =========================================================
// 1. FUNCIONES DE PRUEBA Y CURSOS
// =========================================================

// Llamada de prueba: example/hello
export const getExampleHello = async () => {
  const response = await api.get("/example/hello");
  return response.data;
};

// 1. Obtener Cursos por escuela
// 🔄 CORRECCIÓN CLAVE: Devolvemos response.data (el objeto que contiene el array de cursos en la propiedad 'data'),
// ya que el componente SchoolSupplyListPage.tsx está esperando un objeto con una propiedad 'data'.
export const getCoursesBySchool = async (): Promise<any> => {
  try {
    const response = await api.get("/courses/school");
    // Devolvemos el cuerpo de la respuesta del backend
    return response.data;
  } catch (error) {
    throw error;
  }
};

// =========================================================
// 2. FUNCIONES DE ÚTILES ESCOLARES
// =========================================================

// Obtener Útiles Escolares activos (lista de útiles disponibles)
export const getActiveSchoolSupplies = async () => {
  const response = await api.get("/school-supply/active");
  return response.data.data; // Extrae el array de útiles de la propiedad 'data'
};

// Carga de Útiles ASIGNADOS por curso (HU11)
export const getAssignedSchoolSuppliesByCourse = async (courseId: number) => {
  const response = await api.get(`/school-supply/course/${courseId}`);
  // Extrae el array de útiles asignados de la propiedad 'data'
  return response.data.data;
};

// 🔄 FUNCIÓN ACTUALIZADA: Guardar/Actualizar la lista de útiles de un curso (PUT)
export const saveCourseSuppliesAssignments = async (
  courseId: number,
  // Tipo de datos: ID del útil y la cantidad
  assignments: { schoolSupplyId: number; quantity: number }[]
) => {
  // Payload: cursoId y la lista de útiles (supplies)
  const payload = {
    courseId: courseId,
    supplies: assignments
  };

  // RUTA: course-supply-list/update (PUT)
  const response = await api.put("course-supply-list/update", payload);

  return response.data;
};

// =========================================================
// 3. FUNCIONES DE NOTIFICACIÓN Y ALUMNOS
// =========================================================

// 🚀 Enviar Lista de Útiles por correo a Apoderados
export const sendSupplyListToGuardians = async (courseId: number): Promise<{ message: string }> => {
  try {
    // RUTA: POST /guardian-notification/send-supply-list/{courseId}
    const response = await api.post(`/guardian-notification/send-supply-list/${courseId}`);

    return { message: response.data.message || "Lista de útiles enviada con éxito." };

  } catch (error: any) {
    let errorMessage = "Error desconocido al intentar enviar la lista de útiles.";

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 401) {
        errorMessage = "Token de Azure ausente o inválido (401 Unauthorized).";
      } else if (status === 403) {
        errorMessage = "Usuario no autorizado (Rol distinto a UTP: 403 Forbidden).";
      } else if (status === 500) {
        errorMessage = error.response.data?.message || "Error al enviar correos (500 Internal Server Error).";
      } else {
        errorMessage = `Error de servidor al enviar la lista. Código: ${status}`;
      }
    }

    throw new Error(errorMessage);
  }
};

// Obtener la lista de Alumnos y Apoderados de un curso
export const getStudentsAndGuardiansByCourse = async (courseId: number): Promise<any[]> => {
  try {
    const response = await api.get(`/student-guardian/course/${courseId}`);

    // Retorna el array de datos
    return response.data.data as any[];

  } catch (error: any) {
    let errorMessage = "Ocurrió un error inesperado al listar alumnos y apoderados.";

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 404) {
        errorMessage = error.response.data.message || `Curso con ID ${courseId} no encontrado.`;
      } else if (status === 403) {
        errorMessage = "Acceso denegado. Solo usuarios con rol UTP pueden ver esta lista.";
      } else if (status === 500) {
        errorMessage = "Error interno del servidor.";
      }

      throw new Error(errorMessage);
    }

    throw new Error("Error de red o conexión.");
  }
};