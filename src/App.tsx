// C:\Users\jlopez\Desktop\Mi Colegio\mi-colegio.front\src\App.tsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CourseSelectionPage from './components/CourseSelectionPage';
import CourseDetailsPage from './components/CourseDetailsPage';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from './auth/auth-config';
import { Button, Container } from 'react-bootstrap';
import LoginPage from './pages/LoginPage';
import SchoolSupplyListPage from './components/SchoolSupplyListPage';
import StudentGuardianListPage from './components/StudentGuardianListPage';

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
      postLogoutRedirectUri: window.location.origin, // vuelve al home
    });
  };


  return (
    <div className="App">
      <AuthenticatedTemplate>
        {activeAccount ? (
          <>
            <Button className="signOutButton" onClick={handleLogout} variant="primary">
              Sign out
            </Button>
            <Container>
              {/* Puedes mostrar datos del usuario aquí si quieres */}
              {/* <IdTokenData idTokenClaims={activeAccount.idTokenClaims} /> */}
              <Routes>
                <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
                {/* <Route path="/home" element={<MainLayout><HomePage /></MainLayout>} /> */}
                <Route path="/seleccionar-curso" element={<MainLayout><CourseSelectionPage /></MainLayout>} />
                <Route path="/curso-detalles" element={<MainLayout><CourseDetailsPage /></MainLayout>} />
                <Route
                  path="/utiles-escolares"
                  element={<MainLayout><SchoolSupplyListPage /></MainLayout>}
                />
                <Route
                  path="/alumnos-apoderados/:courseId"
                  // 🔹 CORRECCIÓN: Usar el nombre de componente corregido
                  element={<MainLayout><StudentGuardianListPage /></MainLayout>}
                />
              </Routes>
            </Container></>
        ) : null}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LoginPage onLogin={handleLoginRedirect} />
      </UnauthenticatedTemplate>
    </div>
  );
}

export default App;
