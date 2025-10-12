// src/App.tsx
<<<<<<< HEAD
=======
import React from 'react';
>>>>>>> parent of abb47cf (add serivces)
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
// Nota: Estos componentes suelen estar en 'pages' si son rutas completas
import CourseSelectionPage from './components/CourseSelectionPage'; 
import CourseDetailsPage from './components/CourseDetailsPage';
<<<<<<< HEAD
import CourseAssignmentPage from './components/CourseAssignmentPage';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { loginRequest } from './auth/auth-config';
import TailwindContainer from './components/TailwindContainer';
import TailwindButton from './components/TailwindButton';

function App() {
  
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const handleLoginRedirect = () => {
    instance
      .loginRedirect({
        ...loginRequest,
        prompt: 'create',
      })
      .catch((error) => console.log(error));
  };

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin, 
    });
  };

  return (
    <div className="App">
      <AuthenticatedTemplate>
        {activeAccount ? (
          <>
            <TailwindButton className="signOutButton" onClick={handleLogout} variant="primary">
              Sign out
            </TailwindButton>
            <TailwindContainer>
             
             <Routes>
              <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
              <Route 
                path="/seleccionar-curso" 
                element={<MainLayout><CourseSelectionPage /></MainLayout>} 
              />

              {/* 🎯 CAMBIO CLAVE: Agregamos el parámetro dinámico :courseId */}
              <Route 
                path="/curso-detalles/:courseId" 
                element={<MainLayout><CourseDetailsPage /></MainLayout>} 
              />

              {/* Opcional: Si la asignación de útiles también depende del curso ID */}
              <Route 
                path="/asignar-util/:courseId" 
                element={<MainLayout><CourseAssignmentPage /></MainLayout>} 
              />

            </Routes>
            </TailwindContainer></>
        ) : null}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <TailwindButton className="signInButton" onClick={handleLoginRedirect} variant="primary">
            Sign up
          </TailwindButton>
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
=======

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      {/* Puedes agregar más rutas aquí para otras páginas */}
      <Route path="/seleccionar-curso" element={<MainLayout><CourseSelectionPage /></MainLayout>} />
       <Route path="/curso-detalles" element={<MainLayout><CourseDetailsPage /></MainLayout>} />
    </Routes>
  );
>>>>>>> parent of abb47cf (add serivces)
}

export default App;