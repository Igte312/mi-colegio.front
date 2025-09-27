// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CourseSelectionPage from './components/CourseSelectionPage';
import CourseDetailsPage from './components/CourseDetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      {/* Puedes agregar más rutas aquí para otras páginas */}
      <Route path="/seleccionar-curso" element={<MainLayout><CourseSelectionPage /></MainLayout>} />
       <Route path="/curso-detalles" element={<MainLayout><CourseDetailsPage /></MainLayout>} />
    </Routes>
  );
}

export default App;