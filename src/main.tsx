import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import "./styles/index.css";
import App from './App.tsx';
import './styles/index.css';
import { useAuthProvider } from './auth/hooks/auth-provider.tsx';

const { AuthProvider } = useAuthProvider();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>

            <AuthProvider>
                <App />
            </AuthProvider>

        </BrowserRouter>
    </StrictMode>
)
