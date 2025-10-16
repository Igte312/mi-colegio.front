// src/pages/SchoolSupplyListPage.tsx

import React, { useEffect, useState, useMemo } from "react";
// Importamos la función que creamos en api.ts
import { getActiveSchoolSupplies } from "../services/api"; 

/**
 * Interfaz que define la estructura de un útil escolar,
 * basada en la documentación del endpoint.
 */
interface SchoolSupply {
  id: number;
  name: string;
  description: string;
  active: boolean; // Aunque el endpoint es /active, lo mantenemos por consistencia
}

const SchoolSupplyListPage: React.FC = () => {
  const [supplies, setSupplies] = useState<SchoolSupply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Nuevo estado para el texto de búsqueda
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => {
    const fetchSchoolSupplies = async () => {
      try {
        setLoading(true);
        // Llamamos a la función de la API
        const data = await getActiveSchoolSupplies(); 
        
        // data será SchoolSupply[] o [] si no hay útiles.
        setSupplies(data); 

      } catch (err: any) {
        // Manejo de errores
        if (err.response?.status === 403) {
            setError("Acceso denegado. Solo usuarios con rol UTP pueden ver esta lista.");
        } else if (err.response?.status === 401) {
             setError("Sesión expirada o token inválido. Por favor, inicie sesión de nuevo.");
        } else {
             setError("No se pudieron cargar los útiles escolares.");
        }
        console.error("Error al cargar útiles:", err);

      } finally {
        setLoading(false);
      }
    };

    fetchSchoolSupplies();
  }, []);

  // Lógica para filtrar los útiles usando useMemo para optimización
  const filteredSupplies = useMemo(() => {
    if (!searchTerm) {
      return supplies; // Si no hay término de búsqueda, devuelve la lista completa
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    return supplies.filter(supply => {
      // Buscamos si el término está en el nombre O en la descripción
      return (
        supply.name.toLowerCase().includes(lowerCaseSearch) ||
        supply.description.toLowerCase().includes(lowerCaseSearch)
      );
    });
  }, [supplies, searchTerm]); // Se recalcula solo cuando cambian 'supplies' o 'searchTerm'


  if (loading) return <p className="text-center mt-8">Cargando útiles escolares...</p>;
  
  if (error) return (
    <div className="text-center mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded mx-auto max-w-lg">
        <p className="font-bold">Error de Carga</p>
        <p>{error}</p>
    </div>
  );
  
  // Si no hay útiles en la lista original pero la carga fue exitosa
  if (supplies.length === 0) return <p className="text-center mt-8 text-gray-500">No hay útiles escolares activos registrados en el sistema.</p>;


  return (
     <div className=" min-h-screen py-10">
        <div className="bg-white mx-auto w-full p-8 mx-auto max-w-4xl rounded-lg shadow-xl">
            <div>
                <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Útiles Escolares Activos
      </h2>

            {/* Barra de Búsqueda (Input) */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
            </div>
            
            {/* Mensaje cuando no hay resultados de búsqueda */}
            {filteredSupplies.length === 0 && searchTerm !== '' ? (
                <p className="text-center mt-8 text-gray-500">No se encontraron útiles con el término "{searchTerm}".</p>
            ) : (
                <div className="space-y-4">
                    {/* Iteramos sobre la lista FILTRADA */}
                    {filteredSupplies.map((supply) => ( 
                        <div
                            key={supply.id}
                            className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition duration-200"
                        >
                            <h3 className="text-xl font-semibold text-teal-600 mb-1">
                                {supply.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {supply.description}
                            </p>
                            {/* Opcional: Podrías añadir un botón de "Ver detalles" o "Editar" aquí */}
                        </div>
                    ))}
                </div>
            )}
          </div>
            </div>
        </div>
     </div>
  );
};

export default SchoolSupplyListPage;