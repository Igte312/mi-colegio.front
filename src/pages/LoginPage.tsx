// src/pages/LoginPage.tsx (RESPONSIVO CON TAILWIND CSS)

import React from "react";
import fondoLogin from "../assets/fondo-login.png";
import logo from '../assets/logoMicolegio.png';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    return (
        <div
            className="relative flex items-center justify-center min-h-screen 
                       bg-no-repeat bg-center bg-cover p-4 sm:p-8" // ✅ Clases bg-cover y padding responsivo
            style={{
                backgroundImage: `url(${fondoLogin})`,
                // Quitamos backgroundSize: '125%' para usar bg-cover
            }}
        >
            {/* Barra superior - Usando clases de Tailwind para opacidad y color */}
            <div
                className="absolute top-0 left-0 w-full h-24 bg-teal-500 opacity-40" // ✅ bg-teal-500 opacity-40 (similar a 0.36)
            ></div>

            {/* 🎯 Contenedor del Login (Centrado y Responsivo) */}
            <div
                className="bg-white rounded-xl shadow-2xl p-8 sm:p-12 lg:p-16 
                           flex flex-col items-center z-10 
                           w-full max-w-sm sm:max-w-md mx-auto"
            >

                {/* Logo */}
                <img
                    src={logo}
                    alt="Logo Mi Colegio"
                    className="mb-10 w-48 sm:w-56 lg:w-64 h-auto"
                />

                {/* Mensaje de apoyo */}
                <p className="mb-8 text-center text-gray-600 font-medium">
                    Inicie sesión con su cuenta institucional
                </p>

                <button
                    onClick={onLogin}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg 
                               transition duration-300 shadow-md transform hover:scale-[1.01]"
                >
                    Ingresar
                </button>
            </div>

            {/* Barra inferior - Usando clases de Tailwind para opacidad y color */}
            <div
                className="absolute bottom-0 left-0 w-full h-24 bg-teal-500 opacity-40" // ✅ bg-teal-500 opacity-40
            ></div>
        </div>
    );
};


export default LoginPage;