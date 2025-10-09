// src/pages/CourseDetailsPage.tsx
import React, { useState, useEffect } from 'react';
// 🎯 NECESARIO: Importar useParams para leer el ID de la URL
import { useParams } from 'react-router-dom'; 
import { 
    getCourseDetails, 
    type CourseDetails, // El tipo CourseDetails tiene: course, professor, students
} from '../services/api'; 

const CourseDetailsPage: React.FC = () => {
    
    // 🔑 CLAVE: Obtener el ID del curso de la URL
    const { courseId } = useParams<{ courseId: string }>(); 
    const id = courseId ? parseInt(courseId) : null;
    
    // Estados para la carga de datos detallados
    const [details, setDetails] = useState<CourseDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Efecto para cargar los detalles del curso (Endpoint 2) ---
    useEffect(() => {
        if (!id) {
            setError("ID de curso no especificado.");
            setLoading(false);
            return;
        }

        const fetchDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // LLAMADA A LA API REAL
                const data = await getCourseDetails(id); 
                
                setDetails(data);
            } catch (err: any) {
                console.error("Fallo al cargar detalles del curso:", err);
                setError(err.message || "No se pudieron cargar los detalles del curso.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]); // Depende del ID, se recarga si el ID cambia

    // --- Renderizado Condicional (Carga, Error, No encontrado) ---
    if (loading) return (<div className="py-20 flex justify-center items-center"><p className="text-xl font-medium text-teal-600">Cargando detalles del curso...</p></div>);
    if (error) return (<div className="py-20 text-center"><h2 className="text-2xl font-bold text-red-600 mb-4">Error al cargar datos</h2><p className="text-gray-600">{error}</p></div>);
    if (!details) return (<div className="py-20 text-center text-gray-500">Curso no encontrado.</div>);
    
    // Desestructurar datos reales de la API
    const { course, professor, students } = details;
    const courseFullName = `${course.name} ${course.letter ? course.letter : ''}`;

    // --- Renderizado Principal (Pintar los datos) ---
    return (
        <div className="min-h-screen py-10">
            <div className="bg-white p-8 mx-auto max-w-4xl rounded-lg shadow-xl">
                
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Curso seleccionado: {courseFullName}
                </h2>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Columna Izquierda */}
                    <div className="flex flex-col gap-4 flex-grow">
                        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm">
                            <p className="text-xl font-semibold text-gray-700">Lista alumnos y apoderados</p>
                        </div>
                        
                        <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm">
                            <p className="text-xl font-semibold text-gray-700">
                                Profesor Jefe: <span className='font-normal text-gray-600'>{professor}</span>
                            </p>
                        </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="flex flex-col gap-4 flex-grow">
                        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm">
                            <p className="text-xl font-semibold text-gray-700">Asignar y enviar</p>
                            <div className="flex space-x-2">
                                {/* Botones de acción */}
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm">
                            <p className="text-xl font-semibold text-gray-700">
                                Nivel: <span className='font-normal text-gray-600'>{course.level}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contenedor de la lista de Alumnos */}
                <div className="bg-white p-4 mt-8 rounded-lg shadow-sm border border-gray-300">
                    <div className="h-64 overflow-y-auto pr-4">
                        <ul className="text-gray-800 space-y-3">
                            {students.map((student) => (
                                <li 
                                    key={student.id} 
                                    className="flex justify-between items-center border-b pb-2 last:border-b-0 text-lg"
                                >
                                    <span className='font-medium'>{student.name}</span>
                                    
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-600">{student.guardian}</p>
                                        <p className="text-xs text-gray-400">{student.email}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Botones Inferiores */}
                <div className="mt-8 flex justify-end space-x-4">
                    {/* Botones de acción */}
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsPage;