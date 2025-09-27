// src/pages/CourseSelectionPage.tsx
import React from 'react';

const CourseSelectionPage: React.FC = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Seleccione curso a cargar
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
        {/* Course Card 1: Pre kinder */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-700">Pre kinder</span>
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out">
            seleccionar
          </button>
        </div>

        {/* Course Card 2: Kinder */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-700">Kinder</span>
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out">
            seleccionar
          </button>
        </div>

        {/* Course Card 3: Primero Básico */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-700">Primero Básico</span>
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out">
            seleccionar
          </button>
        </div>

        {/* Course Card 4: Segundo Básico */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-700">Segundo Básico</span>
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out">
            seleccionar
          </button>
        </div>

        {/* Course Card 5: Tercero Básico */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-700">Tercero Básico</span>
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out">
            seleccionar
          </button>
        </div>

        {/* Course Card 6: Cuarto Básico */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-700">Cuarto Básico</span>
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out">
            seleccionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSelectionPage;