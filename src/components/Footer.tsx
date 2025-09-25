// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 border-t-2 border-teal-500 mt-8 flex justify-center text-center">
      <div className="w-full max-w-6xl">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} App MiColegio. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;