// src/components/TailwindContainer.tsx

import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const TailwindContainer: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    // Aplica ancho máximo, centrado, fondo blanco, padding y sombra
    <div className={`bg-white p-8 mx-auto max-w-7xl rounded-lg shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export default TailwindContainer;