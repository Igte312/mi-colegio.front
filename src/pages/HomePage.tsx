import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 🔹 Importar
import illustrationImage from "../assets/image.png";
import { getExampleHello, getCoursesBySchool } from "../services/api";

const HomePage: React.FC = () => {
  const navigate = useNavigate(); // 🔹 Inicializar navigate
  const [exampleMessage, setExampleMessage] = useState<string>("");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  exampleMessage;
  courses;
  loading;
  error;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const example = await getExampleHello();
        setExampleMessage(example.data.message);

        const courseData = await getCoursesBySchool();
        setCourses(courseData);
      } catch (err: any) {
        setError("No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between py-16">
      <div className="md:w-1/2 p-4 md:p-8">
        <h1 className="text-5xl font-bold mb-4 text-teal-600">
          <span className="block text-gray-900">App</span> MiColegio
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Esta es la aplicación para la gestión de útiles escolares de tu colegio.
        </p>

        <div className="flex space-x-4">
          {/* 🔹 Botón con navegación */}
          <button
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            onClick={() => navigate("/seleccionar-curso")}
          >
            Seleccionar Curso
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Crear Listado
          </button>
        </div>
      </div>

      <div className="md:w-1/2 p-4 md:p-8 flex justify-center">
        <img src={illustrationImage} alt="Ilustración" className="w-full max-w-md" />
      </div>
    </div>
  );
};

export default HomePage;
