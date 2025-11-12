// src/components/auth/SignOutButton.tsx

import React from 'react';
import { useMsal } from '@azure/msal-react';
import { Button } from 'react-bootstrap';
// Importa cualquier otro componente de estilo que uses (ej. FontAwesome para un ícono)

const SignOutButton: React.FC = () => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    
    // 1. Lógica del Logout Aislada: Implementación más robusta
    const handleLogout = () => {
        // Usa logoutRedirect para una redirección que asegura la limpieza de la sesión en Azure AD.
        instance.logoutRedirect({
            // Mejor práctica: Indicar explícitamente qué cuenta desloguear.
            account: activeAccount || undefined, 
            // La URI debe estar registrada en el Portal de Azure AD.
            postLogoutRedirectUri: window.location.origin, 
        });
    };

    // 2. Control de renderizado simple:
    // Si no hay cuenta activa, este botón no debería renderizarse,
    // pero como lo vas a usar dentro de AuthenticatedTemplate, es solo una capa extra de seguridad.
    if (!activeAccount) {
        return null;
    }

    return (
        <Button 
            variant="danger" 
            onClick={handleLogout}
            // Agrega tu clase si usas Tailwind u otro CSS
            className="ms-3" 
        >
            {/* Opcional: Mostrar el nombre del usuario para confirmar la sesión */}
            Cerrar Sesión ({activeAccount.username}) 
        </Button>
    );
};

export default SignOutButton;