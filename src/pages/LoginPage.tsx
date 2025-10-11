import React from "react";
import fondoLogin from "../assets/fondo-login.png";
import logo from '../assets/logoMicolegio.png';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    return (
        <div
            className="relative flex items-center justify-center min-h-screen bg-no-repeat bg-center"
            style={{
                backgroundImage: `url(${fondoLogin})`,
                backgroundSize: '125%',
                backgroundPosition: 'center',
            }}
        >
            {/* Barra superior */}
            <div
                className="absolute top-0 left-0 w-full"
                style={{ height: '100px', backgroundColor: 'rgba(33, 228, 205, 0.36)' }} // 🔹 color teal más suave
            ></div>

            {/* Rectángulo del login */}
<div className="bg-white rounded-xl shadow-lg p-20 flex flex-col items-center z-10 transform translate-x-80">

                {/* 2. REEMPLAZAR <h2> por <img> para mostrar el logo */}
                <img
                    src={logo}
                    alt="Logo Mi Colegio"
                    className="mb-20" // Clase para margen inferior, similar al <h2>
                    style={{ width: '250px', height: 'auto' }} // Opcional: define un tamaño para el logo
                />

                <button
                    onClick={onLogin}
                    className="w-64 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition duration-300"
                >
                    Ingresar
                </button>
            </div>

            {/* Barra inferior */}
            <div
                className="absolute bottom-0 left-0 w-full"
                style={{ height: '99px', backgroundColor: 'rgba(33, 228, 205, 0.36)' }} // 🔹 mismo color suave
            ></div>
        </div>
    );
};


export default LoginPage;
