// src/pages/SchoolSupplyListPage.tsx

import React, { useEffect, useState, useMemo } from "react";
// Importamos solo las funciones de API necesarias
import { 
    getActiveSchoolSupplies, 
    getCoursesBySchool, 
    getAssignedSchoolSuppliesByCourse, 
    saveCourseSuppliesAssignments 
} from "../services/api"; 

/**
 * Interfaz que define la estructura de un curso
 */
interface Course {
    id: number;
    name: string;
    level: string;
    letter: string;
    schoolId: number;
}

/**
 * Interfaz que define la estructura de un útil escolar.
 * 'quantity' es esencial para la lista asignada.
 */
interface SchoolSupply {
    id: number;
    name: string;
    description: string; 
    active: boolean; 
    quantity?: number; // Para útiles asignados
}

// Nuevo tipo para manejar el estado de la acción en progreso
type ActionState = 'save' | 'delete' | null;

const SchoolSupplyListPage: React.FC = () => {
    // ESTADOS DE DATOS
    const [allAvailableSupplies, setAllAvailableSupplies] = useState<SchoolSupply[]>([]); 
    const [assignedSupplies, setAssignedSupplies] = useState<SchoolSupply[]>([]); 
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    
    // ESTADOS DE UI/CONTROL
    const [courseSearchTerm, setCourseSearchTerm] = useState(''); 
    const [availableSearchTerm, setAvailableSearchTerm] = useState(''); 
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); 
    const [loading, setLoading] = useState(true);
    // Estado de la acción en curso para diferenciar entre guardar y eliminar
    const [actionInProgress, setActionInProgress] = useState<ActionState>(null); 
    const [initialLoadError, setInitialLoadError] = useState<string | null>(null); 
    const [saveError, setSaveError] = useState<string | null>(null); 
    
    // ESTADOS DE SELECCIÓN DE LISTAS
    const [selectedAvailableId, setSelectedAvailableId] = useState<number | null>(null);
    const [selectedAssignedId, setSelectedAssignedId] = useState<number | null>(null);
        
