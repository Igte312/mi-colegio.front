// src/components/Navbar.tsx (CORREGIDO con Desplegable)

import React, { useState } from 'react'; // ✅ Importar useState
import { Link } from 'react-router-dom';
import { useMsal, AuthenticatedTemplate } from '@azure/msal-react';
import profileImage from '../assets/user.jpg';
import SignOutButton from './SignOutButton';

const Navbar: React.FC = () => {
  // Estado para controlar la apertura/cierre del menú desplegable
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ Nuevo estado

  const { accounts } = useMsal();
  const userName = accounts[0]?.name || 'Usuario';

  return (
    <nav className="w-full py-4 border-b-2 border-teal-500">
      <div className="flex justify-between items-center px-8 w-full max-w-6xl mx-auto">
        <div className="text-2xl font-bold text-teal-500">
          App MiColegio
        </div>

        {/* Enlaces de Navegación */}
        <div className="hidden md:flex space-x-8 text-gray-700 font-semibold">
          <Link to="/" className="hover:text-teal-500 transition-colors">Home</Link>
          <Link to="/seleccionar-curso" className="hover:text-teal-500 transition-colors">Gestión Cursos</Link>
          <Link to="/acerca" className="hover:text-teal-500 transition-colors">Acerca</Link>
          <Link to="/servicios" className="hover:text-teal-500 transition-colors">Servicios</Link>
          <Link to="/contacto" className="hover:text-teal-500 transition-colors">Contacto</Link>
        </div>

        {/* Perfil de Usuario y Desplegable */}
        <div className="flex items-center space-x-4">
          <AuthenticatedTemplate>

            {/* Contenedor del Dropdown: Posicionamiento relativo */}
            <div className="relative">

              {/* 🎯 IMAGEN DE PERFIL (BOTÓN DE ACTIVACIÓN) */}
              <div
                className="relative w-10 h-10 cursor-pointer" // ✅ Añadir cursor-pointer
                onClick={() => setIsMenuOpen(!isMenuOpen)} // ✅ Toggle del estado
              >
                <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                <img src={profileImage} alt="User Profile" className="rounded-full w-full h-full object-cover" />
              </div>

              {/* 📌 MENÚ DESPLEGABLE */}
              {isMenuOpen && (
                <div
                  className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100" // Clases de Tailwind para el menú
                  // Detiene la propagación del clic para evitar que cierre inmediatamente
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Información del Usuario (Header) */}
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-semibold text-gray-800">{userName}</p>
                  </div>

                  {/* Opción de Logout */}
                  <SignOutButton />

                </div>
              )}
            </div>
          </AuthenticatedTemplate>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;