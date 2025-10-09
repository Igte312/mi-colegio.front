import { useMsal } from '@azure/msal-react';
import { protectedResources } from '../auth/auth-config'; // Asegúrate de importar la config correcta

// Hook personalizado para obtener el token de acceso
export const useAccessToken = () => {
    const { instance, accounts } = useMsal();
    const account = accounts[0]; // Usamos la primera cuenta logueada

    // Esta función maneja la solicitud silenciosa del token
    const getAccessToken = async (): Promise<string> => {
        if (!account) {
            throw new Error("No hay una cuenta activa para solicitar el token.");
        }

        const request = {
            scopes: protectedResources.apiSchool.scopes,
            account: account,
            // Aquí podrías agregar más lógica de manejo de errores o de pop-up si falla el silencio
        };

        try {
            const response = await instance.acquireTokenSilent(request);
            // El token es el que necesitamos en el encabezado
            return response.accessToken;
        } catch (error) {
            // Si la adquisición silenciosa falla (ej. token expirado), podrías intentar un login pop-up o redirect aquí.
            console.error("Fallo al obtener el token de acceso de forma silenciosa.", error);
            throw new Error("Se requiere reautenticación para acceder al recurso.");
        }
    };

    return { getAccessToken };
};