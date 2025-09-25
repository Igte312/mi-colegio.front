// src/components/Header.tsx
import React from 'react';
import { LogOut, Home } from 'lucide-react'; // Instala lucide-react para los iconos
import { Link } from 'react-router-dom';

// Instala la librería de iconos: npm install lucide-react

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mb-8 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800">
        <Link to="/home">App MiColegio</Link>
      </h1>
      <div className="flex items-center space-x-4">
        <Link to="/home" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
          <Home className="mr-2" size={24} />
          <span>Inicio</span>
        </Link>
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-300 ease-in-out flex items-center">
          <LogOut className="mr-2" size={20} />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Header;