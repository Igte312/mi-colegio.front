// src/pages/CourseSelectionPage.tsx
import React, { useEffect, useState } from "react";
import { getCoursesBySchool } from "../services/api";

interface Course {
  id: number;
  name: string;
  level: string;
  letter: string;
  schoolId: number;
}

const CourseSelectionPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getCoursesBySchool();
        setCourses(response.data); // asumimos que la API devuelve { code, message, data }
      } catch (err: any) {
        setError("No se pudieron cargar los cursos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p className="text-center mt-8">Cargando cursos...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="p-8">
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
            <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out">
              seleccionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSelectionPage;
