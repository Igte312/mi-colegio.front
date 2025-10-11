import { EventType, PublicClientApplication, type AuthenticationResult } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig, loginRequest } from "../auth-config";
import Cookies from "js-cookie";

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const msalInstance = new PublicClientApplication(msalConfig);

    // Set active account si ya existe
    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
        msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }

    // Evento: login exitoso
    msalInstance.addEventCallback(async (event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
            const authResult = event.payload as AuthenticationResult;
            const account = authResult.account;
            if (!account) return;

            msalInstance.setActiveAccount(account);

            try {
                const tokenResponse = await msalInstance.acquireTokenSilent({
                    ...loginRequest,
                    account,
                });

                const token = tokenResponse.accessToken;
                console.log("Token obtenido:", token);
                Cookies.set("azure_token", token, {
                    secure: false,
                    sameSite: "Strict",
                    expires: 1, // 1 día
                });

                console.log("Token guardado en cookie:", token);
            } catch (error) {
                console.error("Error obteniendo token:", error);
            }
        }
    });

    return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

export function useAuthProvider() {
    return { AuthProvider };
}
