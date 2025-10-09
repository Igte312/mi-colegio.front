// src/pages/CourseSelectionPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getCoursesBySchool, type Course } from '../services/api'; 
import { useAccessToken } from '../hooks/useAccessToken'; // 🔑 Importar el hook de token

const MOCK_SCHOOL_ID = 1; 

const CourseSelectionPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const navigate = useNavigate();
    // 🔑 Usar el hook para obtener la función de adquisición de token
    const { getAccessToken } = useAccessToken(); 

    const handleSelectCourse = (course: Course) => {
        navigate(`/curso-detalles/${course.id}`); 
    };

    // Efecto para cargar la lista de cursos
    useEffect(() => {
        const fetchCourses = async () => {
            if (MOCK_SCHOOL_ID <= 0) {
                setError("ID de colegio no válido.");
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                // 1. Obtener el token de acceso
                const token = await getAccessToken(); 
                
                // 2. Llamada a la API, pasando el token
                const data = await getCoursesBySchool(MOCK_SCHOOL_ID, token);
                setCourses(data);
                setError(null);
            } catch (err: any) {
                console.error("Fallo al cargar cursos:", err);
                setError(err.message || "Ocurrió un error al cargar los cursos.");
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [getAccessToken]); // Dependencia: getAccessToken (aunque es estable, es una buena práctica)

    // ... (El resto del renderizado es el mismo)
};

export default CourseSelectionPage;