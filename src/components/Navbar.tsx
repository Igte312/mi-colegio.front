// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import profileImage from '../assets/user.jpg';

const Navbar: React.FC = () => {
  const userIsLoggedIn = true;

  return (
    <nav className="w-full py-4 border-b-2 border-teal-500">
      <div className="flex justify-between items-center px-8 w-full max-w-6xl mx-auto">
        {/* Logo */}
        <div className="text-2xl font-bold text-teal-500">
          App MiColegio
        </div>

        {/* Enlaces de Navegación */}
        <div className="hidden md:flex space-x-8 text-gray-700 font-semibold">
          <Link to="/" className="hover:text-teal-500 transition-colors">Home</Link>
          <Link to="/acerca" className="hover:text-teal-500 transition-colors">Acerca</Link>
          <Link to="/servicios" className="hover:text-teal-500 transition-colors">Servicios</Link>
          <Link to="/contacto" className="hover:text-teal-500 transition-colors">Contacto</Link>
        </div>

        {/* Perfil de Usuario y Búsqueda */}
        <div className="flex items-center space-x-4">
        

          {/* Perfil del Usuario - Renderizado condicionalmente */}
          {userIsLoggedIn && (
            <div className="relative w-10 h-10">
              <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              <img src={profileImage} alt="User Profile" className="rounded-full w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;