// ----------------------------------------------------------------------
// 1. EFECTOS DE CARGA DE DATOS
// ----------------------------------------------------------------------

    // Carga inicial de Cursos y Útiles DISPONIBLES
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                setInitialLoadError(null); 

                const suppliesData = await getActiveSchoolSupplies(); 
                setAllAvailableSupplies(suppliesData); 
                
                const coursesResponse = await getCoursesBySchool(); 
                setAllCourses(coursesResponse.data); 
            } catch (err: any) {
                let errorMessage = "No se pudieron cargar los datos iniciales.";
                if (err.response) {
                    if (err.response.status === 403) {
                        errorMessage = "Acceso denegado. Solo usuarios con rol UTP pueden ver esta lista.";
                    } else if (err.response.status === 401) {
                        errorMessage = "Sesión expirada o token inválido.";
                    }
                }
                setInitialLoadError(errorMessage);
                console.error("Error al cargar datos:", err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);


    // Carga de Útiles ASIGNADOS cuando se selecciona un curso
    useEffect(() => {
        if (!selectedCourse) {
            setAssignedSupplies([]);
            setSaveError(null); 
            return;
        }
        
        setSelectedAvailableId(null);
        setSelectedAssignedId(null);

        const loadAssignedSupplies = async () => {
            try {
                const assignedData = await getAssignedSchoolSuppliesByCourse(selectedCourse.id);
                // Aseguramos que 'quantity' sea al menos 1
                const safeAssignedData = assignedData.map(supply => ({
                    ...supply,
                    quantity: supply.quantity && supply.quantity > 0 ? supply.quantity : 1 
                }));
                setAssignedSupplies(safeAssignedData); 
            } catch (err) {
                console.error("Error al cargar útiles asignados:", err);
                setAssignedSupplies([]);
            }
        };

        loadAssignedSupplies();
    }, [selectedCourse]); 

// ----------------------------------------------------------------------
// 2. LÓGICA DE FILTRADO (useMemo)
// ----------------------------------------------------------------------

    // Filtrado de CURSOS
    const filteredCourses = useMemo(() => {
        if (courseSearchTerm.length < 2) return []; 
        const lowerCaseSearch = courseSearchTerm.toLowerCase();
        return allCourses.filter(course => {
            const fullName = `${course.name} ${course.letter} ${course.level}`.toLowerCase();
            return fullName.includes(lowerCaseSearch);
        });
    }, [allCourses, courseSearchTerm]);

    // Filtrado de ÚTILES DISPONIBLES (excluyendo los ya asignados)
    const filteredAvailableSupplies = useMemo(() => {
        const assignedIds = new Set(assignedSupplies.map(s => s.id));
        const available = allAvailableSupplies.filter(s => !assignedIds.has(s.id));

        if (!availableSearchTerm) {
            return available;
        }
        const lowerCaseSearch = availableSearchTerm.toLowerCase();
        return available.filter(supply => {
            return (
                supply.name.toLowerCase().includes(lowerCaseSearch) ||
                supply.description.toLowerCase().includes(lowerCaseSearch)
            );
        });
    }, [allAvailableSupplies, assignedSupplies, availableSearchTerm]);


// ----------------------------------------------------------------------
// 3. HANDLERS DE LA DOBLE LISTA Y FLECHAS Y GUARDADO
// ----------------------------------------------------------------------

    const assignSupply = (supplyId: number) => {
        const supplyToAssign = allAvailableSupplies.find(s => s.id === supplyId);
        if (supplyToAssign) {
            setAssignedSupplies([...assignedSupplies, { ...supplyToAssign, quantity: 1 }]);
            setSelectedAvailableId(null); 
        }
    };

    const unassignSupply = (supplyId: number) => {
        const newAssignedSupplies = assignedSupplies.filter(s => s.id !== supplyId);
        setAssignedSupplies(newAssignedSupplies);
        setSelectedAssignedId(null); 
    };

    const handleMoveToAssigned = () => {
        if (selectedAvailableId !== null) {
            assignSupply(selectedAvailableId);
        }
    };

    const handleMoveToAvailable = () => {
        if (selectedAssignedId !== null) {
            unassignSupply(selectedAssignedId);
        }
    };
    
    // Función de cambio de cantidad con validación para asegurar entero >= 1
    const handleQuantityChange = (supplyId: number, rawValue: string) => {
        const newQuantity = Math.max(1, parseInt(rawValue) || 1); 

        setAssignedSupplies(assignedSupplies.map(supply => 
            supply.id === supplyId 
                ? { ...supply, quantity: newQuantity } 
                : supply
        ));
    };

    // Función principal para GUARDAR ASIGNACIONES o ELIMINAR TOTALMENTE
    const saveAssignmentsToBackend = async (
        payload: { schoolSupplyId: number; quantity: number }[],
        action: ActionState // <-- Recibe el tipo de acción
    ) => {
        if (!selectedCourse || actionInProgress) return;

        setActionInProgress(action); // <-- Inicia el estado de la acción
        setSaveError(null); 

        try {
            await saveCourseSuppliesAssignments(selectedCourse.id, payload);

            const successMessage = payload.length === 0 
                ? "¡Se eliminaron todos los útiles asignados al curso con éxito!"
                : "¡Asignación guardada con éxito!";
            alert(successMessage);

            // Si el payload no está vacío, aseguramos que la lista local esté limpia y actualizada
            if (payload.length === 0) {
                 setAssignedSupplies([]);
            }

        } catch (err: any) {
            console.error("Error al guardar asignaciones:", err);
            
            let errorMessage = "Error al intentar guardar las asignaciones. Por favor, inténtelo de nuevo.";
            
            if (err.response?.status === 404 && err.response.data?.message) {
                 errorMessage = `Error de datos: ${err.response.data.message}. Revise los IDs de los útiles asignados.`;
            } else if (err.response?.status === 403) {
                 errorMessage = "Acceso denegado al guardar. Verifique sus permisos (Rol UTP).";
            }
            
            setSaveError(errorMessage);

        } finally {
            setActionInProgress(null); // <-- Limpia el estado al finalizar
        }
    };

    // Handler para el botón de ASIGNAR (Guardar la lista actual)
    const handleSaveAssignments = () => {
        if (!selectedCourse) return;

        // Filtramos para asegurar ID y Quantity válidos (Quantity > 0)
        const validAssignedSupplies = assignedSupplies.filter(supply => 
            supply.id && typeof supply.id === 'number' && 
            supply.quantity && supply.quantity > 0
        );

        // Creamos el payload (puede ser [])
        const assignmentsPayload = validAssignedSupplies.map(supply => ({
            schoolSupplyId: supply.id, 
            quantity: supply.quantity!, 
        }));

        saveAssignmentsToBackend(assignmentsPayload, 'save'); // <-- Pasa 'save' como acción
    };

    // Handler para el nuevo botón de ELIMINAR TODOS
    const handleDeleteAllAssignments = () => {
        if (!selectedCourse || actionInProgress) return;

        const confirmDelete = window.confirm(
            `¿Está seguro que desea ELIMINAR TODOS los útiles asignados a ${selectedCourse.name} (${selectedCourse.letter})? Esta acción es permanente.`
        );

        if (confirmDelete) {
            // Se llama a la función de guardado con un payload VACÍO
            saveAssignmentsToBackend([], 'delete'); // <-- Pasa 'delete' como acción
        }
    };
        
// ----------------------------------------------------------------------
// 4. RENDERING (Diseño ajustado al Wireframe)
// ----------------------------------------------------------------------

    if (loading) return <p className="text-center mt-8">Cargando datos del sistema...</p>;
    
    if (initialLoadError) return ( 
        <div className="text-center mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded mx-auto max-w-lg">
            <p className="font-bold">Error de Carga Inicial</p>
            <p>{initialLoadError}</p>
        </div>
    );
    
    return (
        <div className="min-h-screen py-10 bg-gray-50">
            <div className="mx-auto w-full max-w-6xl">
                <div className="p-8 bg-white shadow-xl rounded-lg">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Asignación de Útiles por Curso
                        </h2>
                    </div>
                    
                    {/* 1. BUSCADOR DE CURSO */}
                    <div className="mb-8 relative z-10">
                        <label className="block text-xl font-semibold text-gray-700 mb-2">Seleccione curso</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar curso..."
                                value={courseSearchTerm}
                                onChange={(e) => {
                                    setCourseSearchTerm(e.target.value);
                                    if (selectedCourse) setSelectedCourse(null); 
                                }}
                                className="w-1/3 p-3 border border-gray-400 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                disabled={!!selectedCourse} 
                            />
                        </div>
                        
                        {/* Dropdown de resultados */}
                        {!selectedCourse && courseSearchTerm.length > 1 && filteredCourses.length > 0 && (
                            <div className="absolute z-20 w-1/3 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {filteredCourses.map(course => (
                                    <div
                                        key={course.id}
                                        className="p-2 cursor-pointer hover:bg-blue-100"
                                        onClick={() => {
                                            setSelectedCourse(course);
                                            setCourseSearchTerm(`${course.name} (${course.letter})`); 
                                        }}
                                    >
                                        {course.name} ({course.letter}) - {course.level}
                                    </div>
                                ))}
                            </div>
                        )}
                         {!selectedCourse && courseSearchTerm.length > 0 && courseSearchTerm.length < 2 && (
                            <div className="absolute z-20 w-1/3 mt-1 p-2 text-sm text-gray-600">
                                Escriba al menos 2 caracteres para buscar.
                            </div>
                        )}
                    </div>
                    
                    {/* Contenido principal: Curso Seleccionado y Doble Lista */}
                    {selectedCourse ? (
                        <>
                            {/* Cuadro de Curso Seleccionado */}
                            <div className="bg-blue-50 p-6 mb-8 border border-blue-200 rounded-lg shadow-inner">
                                <h3 className="text-2xl font-bold text-blue-800">Curso Seleccionado</h3>
                                <h4 className="text-4xl font-extrabold text-blue-600 mt-2">{selectedCourse.name}</h4>
                                <p className="text-xl text-blue-700">Sección {selectedCourse.letter}</p>
                                <hr className="my-3 border-blue-300" />
                                <button 
                                    onClick={() => { setSelectedCourse(null); setCourseSearchTerm(''); setSaveError(null); }} 
                                    className="w-full mt-4 py-2 bg-red-100 text-red-700 font-semibold rounded border border-red-300 hover:bg-red-200 transition"
                                >
                                    Cambiar Curso
                                </button>
                            </div>
                            
                            {/* Mensaje de error al guardar */}
                            {saveError && (
                                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded border border-red-300">
                                    {saveError}
                                </div>
                            )}

                            {/* 2. CONTENEDOR DE DOBLE LISTA */}
                            <div className="grid grid-cols-5 gap-4">
                                
                                {/* COLUMNA 1: ÚTILES DISPONIBLES (2/5) */}
                                <div className="col-span-2">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Útiles Disponibles</h3>
                                    <input
                                        type="text"
                                        placeholder="Buscar útil..."
                                        value={availableSearchTerm}
                                        onChange={(e) => setAvailableSearchTerm(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                                    />
                                    
                                    <div className="space-y-1 h-80 overflow-y-auto border border-gray-400 p-2 rounded bg-white">
                                        {filteredAvailableSupplies.length === 0 ? (
                                            <p className="text-center text-gray-500 mt-8">
                                                {availableSearchTerm ? "No hay coincidencias." : "No hay útiles disponibles o todos están asignados."}
                                            </p>
                                        ) : (
                                            filteredAvailableSupplies.map((supply) => (
                                                <div 
                                                    key={supply.id} 
                                                    onClick={() => { 
                                                        setSelectedAvailableId(supply.id);
                                                        setSelectedAssignedId(null); 
                                                    }}
                                                    className={`p-2 flex justify-between items-center border-b border-gray-100 cursor-pointer ${
                                                        selectedAvailableId === supply.id ? 'bg-blue-200 font-semibold' : 'hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <span>{supply.name}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                
                                {/* COLUMNA 2: BOTONES DE ACCIÓN (1/5) */}
                                <div className="flex flex-col justify-center items-center col-span-1">
                                    <div className="flex flex-col gap-4">
                                        <button 
                                            onClick={handleMoveToAssigned}
                                            disabled={selectedAvailableId === null}
                                            className={`text-3xl font-bold transition duration-200 p-2 rounded-full border-2 ${
                                                selectedAvailableId !== null ? 'text-green-600 border-green-600 hover:bg-green-100' : 'text-gray-400 border-gray-300 cursor-not-allowed'
                                            }`}
                                        >
                                            &gt;&gt;
                                        </button>
                                        <button 
                                            onClick={handleMoveToAvailable}
                                            disabled={selectedAssignedId === null}
                                            className={`text-3xl font-bold transition duration-200 p-2 rounded-full border-2 ${
                                                selectedAssignedId !== null ? 'text-red-600 border-red-600 hover:bg-red-100' : 'text-gray-400 border-gray-300 cursor-not-allowed'
                                            }`}
                                        >
                                            &lt;&lt;
                                        </button>
                                    </div>
                                </div>

                                {/* COLUMNA 3: ÚTILES ASIGNADOS (2/5) */}
                                <div className="col-span-2 flex flex-col">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Útiles Asignados al Curso</h3>
                                    <div className="space-y-1 h-80 overflow-y-auto border border-gray-400 p-2 rounded bg-white flex-grow">
                                        {/* Encabezado fijo para la lista asignada */}
                                        <div className="flex justify-between font-bold border-b pb-1 text-sm sticky top-0 bg-white z-10">
                                            <span className="flex-1">Útil</span>
                                            <span className="w-20 text-center">Cantidad</span>
                                        </div>
                                        
                                        {assignedSupplies.length === 0 ? (
                                            <p className="text-center text-gray-500 mt-8">No hay útiles asignados.</p>
                                        ) : (
                                            assignedSupplies.map((supply) => (
                                                <div 
                                                    key={supply.id} 
                                                    onClick={() => { 
                                                        setSelectedAssignedId(supply.id);
                                                        setSelectedAvailableId(null); 
                                                    }}
                                                    className={`p-2 flex justify-between items-center border-b border-blue-100 cursor-pointer ${
                                                        selectedAssignedId === supply.id ? 'bg-red-200 font-semibold' : 'hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <div className="flex-1">{supply.name}</div>
                                                    
                                                    {/* Input de Cantidad */}
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={supply.quantity ?? 1} 
                                                        onChange={(e) => 
                                                            handleQuantityChange(supply.id, e.target.value)
                                                        }
                                                        onClick={(e) => e.stopPropagation()} 
                                                        className="w-20 p-1 border rounded text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    
                                    {/* Botones de Guardar y Eliminar */}
                                    <div className="mt-4 flex flex-col gap-2">
                                        {/* Botón Guardar/Asignar */}
                                        <button 
                                            onClick={handleSaveAssignments}
                                            // Deshabilita si cualquier acción está en progreso
                                            disabled={actionInProgress !== null} 
                                            className={`w-full py-3 px-4 rounded font-semibold transition duration-200 shadow-md ${
                                                // Muestra el estilo de cargando solo si la acción es 'save'
                                                actionInProgress === 'save' 
                                                    ? 'bg-gray-500 text-white cursor-not-allowed'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                            }`}
                                        >
                                            {/* Muestra el texto de cargando solo si la acción es 'save' */}
                                            {actionInProgress === 'save' ? 'Guardando asignación...' : 'Asignar útiles al curso'}
                                        </button>

                                        {/* NUEVO BOTÓN: Eliminar Todos los Útiles */}
                                        <button 
                                            onClick={handleDeleteAllAssignments}
                                            // Deshabilita si cualquier acción está en progreso o si la lista está vacía
                                            disabled={actionInProgress !== null || assignedSupplies.length === 0}
                                            className={`w-full py-3 px-4 rounded font-semibold transition duration-200 shadow-md ${
                                                // Muestra el estilo de cargando solo si la acción es 'delete'
                                                (actionInProgress === 'delete')
                                                    ? 'bg-gray-500 text-white cursor-not-allowed'
                                                    : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                        >
                                            {/* Muestra el texto de cargando solo si la acción es 'delete' */}
                                            {actionInProgress === 'delete' ? 'Eliminando útiles...' : 'Eliminar Todos los Útiles'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-center mt-12 p-6 bg-gray-100 rounded">Por favor, use el buscador superior para seleccionar un curso y comenzar la asignación de útiles.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchoolSupplyListPage;