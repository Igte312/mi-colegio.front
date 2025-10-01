// src/App.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CourseSelectionPage from './components/CourseSelectionPage';
import CourseDetailsPage from './components/CourseDetailsPage';
import { getHello } from './services/api';
import viteLogo from '/vite.svg';

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    getHello().then((response) => {
      console.log("data : ", response.data.message);
      setMessage(response.data.message);
    });
  }, []);

  return (
    <>
      {/* Rutas del sistema */}
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/seleccionar-curso" element={<MainLayout><CourseSelectionPage /></MainLayout>} />
        <Route path="/curso-detalles" element={<MainLayout><CourseDetailsPage /></MainLayout>} />
      </Routes>

      {/* Bloque visual adicional */}
      
      <h1>Vite + React</h1>

      <div className="card">
        <p>Mensaje desde el backend: {message || "Cargando..."}</p>
      </div>
    </>
  );
}

export default App;
