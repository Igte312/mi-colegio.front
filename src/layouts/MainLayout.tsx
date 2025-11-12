// src/layouts/MainLayout.tsx (CORREGIDO Y RESPONSIVO)

import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/index.css'; // Asegúrate de que esto carga el CSS con .bg-app-gradient
import Footer from '../components/Footer';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div
            // ✅ Aplicamos la clase CSS personalizada para mantener el color y eliminamos 'style'
            className="min-h-screen font-sans text-gray-800 bg-app-gradient"
        >
            {/* Usamos 'min-h-screen' aquí también si queremos que el contenido siempre empuje el footer */}
            <div className="flex flex-col items-center min-h-screen">
                <Navbar />

                {/* 🎯 Contenido principal: Hacemos el padding responsivo (p-4 para móvil, sm:p-8 para escritorio) */}
                <main className="w-full max-w-6xl p-4 sm:p-8 flex-grow">
                    {children}
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;