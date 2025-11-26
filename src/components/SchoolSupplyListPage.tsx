// ⚠️ ARCHIVO: src/components/SchoolSupplyListPage.tsx (o src/pages/SchoolSupplyListPage.tsx)
// 🚀 IMPLEMENTACIÓN FINAL CON MANEJO DE ERROR DE INTEGRIDAD EN ELIMINACIÓN

import React, { useEffect, useState, useMemo } from "react";
// Importamos solo las funciones de API necesarias
import { 
    getActiveSchoolSupplies, 
    getCoursesBySchool, 
    getAssignedSchoolSuppliesByCourse, 
    saveCourseSuppliesAssignments,
    createSchoolSupply, 
    deleteSchoolSupply 
} from "../services/api"; // ASUMIMOS QUE TENEMOS UN ARCHIVO services/api.ts

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
 */
interface SchoolSupply {
    id: number;
    name: string;
    description: string; 
    active: boolean; 
    quantity?: number; // Para útiles asignados
}

// Nuevo tipo para manejar el estado de la acción en progreso
type ActionState = 'save' | 'delete' | 'create' | 'deleteSupply' | null;

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
    const [actionInProgress, setActionInProgress] = useState<ActionState>(null); 
    const [initialLoadError, setInitialLoadError] = useState<string | null>(null); 
    const [saveError, setSaveError] = useState<string | null>(null); 
    
    // ESTADOS DE SELECCIÓN DE LISTAS
    const [selectedAvailableId, setSelectedAvailableId] = useState<number | null>(null);
    const [selectedAssignedId, setSelectedAssignedId] = useState<number | null>(null);
    
    // ESTADOS DE ÚTIL A ELIMINAR
    const [deleteSupplyError, setDeleteSupplyError] = useState<string | null>(null);

    // ESTADOS DE CREACIÓN DE ÚTIL (MODAL)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSupplyName, setNewSupplyName] = useState('');
    const [newSupplyDescription, setNewSupplyDescription] = useState('');
    const [createError, setCreateError] = useState<string | null>(null);

