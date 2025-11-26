// src/services/api.ts
import axios from "axios";
import Cookies from "js-cookie";

// La URL base se toma de variables de entorno o usa un fallback local
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4444/api/v1";

// 🔹 INTERFAZ NECESARIA para el mapeo de profesores
interface Teacher {
    id: number;
    name: string; 
    email: string;
}

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

// =========================================================
// 4. FUNCIONES DE CURSOS Y PROFESORES
// =========================================================

/**
 * 🧑‍🏫 Asigna un profesor a un curso específico.
 */
export const assignTeacherToCourse = async (
    courseId: number,
    teacherId: number
): Promise<{ message: string; code: number }> => {
    try {
        // Cuerpo de la solicitud
        const payload = { teacherId };

        // RUTA: PUT /courses/{courseId}/assign-teacher
        const response = await api.put(`/courses/${courseId}/assign-teacher`, payload);

        // Retorna el mensaje y código de la respuesta exitosa (200 OK)
        return {
            message: response.data.message || "Profesor asignado exitosamente.",
            code: response.data.code || 200,
        };
    } catch (error: any) {
        let errorMessage = "Error desconocido al intentar asignar el profesor.";

        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 400) {
                errorMessage = data.message || "Error de solicitud: Curso no pertenece al colegio o profesor ya asignado.";
            } else if (status === 401) {
                errorMessage = "No autorizado: Token de Azure ausente o inválido.";
            } else if (status === 403) {
                errorMessage = "Prohibido: Usuario sin rol UTP para realizar esta acción.";
            } else if (status === 404) {
                errorMessage = data.message || "Curso o profesor no encontrado.";
            } else if (status === 500) {
                errorMessage = data.message || "Error interno del servidor al asignar profesor.";
            } else {
                errorMessage = `Error de red o servidor no manejado. Código: ${status}`;
            }
        }

        // Lanza un error con el mensaje específico para que pueda ser capturado en el componente.
        throw new Error(errorMessage);
    }
};


/**
 * 📋 Obtiene la lista de profesores asociados al colegio del usuario autenticado.
 * @returns {object} Una lista de objetos Teacher (id, name, email).
 */
export const getTeachersBySchool = async (): Promise<{ data: Teacher[] }> => {
    try {
        // ✅ RUTA CORREGIDA: Usamos /teacher
        const response = await api.get("/teacher");

        // 🛠️ Mapeamos los datos para generar el nombre completo (firstName + lastName)
        const mappedTeachers = response.data.data.map((teacher: any) => ({
            id: teacher.id,
            name: `${teacher.firstName} ${teacher.lastName}`, // Generamos el nombre completo
            email: teacher.email,
        }));

        // Devolvemos la estructura esperada: { data: [{ id, name, email }, ...] }
        return { data: mappedTeachers };

    } catch (error) {
        throw error;
    }
};


/**
 * 🆕 CREAR NUEVO ÚTIL ESCOLAR (POST /school-supply)
 * Requiere rol UTP y token Azure.
 */
export const createSchoolSupply = async (supplyData: NewSupplyData) => {
    try {
        // RUTA: POST /school-supply
        const response = await api.post("/school-supply", supplyData);
        
        // Retorna los datos del útil creado de la propiedad 'data'
        return response.data.data; 

    } catch (error: any) {
        let errorMessage = "Error desconocido al intentar crear el útil.";

        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 400) {
                // Validación fallida: "Name is required"
                errorMessage = data.message || "Error de validación (400). Nombre o descripción requeridos.";
            } else if (status === 403) {
                // Token inválido o rol no permitido
                errorMessage = data.message || "Acceso denegado (403). Rol UTP requerido.";
            } else if (status === 500) {
                errorMessage = data.message || "Error interno del servidor al crear el útil (500).";
            } else {
                errorMessage = `Error de servidor al crear el útil. Código: ${status}`;
            }
            
            // Logueamos el error de la API
            console.error("Error de API al crear útil:", error.response.data);
            
            // Lanzamos el error con el mensaje específico
            throw new Error(errorMessage); 
        }

        // Si el error no es de Axios (ej. de red), lo lanzamos.
        throw new Error("Error de red o conexión al crear útil.");
    }
};


/**
 * 🗑️ ELIMINAR ÚTIL ESCOLAR (DELETE /school-supply/{id})
 * Requiere rol UTP y token Azure. Retorna 204 No Content en éxito.
 * @param schoolSupplyId Identificador único del útil escolar a eliminar.
 */
export const deleteSchoolSupply = async (schoolSupplyId: number): Promise<void> => {
    try {
        // RUTA: DELETE /school-supply/{id}
        // El éxito es un 204 No Content, por lo que no retorna datos.
        await api.delete(`/school-supply/${schoolSupplyId}`);
        
    } catch (error: any) {
        let errorMessage = "Error desconocido al intentar eliminar el útil.";

        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 404) {
                // Not Found: No existe un útil con el id indicado.
                errorMessage = data.message || `Útil escolar con ID ${schoolSupplyId} no encontrado (404).`;
            } else if (status === 400) {
                // Bad Request: El parámetro id no es válido.
                errorMessage = data.message || "Solicitud inválida (400). El ID no es válido.";
            } else if (status === 403) {
                // Forbidden: Token inválido o rol no permitido (UTP requerido).
                errorMessage = data.message || "Acceso denegado (403). Rol UTP requerido.";
            } else if (status === 500) {
                // Internal Server Error: El error que estabas viendo.
                errorMessage = data.message || "Error interno del servidor al eliminar útil (500).";
            } else {
                errorMessage = `Error de servidor al eliminar el útil. Código: ${status}`;
            }
            
            console.error(`Error de API al eliminar útil (ID: ${schoolSupplyId}):`, error.response.data);
            
            // Lanzar un error para que el componente lo pueda capturar y mostrar.
            throw new Error(errorMessage); 
        }

        // Si el error no es de Axios (ej. de red), lo lanzamos.
        throw new Error("Error de red o conexión al eliminar útil.");
    }
};