// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      {/* Puedes agregar más rutas aquí para otras páginas */}
    </Routes>
  );
}

export default App;