// ----------------------------------------------------------------------
// 1. EFECTOS DE CARGA DE DATOS
// ----------------------------------------------------------------------

    /**
     * Función para cargar/recargar solo los útiles disponibles
     */
    const loadActiveSupplies = async () => {
        try {
            setInitialLoadError(null); 
            const suppliesData = await getActiveSchoolSupplies(); 
            setAllAvailableSupplies(suppliesData); 
        } catch (err: any) {
            console.error("Error al recargar útiles:", err);
            // Solo actualizamos el error si no hay ya un error inicial más grave
            if (!initialLoadError) {
                   setInitialLoadError("No se pudieron recargar la lista de útiles disponibles.");
            }
        }
    };

    // Carga inicial de Cursos y Útiles DISPONIBLES
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                await loadActiveSupplies(); // Cargar útiles

                // Asumimos que getCoursesBySchool devuelve { data: Course[] }
                const coursesResponse = await getCoursesBySchool(); 
                setAllCourses(coursesResponse.data); 
            } catch (err: any) {
                let errorMessage = "No se pudieron cargar los datos iniciales.";
                if (err.response?.status === 403) {
                    errorMessage = "Acceso denegado. Solo usuarios con rol UTP pueden ver esta lista.";
                } else if (err.response?.status === 401) {
                    errorMessage = "Sesión expirada o token inválido.";
                }
                setInitialLoadError(errorMessage);
                console.error("Error al cargar datos:", err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []); // Se ejecuta solo una vez al montar

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
                // Asumimos que getAssignedSchoolSuppliesByCourse devuelve SchoolSupply[]
                const assignedData = await getAssignedSchoolSuppliesByCourse(selectedCourse.id);
                const safeAssignedData = assignedData.map(supply => ({
                    ...supply,
                    // Asegura que quantity es al menos 1
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

    const filteredCourses = useMemo(() => {
        if (courseSearchTerm.length < 2) return []; 
        const lowerCaseSearch = courseSearchTerm.toLowerCase();
        return allCourses.filter(course => {
            const name = course.name ?? '';
            const letter = course.letter ?? '';
            const level = course.level ?? '';
            const fullName = `${name} ${letter} ${level}`.toLowerCase();
            return fullName.includes(lowerCaseSearch);
        });
    }, [allCourses, courseSearchTerm]);

    const filteredAvailableSupplies = useMemo(() => {
        // IDs de útiles que ya están en la lista asignada
        const assignedIds = new Set(assignedSupplies.map(s => s.id));
        
        // Filtramos la lista principal para mostrar solo los que no están asignados
        const available = allAvailableSupplies.filter(s => !assignedIds.has(s.id));

        if (!availableSearchTerm) {
            return available;
        }
        const lowerCaseSearch = availableSearchTerm.toLowerCase();
        return available.filter(supply => {
            const supplyName = supply.name ?? '';
            const supplyDescription = supply.description ?? '';

            return (
                supplyName.toLowerCase().includes(lowerCaseSearch) ||
                supplyDescription.toLowerCase().includes(lowerCaseSearch)
            );
        });
    }, [allAvailableSupplies, assignedSupplies, availableSearchTerm]);


// ----------------------------------------------------------------------
// 3. HANDLERS DE LISTAS Y GUARDADO
// ----------------------------------------------------------------------

    const assignSupply = (supplyId: number) => {
        const supplyToAssign = allAvailableSupplies.find(s => s.id === supplyId);
        if (supplyToAssign) {
            // Asigna con cantidad inicial de 1
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
    
    const handleQuantityChange = (supplyId: number, rawValue: string) => {
        // Asegura que el valor es un entero positivo, mínimo 1
        const newQuantity = Math.max(1, parseInt(rawValue) || 1); 

        setAssignedSupplies(assignedSupplies.map(supply => 
            supply.id === supplyId 
                ? { ...supply, quantity: newQuantity } 
                : supply
        ));
    };

    const saveAssignmentsToBackend = async (
        payload: { schoolSupplyId: number; quantity: number }[],
        action: ActionState 
    ) => {
        if (!selectedCourse || actionInProgress) return;

        setActionInProgress(action); 
        setSaveError(null); 

        try {
            await saveCourseSuppliesAssignments(selectedCourse.id, payload);

            const successMessage = payload.length === 0 
                ? "¡Se eliminaron todos los útiles asignados al curso con éxito!"
                : "¡Asignación guardada con éxito!";
            alert(successMessage);

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
            setActionInProgress(null); 
        }
    };

    const handleSaveAssignments = () => {
        if (!selectedCourse) return;

        // Filtra para asegurar que solo se envíen útiles con ID y cantidad > 0
        const validAssignedSupplies = assignedSupplies.filter(supply => 
            supply.id && typeof supply.id === 'number' && 
            supply.quantity && supply.quantity > 0
        );

        const assignmentsPayload = validAssignedSupplies.map(supply => ({
            schoolSupplyId: supply.id, 
            quantity: supply.quantity!, // ! asegura al compilador que ya revisamos si es nulo
        }));

        saveAssignmentsToBackend(assignmentsPayload, 'save'); 
    };

    const handleDeleteAllAssignments = () => {
        if (!selectedCourse || actionInProgress) return;

        const confirmDelete = window.confirm(
            `¿Está seguro que desea ELIMINAR TODOS los útiles asignados a ${selectedCourse.name} (${selectedCourse.letter})? Esta acción es permanente.`
        );

        if (confirmDelete) {
            saveAssignmentsToBackend([], 'delete'); 
        }
    };

// ----------------------------------------------------------------------
// 4. HANDLERS DE CREACIÓN Y ELIMINACIÓN PERMANENTE DE ÚTILES
// ----------------------------------------------------------------------
    
    /**
     * Maneja la creación del nuevo útil desde el modal.
     */
    const handleCreateNewSupply = async () => {
        setCreateError(null);

        const trimmedName = newSupplyName.trim();
        const trimmedDescription = newSupplyDescription.trim();
        
        // LÓGICA DE VALIDACIÓN INSTANTÁNEA
        if (!trimmedName || !trimmedDescription) {
            setCreateError("❌ ¡Error de validación! El nombre y la descripción del útil son obligatorios.");
            return; 
        }

        setActionInProgress('create');

        try {
            await createSchoolSupply({ 
                name: trimmedName, 
                description: trimmedDescription
            }); 

            await loadActiveSupplies(); 
            
            setNewSupplyName('');
            setNewSupplyDescription('');
            setIsModalOpen(false);
            
            alert(`✅ Útil "${trimmedName}" creado y disponible para asignación.`);

        } catch (err: any) {
             console.error("Error al crear útil:", err);
             let errorMessage = "Error al crear el útil. Por favor, intente de nuevo.";
             if (err.response?.data?.message) {
                 errorMessage = err.response.data.message;
             } else if (err.message) {
                 errorMessage = err.message; 
             }
             setCreateError(`🚨 Error de Servidor: ${errorMessage}`);
        } finally {
            setActionInProgress(null);
        }
    };
    
    /**
     * 🗑️ Maneja la eliminación PERMANENTE de un útil escolar de la lista de disponibles.
     */
    const handleDeleteSupplyPermanently = async (supplyId: number) => {
        const supply = allAvailableSupplies.find(s => s.id === supplyId);
        
        if (!supply) return;
        
        const confirmDelete = window.confirm(
            `⚠️ Advertencia: Está a punto de ELIMINAR PERMANENTEMENTE el útil: "${supply.name}". Esta acción NO SE PUEDE deshacer. ¿Desea continuar?`
        );
        
        if (!confirmDelete) return;

        setActionInProgress('deleteSupply');
        setDeleteSupplyError(null);
        
        try {
            await deleteSchoolSupply(supplyId);
            
            await loadActiveSupplies(); 
            
            if (selectedAvailableId === supplyId) {
                setSelectedAvailableId(null);
            }
            
            // Asegurarse de que no esté en la lista asignada 
            setAssignedSupplies(prev => prev.filter(s => s.id !== supplyId));
            
            alert(`🗑️ Útil "${supply.name}" eliminado permanentemente.`);
            
        } catch (err: any) {
            console.error("Error al eliminar útil:", err);
            let errorMessage = "Error al eliminar el útil. Por favor, intente de nuevo.";

            // 💡 LÓGICA DE MANEJO DE ERROR 500/INTEGRIDAD DE DATOS
            if (err.response?.status === 500 && err.response.data?.error === "DataIntegrityViolationException") {
                // Mensaje claro de que el útil tiene dependencias (está asignado)
                errorMessage = "🚨 NO SE PUEDE ELIMINAR. El útil está actualmente asignado a uno o más cursos. Debe desasignarlo de todos los cursos y guardar el cambio antes de eliminarlo permanentemente.";
            } else if (err.message) {
                errorMessage = err.message; 
            }
            
            setDeleteSupplyError(`🚨 Error al eliminar: ${errorMessage}`);
            
        } finally {
            setActionInProgress(null);
        }
    };


// ----------------------------------------------------------------------
// 5. RENDERING
// ----------------------------------------------------------------------

    if (loading) return <p className="text-center mt-8">Cargando datos del sistema...</p>;
    
    if (initialLoadError && !allCourses.length) return ( 
        <div className="text-center mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded mx-auto max-w-lg">
            <p className="font-bold">Error de Carga Inicial</p>
            <p>{initialLoadError}</p>
        </div>
    );
    
    return (
        <div className="min-h-screen py-10 bg-gray-50">
            <div className="mx-auto w-full max-w-6xl">
                <div className="p-8 bg-white shadow-xl rounded-lg">
                    {/* ENCABEZADO CON BOTÓN DE CREAR */}
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Asignación de Útiles por Curso
                        </h2>
                        
                        {/* BOTÓN: Abrir Modal de Creación de Nuevo Útil */}
                        <button
                            onClick={() => {
                                setCreateError(null); 
                                setNewSupplyName('');
                                setNewSupplyDescription('');
                                setIsModalOpen(true);
                            }}
                            className="bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition duration-200 shadow-md flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            <span>Crear Nuevo Útil</span>
                        </button>
                        
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
                                    
                                    {/* Mensaje de error de eliminación para útiles disponibles */}
                                    {deleteSupplyError && (
                                        <div className="p-2 mb-2 text-sm text-red-700 bg-red-100 rounded border border-red-300">
                                            {deleteSupplyError}
                                        </div>
                                    )}

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
                                                    <span className="flex-1">{supply.name}</span>
                                                    
                                                    {/* 🗑️ BOTÓN DE ELIMINACIÓN PERMANENTE */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Evita que se active el onClick del padre
                                                            handleDeleteSupplyPermanently(supply.id);
                                                        }}
                                                        disabled={actionInProgress === 'deleteSupply'}
                                                        className={`ml-2 text-sm font-semibold p-1 rounded transition duration-200 ${
                                                            actionInProgress === 'deleteSupply'
                                                                ? 'text-gray-500 cursor-not-allowed'
                                                                : 'text-red-600 hover:bg-red-50'
                                                        }`}
                                                        title="Eliminar útil permanentemente del sistema"
                                                    >
                                                        {actionInProgress === 'deleteSupply' ? '...' : '❌'}
                                                    </button>

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
                                    
                                    {/* Botones de Guardar y Eliminar Asignaciones */}
                                    <div className="mt-4 flex flex-col gap-2">
                                        {/* Botón Guardar/Asignar */}
                                        <button 
                                            onClick={handleSaveAssignments}
                                            disabled={actionInProgress !== null} 
                                            className={`w-full py-3 px-4 rounded font-semibold transition duration-200 shadow-md ${
                                                actionInProgress === 'save' 
                                                    ? 'bg-gray-500 text-white cursor-not-allowed'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                            }`}
                                        >
                                            {actionInProgress === 'save' ? 'Guardando asignación...' : 'Asignar útiles al curso'}
                                        </button>
                                        
                                        {/* Botón Eliminar Todas las Asignaciones */}
                                        <button 
                                            onClick={handleDeleteAllAssignments}
                                            disabled={actionInProgress !== null || assignedSupplies.length === 0}
                                            className={`w-full py-3 px-4 rounded font-semibold transition duration-200 shadow-md ${
                                                (actionInProgress === 'delete' || assignedSupplies.length === 0)
                                                    ? 'bg-gray-500 text-white cursor-not-allowed'
                                                    : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                        >
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
            
            {/* 6. MODAL DE CREACIÓN DE ÚTIL (Componente flotante) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Crear Nuevo Útil Escolar</h3>
                        
                        {createError && (
                            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded border border-red-300">
                                {createError}
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Útil</label>
                            <input
                                type="text"
                                value={newSupplyName}
                                onChange={(e) => setNewSupplyName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                disabled={actionInProgress === 'create'}
                            />
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                value={newSupplyDescription}
                                onChange={(e) => setNewSupplyDescription(e.target.value)}
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                disabled={actionInProgress === 'create'}
                            ></textarea>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    if (actionInProgress !== 'create') {
                                        setIsModalOpen(false);
                                    }
                                }}
                                disabled={actionInProgress === 'create'}
                                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateNewSupply}
                                disabled={actionInProgress === 'create'}
                                className={`px-4 py-2 rounded font-semibold transition duration-200 ${
                                    actionInProgress === 'create' 
                                        ? 'bg-gray-500 text-white cursor-not-allowed'
                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                }`}
                            >
                                {actionInProgress === 'create' ? 'Creando...' : 'Guardar Útil'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SchoolSupplyListPage;