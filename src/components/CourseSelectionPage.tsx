// ⚠️ ARCHIVO: src/pages/CourseSelectionPage.tsx (CORREGIDO)

import React, { useEffect, useState } from "react";
import { getCoursesBySchool } from "../services/api";
import { useNavigate } from "react-router-dom"; 

interface Course {
  id: number;
  name: string;
  level: string;
  letter: string;
  schoolId: number;
  professor?: string; 
}

const CourseSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const courseResponse = await getCoursesBySchool(); // Obtiene el objeto { data: [...], ... }
        
        // ✅ CORRECCIÓN CLAVE: Acceder a la propiedad .data
        // Esto asume que el backend envuelve la lista de cursos en una propiedad llamada 'data'.
        const courseList = courseResponse.data || []; 
        
        setCourses(courseList as Course[]);
      } catch (err: any) {
        setError("No se pudieron cargar los cursos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 🔹 Handler para la navegación DIRECTA a la lista de alumnos/apoderados
  const handleSelectCourse = (course: Course) => {
    // Usamos la navegación por 'state' para pasar el objeto completo
    navigate(`/alumnos-apoderados/${course.id}`, { state: course });
  };


  if (loading) return <p className="text-center mt-8">Cargando cursos...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  
  if (courses.length === 0) return (
      <div className="text-center mt-8 p-6 bg-yellow-100 rounded mx-auto max-w-lg border border-yellow-300">
        <p className="font-bold">⚠️ Atención</p>
        <p>No se encontraron cursos activos para su escuela.</p>
      </div>
  );


  return (
    <div className="min-h-screen py-10">
      <div className="bg-white mx-auto w-full p-8 mx-auto max-w-4xl rounded-lg shadow-xl">

        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Seleccione curso a cargar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
            >
              <span className="text-xl font-semibold text-gray-700">
                {course.name} ({course.letter})
              </span>
              <button
                onClick={() => handleSelectCourse(course)} 
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
              >
                seleccionar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default CourseSelectionPage;