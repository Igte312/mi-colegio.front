import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CourseSelectionPage from './components/CourseSelectionPage';
import CourseDetailsPage from './components/CourseDetailsPage';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { Button, Container } from 'react-bootstrap';
import { loginRequest } from './auth/auth-config';

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
                <Route path="/home" element={<MainLayout><HomePage /></MainLayout>} />
                <Route path="/seleccionar-curso" element={<MainLayout><CourseSelectionPage /></MainLayout>} />
                <Route path="/curso-detalles" element={<MainLayout><CourseDetailsPage /></MainLayout>} />
              </Routes>
            </Container></>
        ) : null}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Button className="signInButton" onClick={handleLoginRedirect} variant="primary">
            Sign up
          </Button>
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
}

export default App;