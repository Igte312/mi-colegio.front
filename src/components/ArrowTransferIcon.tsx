import React from 'react';

// Define las props para que TypeScript sepa qué esperar
interface ArrowTransferIconProps {
  className?: string;
  isReversed?: boolean; // Para rotar el icono
}

const ArrowTransferIcon: React.FC<ArrowTransferIconProps> = ({ className = "w-8 h-8", isReversed = false }) => {
  const rotationClass = isReversed ? 'transform rotate-180' : '';
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={2.5} 
      stroke="currentColor" 
      className={`${className} ${rotationClass}`} // Aplica clases de Tailwind
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
};

export default ArrowTransferIcon;