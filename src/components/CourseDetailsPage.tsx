// src/pages/CourseDetailsPage.tsx
import React from 'react';

const CourseDetailsPage: React.FC = () => {
    // Simulación de datos precargados desde la base de datos con una estructura detallada
    const studentsData = [
        { id: 1, name: 'Alumno 1', guardian: 'Apoderado 1', email: 'Correo electrónico' },
        { id: 2, name: 'Alumno 2', guardian: 'Apoderado 2', email: 'Correo electrónico' },
        { id: 3, name: 'Alumno 3', guardian: 'Apoderado 3', email: 'Correo electrónico' },
        { id: 4, name: 'Alumno 4', guardian: 'Apoderado 4', email: 'Correo electrónico' },
        { id: 5, name: 'Alumno 5', guardian: 'Apoderado 5', email: 'Correo electrónico' },
        { id: 6, name: 'Alumno 6', guardian: 'Apoderado 6', email: 'Correo electrónico' },
        { id: 7, name: 'Alumno 7', guardian: 'Apoderado 7', email: 'Correo electrónico' },
        { id: 8, name: 'Alumno 8', guardian: 'Apoderado 8', email: 'Correo electrónico' },
    ];

    const professor = 'sin profesor';

    return (
        <div className=" min-h-screen py-10">
            <div className="bg-white p-8 mx-auto w-full rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Curso seleccionado Tercero Básico
                </h2>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Columna Izquierda (con los títulos) */}
                    <div className="flex flex-col gap-4 flex-grow">
                        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm">
                            <p className="text-xl font-semibold text-gray-700">Lista alumnos y apoderados</p>
                        </div>
                        <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm">
                            <p className="text-xl font-semibold text-gray-700">Profesor Jefe: {professor}</p>
                        </div>
                    </div>

                    {/* Columna Derecha: Asignar y Enviar */}
                    <div className="flex flex-col gap-4 flex-grow">
                        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm">
                            <p className="text-xl font-semibold text-gray-700">Asignar profesor</p>
                            <div className="flex space-x-2">
                                <button className="bg-teal-500 hover:bg-teal-600  text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                    Ver
                                </button>
                                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                    Enviar útiles
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenedor de la lista con scroll y el nuevo formato, ahora con w-full */}
                <div className="bg-white p-4 mt-8 rounded-lg shadow-sm border border-gray-300">
                    <div className="h-64 overflow-y-auto pr-4">
                        <ul className="text-gray-600 space-y-2">
                            {studentsData.map((student) => (
                                <li key={student.id} className="flex justify-between items-center">
                                    <span>{student.name}</span>
                                    <span className="text-sm text-gray-500">{`${student.guardian} ${student.email}`}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Botones Inferiores */}
                <div className="mt-8 flex justify-end space-x-4">
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        Eliminar lista
                    </button>
                    <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        Editar lista
                    </button>
                    <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        Cargar lista
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsPage;