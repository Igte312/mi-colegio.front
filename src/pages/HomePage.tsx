// src/pages/HomePage.tsx
import React from 'react';
import illustrationImage from '../assets/image.png';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between py-16">
      {/* Sección de Texto y Botones */}
      <div className="md:w-1/2 p-4 md:p-8">
        <h1 className="text-5xl font-bold mb-4 text-teal-600">
          <span className="block text-gray-900">App</span> MiColegio
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Esta es la aplicación para la gestión de útiles escolares de tu colegio.
        </p>
        
        <div className="flex space-x-4">
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Seleccionar Curso
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Crear Listado
          </button>
        </div>
      </div>

      {/* Imagen o Ilustración */}
      <div className="md:w-1/2 p-4 md:p-8 flex justify-center">
        <img src={illustrationImage} alt="Ilustración" className="w-full max-w-md" />
      </div>
    </div>
  );
};

export default HomePage;