// ⚠️ ARCHIVO: src/pages/StudentGuardianListPage.tsx (COMPLETO Y FINALIZADO - SIN ASIGNACIÓN DE PROFESOR)

import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
    getStudentsAndGuardiansByCourse, 
    sendSupplyListToGuardians,
    // ⬇️ FUNCIONES COMENTADAS PARA LA ASIGNACIÓN DE PROFESOR
    // getTeachersBySchool, 
    // assignTeacherToCourse 
} from '../services/api';

// 🔹 INTERFACES NECESARIAS
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

// 🔹 INTERFACE COMENTADA PARA EL PROFESOR
/*
interface Teacher {
    id: number;
    name: string; // Nombre completo mapeado desde firstName + lastName
    email: string;
}
*/


const StudentGuardianListPage: React.FC = () => {
    const location = useLocation();

    // 🚨 Estado para el curso, inicializado con el state de navegación y que puede actualizarse
    const initialCourse = location.state as Course | undefined;
    const [courseDetails, setCourseDetails] = useState<Course | undefined>(initialCourse);

    const { courseId: courseIdParam } = useParams<{ courseId: string }>();
    const courseId = courseIdParam ? parseInt(courseIdParam, 10) : null;

    // 2. Estados Adicionales
    const [listData, setListData] = useState<StudentGuardian[]>([]);
    // const [teachers, setTeachers] = useState<Teacher[]>([]); // 🔹 Lista de profesores COMENTADA
    // const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null); // 🔹 Profesor seleccionado COMENTADO
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    // const [isAssigning, setIsAssigning] = useState(false); // 🔹 Estado de asignación COMENTADO

    // 3. useEffect para la llamada a la API (Carga de la lista)
    useEffect(() => {
        if (!courseId) {
            setError("ID de curso no proporcionado en la URL.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Carga 1: Alumnos y Apoderados
                const studentsData = await getStudentsAndGuardiansByCourse(courseId);
                setListData(studentsData as StudentGuardian[]);
                
                // Carga 2: Lista de Profesores (ELIMINADA)
                // const teachersResult = await getTeachersBySchool();
                // setTeachers(teachersResult.data);

            } catch (err: any) {
                setError(err.message || "Error al cargar datos del curso.");
                setListData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);


    // 🚀 HANDLER: Lógica para enviar la lista de útiles
    const handleSendSupplyList = async () => {
        if (!courseId) return;

        const courseTitle = `${courseDetails?.name || ''} ${courseDetails?.letter || ''}`;

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

    // 🧑‍🏫 HANDLER CLAVE: Lógica para asignar profesor (COMENTADA)
    /*
    const handleAssignTeacher = async () => {
        if (!courseId || !selectedTeacherId) {
            alert("Debe seleccionar un profesor antes de asignar.");
            return;
        }

        const teacherName = teachers.find(t => t.id === selectedTeacherId)?.name || 'Profesor Seleccionado';
        const courseTitle = `${courseDetails?.name || ''} ${courseDetails?.letter || ''}`;

        if (!window.confirm(`¿Confirma que desea asignar a ${teacherName} como profesor jefe del curso ${courseTitle}?`)) {
            return;
        }

        setIsAssigning(true);
        try {
            const result = await assignTeacherToCourse(courseId, selectedTeacherId);
            alert(`✅ Éxito: ${result.message}`);

            // 1. Actualizar el estado local (para la vista inmediata)
            if (courseDetails) {
                setCourseDetails({
                    ...courseDetails,
                    professor: teacherName
                });
            }
            
            // 2. 🚨 SOLUCIÓN DE PERSISTENCIA: Establecer bandera para forzar recarga en el listado de cursos
            localStorage.setItem('should_refetch_courses', 'true'); 

        } catch (error: any) {
            console.error("Error al asignar profesor:", error);
            alert(`❌ Error al asignar profesor: ${error.message}`);
        } finally {
            setIsAssigning(false);
        }
    };
    */


    // ----------------------------------------------------------------------
    // RENDERING
    // ----------------------------------------------------------------------

    if (!courseId || !courseDetails) {
        return <div className="p-8 text-center text-red-600">Error: No se pudo cargar la información completa del curso.</div>;
    }

    const courseTitle = `${courseDetails.name} ${courseDetails.letter}`;
    // const professorName = courseDetails.professor || 'No Asignado'; // COMENTADO

    if (loading) return <p className="text-center mt-8 text-lg text-blue-600">Cargando datos de curso y profesores...</p>;

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
               

                {/* 🔹 Panel de Acciones (Envío de útiles) */}
                <div className="flex flex-col justify-center gap-6 mb-10 p-6 border-y border-gray-200 bg-gray-50 rounded-lg">
                    
                    {/* ACCIÓN 2: Enviar Lista de Útiles (CENTRALIZADO) */}
                    <div className="flex justify-center items-center w-full"> {/* 💡 ELIMINADAS LAS CLASES lg:w-1/2 Y lg:justify-end */}
                        <button
                            onClick={handleSendSupplyList}
                            disabled={isSending || loading}
                            className={`font-bold py-3 px-8 rounded-lg transition-colors shadow-lg text-lg ${isSending
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                        >
                            {isSending ? 'Enviando Lista...' : 'Enviar Lista de Útiles 📧'}
                        </button>
                    </div>
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