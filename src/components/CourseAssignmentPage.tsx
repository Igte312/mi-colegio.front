// src/pages/CourseAssignmentPage.tsx
import React from 'react';
import ArrowTransferIcon from './ArrowTransferIcon';

const CourseAssignmentPage: React.FC = () => {
    const LIST_DIMENSIONS = 'w-[350px] h-[3px]';
    // --- DATOS DE EJEMPLO ---
    // Usamos suficientes datos para que el scroll sea útil
    const availableItems = [
        'Útil 1', 'Útil 2', 'Útil 3', 'Útil 4', 'Útil 5', 'Útil 6', 
        'Útil 7', 'Útil 8', 'Útil 9', 'Útil 10', 'Útil 11', 'Útil 12'
    ]; 
    const assignedItems = [
        { name: 'Útil 1', quantity: 5 },
        { name: 'Útil 2', quantity: 5 },
        { name: 'Útil 3', quantity: 5 },
        { name: 'Útil 4', quantity: 3 },
        { name: 'Útil 5', quantity: 1 },
        { name: 'Útil 6', quantity: 2 },
        { name: 'Útil 7', quantity: 5 },
        { name: 'Útil 8', quantity: 4 },
        { name: 'Útil 9', quantity: 2 },
        { name: 'Útil 10', quantity: 1 },
    ];
    // ------------------------

    return (
        <div className=" py-10">
            {/* Contenedor central (80% de ancho, centrado, con sombra) */}
            <div className="bg-white p-8 mx-auto w-full rounded-lg shadow-xl">
                
                {/* Encabezado y Selector de Curso */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Cursos asignados</h2>
                    <div className="flex items-center">
                        <p className="text-xl font-semibold mr-4">Seleccione curso</p>
                        <input
                            type="search"
                            placeholder="Buscar curso..."
                            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                </div>

                {/* Títulos de las Listas */}
                <div className="flex justify-between mb-2">
                    <p className="text-lg font-semibold w-2/5">Lista útiles del curso</p>
                    
                    <div className="flex-none w-[170px]"></div> 
                </div>

                {/* CONTENEDOR PRINCIPAL: Listas y Botones */}
                <div className="flex gap-4 items-start">
                    
                    {/* Columna Izquierda: Útiles Disponibles (w-2/5) */}
                    <div className="w-2/5 flex flex-col">
                        <input
                            type="search"
                            placeholder="Buscar útil..."
                            className="w-full p-2 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        
                        {/* LISTA IZQUIERDA: CLAVE: h-80 y **overflow-y-scroll** */}
                        <div className={`bg-white border rounded-lg shadow-md overflow-y-auto ${LIST_DIMENSIONS}`}>
                            <ul className="divide-y divide-gray-200">
                                {availableItems.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 transition-colors">
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center text-gray-500 space-y-4 mt-[160px] flex-none w-16">
    
                    {/* Botón para Mover a la Derecha (Asignar) */}
                    <button className="text-gray-700 hover:text-teal-500 transition-colors">
                        <ArrowTransferIcon />
                    </button>
                    
                    {/* Botón para Mover a la Izquierda (Desasignar) */}
                    <button className="text-gray-700 hover:text-teal-500 transition-colors">
                        <ArrowTransferIcon isReversed={true} />
                    </button>
                </div>

                    {/* Columna Derecha: Contenido de Asignados + Botones */}
                    
                    <div className="flex w-2/5"> 
                        {/* 1. Contenedor de la lista de asignados */}
                        <div className="flex flex-col  gap-4 ">   
                            <div className={`bg-white border rounded-lg shadow-md p-2 overflow-y-auto ${LIST_DIMENSIONS}`}>
                                <ul className="space-y-2">
                                    {assignedItems.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center border border-gray-200 p-2 rounded-md">
                                            <span>{item.name}</span>
                                            {/* Control de Cantidad */}
                                            <div className="flex items-center space-x-1">
                                                <input
                                                    type="number"
                                                    defaultValue={item.quantity}
                                                    min="1"
                                                    className="w-12 p-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    {/* Botones de Acción */}
                    <div className="flex flex-col justify-start space-y-4 pt-10 flex-none w-1/5">
                        <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md whitespace-nowrap">
                            Crear Útil
                        </button>
                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md whitespace-nowrap">
                            Asignar útiles al curso
                        </button>
                    </div>
                </div>

                {/* Botón Inferior "Volver" */}
                <div className="mt-10 flex justify-end">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors">
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseAssignmentPage;