// src/components/TailwindButton.tsx

import React from 'react';

// Define las props y las variantes de color/estilo
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success'; // primary (gris), success (verde), secondary (volver)
}

const TailwindButton: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  
  const baseClasses = "font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md whitespace-nowrap";
  let variantClasses = "";

  switch (variant) {
    case 'primary': // Usado para "Crear Útil"
      variantClasses = "bg-gray-800 hover:bg-gray-700 text-white";
      break;
    case 'success': // Usado para "Asignar útiles al curso"
      variantClasses = "bg-green-500 hover:bg-green-600 text-white";
      break;
    case 'secondary': // Usado para "Volver" (Botón simple, sin sombra grande)
      variantClasses = "bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm py-2 px-4";
      break;
  }

  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default TailwindButton;