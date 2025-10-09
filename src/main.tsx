import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Router } from 'react-router-dom';
import "./styles/index.css";
import App from './App.tsx';
import './styles/index.css';
import { AuthProvider } from './auth/hooks/auth-provider.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>

            <AuthProvider>
                <App />
            </AuthProvider>

        </BrowserRouter>
    </StrictMode>
)
