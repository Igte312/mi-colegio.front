// ⚠️ ARCHIVO: src/pages/StudentGuardianListPage.tsx (ENFOCADO EN ENVÍO DE ÚTILES)

import React, { useEffect, useState } from 'react';
// 🔹 IMPORTACIÓN CLAVE: Agregamos sendSupplyListToGuardians
import { useParams, useLocation } from 'react-router-dom'; 
import { getStudentsAndGuardiansByCourse, sendSupplyListToGuardians } from '../services/api';

// 🔹 INTERFACES NECESARIAS (Course para el resumen, StudentGuardian para la lista)
interface Course {
    id: number;
    name: string;
    level: string;
    letter: string;
    schoolId: number;
    professor?: string;
}

interface StudentGuardian {
    student_id: number;
    studentName: string;
    studentEmail: string;
    guardian_id: number;
    guardianName: string;
    guardianEmail: string;
}

const StudentGuardianListPage: React.FC = () => {
    const location = useLocation(); 

    // Obtener el objeto Course pasado por el state
    const currentCourse = location.state as Course | undefined;

    // 1. Obtener el courseId de la URL (siempre debe coincidir con el state.id)
    const { courseId: courseIdParam } = useParams<{ courseId: string }>();
    const courseId = courseIdParam ? parseInt(courseIdParam, 10) : null;

    // 2. Estados
    const [listData, setListData] = useState<StudentGuardian[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false); // 🔹 Estado para el botón de envío

    // 3. useEffect para la llamada a la API (Carga de la lista)
    useEffect(() => {
        if (!courseId) {
            setError("ID de curso no proporcionado en la URL.");
            setLoading(false);
            return;
        }

        const fetchStudentsAndGuardians = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getStudentsAndGuardiansByCourse(courseId);
                setListData(data as StudentGuardian[]);
            } catch (err: any) {
                setError(err.message);
                setListData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentsAndGuardians();
    }, [courseId]);


    // 🚀 HANDLER CLAVE: Lógica para enviar la lista de útiles
    const handleSendSupplyList = async () => {
        if (!courseId) return;

        const courseTitle = `${currentCourse?.name || ''} ${currentCourse?.letter || ''}`;

        if (!window.confirm(`¿Está seguro de que desea enviar la lista de útiles al curso ${courseTitle}? Esta acción es irreversible.`)) {
            return;
        }

        setIsSending(true);
        try {
            const result = await sendSupplyListToGuardians(courseId);
            alert(`✅ Éxito: ${result.message}`);
        } catch (error: any) {
            console.error("Error al enviar lista:", error);
            alert(`❌ Error al enviar lista: ${error.message}`); 
        } finally {
            setIsSending(false);
        }
    };

    // ----------------------------------------------------------------------
    // RENDERING CONDICIONAL Y VISUALIZACIÓN DEL RESUMEN
    // ----------------------------------------------------------------------

    if (!courseId || !currentCourse) {
        return <div className="p-8 text-center text-red-600">Error: No se pudo cargar la información completa del curso.</div>;
    }

    const courseTitle = `${currentCourse.name} ${currentCourse.letter}`;
    const professorName = currentCourse.professor || 'No Asignado';

    if (loading) return <p className="text-center mt-8 text-lg text-blue-600">Cargando lista para {courseTitle}...</p>;

    if (error) return (
        <div className="text-center mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded mx-auto max-w-2xl">
            <p className="font-bold">Error de Carga</p>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="py-10">
            <div className="bg-white mx-auto w-full p-8 max-w-6xl rounded-lg shadow-xl">

                {/* 🔹 SECCIÓN DE RESUMEN Y BOTONES DE ACCIÓN */}
                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                    Gestión de Curso: {courseTitle}
                </h2>
                <h3 className="text-xl text-center text-teal-600 mb-6">
                    Profesor Jefe: **{professorName}** (ID: {courseId})
                </h3>
                
                {/* 🔹 Panel de Acciones (Solo el botón de envío) */}
                <div className="flex justify-center gap-4 mb-10 p-4 border-y border-gray-200 bg-gray-50">
                    <button 
                        onClick={handleSendSupplyList} // 🚨 Llama al Handler de envío
                        disabled={isSending || loading} 
                        className={`font-bold py-2 px-6 rounded-lg transition-colors shadow-md ${
                            isSending 
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                    >
                        {isSending ? 'Enviando Lista...' : 'Enviar Lista de Útiles 📧'}
                    </button>
                </div>

                {/* Título de la lista */}
                <h4 className="text-2xl font-semibold text-gray-700 mb-4">
                    Alumnos y Apoderados ({listData.length} registros)
                </h4>

                {/* 🔹 CONTENEDOR DE LA LISTA REAL */}
                {listData.length === 0 ? (
                    <p className="text-center text-xl text-gray-600 mt-10 p-4 bg-yellow-50 rounded border border-yellow-200">
                        No se encontraron alumnos o apoderados para este curso.
                    </p>
                ) : (
                    <div className="overflow-x-auto shadow-xl rounded-lg border mt-4">
                        <table className="min-w-full bg-white">
                            <thead className="bg-teal-600 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left whitespace-nowrap">Alumno</th>
                                    <th className="py-3 px-4 text-left">Correo Alumno</th>
                                    <th className="py-3 px-4 text-left whitespace-nowrap">Apoderado</th>
                                    <th className="py-3 px-4 text-left">Correo Apoderado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listData.map((item) => (
                                    <tr key={item.student_id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-semibold text-gray-800">{item.studentName}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{item.studentEmail}</td>
                                        <td className="py-3 px-4">{item.guardianName}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{item.guardianEmail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentGuardianListPage;