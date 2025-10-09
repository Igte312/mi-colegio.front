import {LogLevel} from '@azure/msal-browser';

// ------------------------------------------------------------------
// 🎯 PASO 1: Define tus Recursos Protegidos (Tu Backend API)
// ------------------------------------------------------------------
export const protectedResources = {
    apiSchool: {
        // Esta debería ser la base URL de tu API
        endpoint: "http://localhost:8080/api/v1", 
        // 🔑 CLAVE: Reemplaza este valor por el Scope (API URI) que registraste 
        // para tu API en Azure AD. Generalmente tiene el formato: 
        // api://<Client ID de tu API>/<Scope Name>
        scopes: ["api://53983332-a360-4368-b4fe-4c940e517341/access_as_user"], 
    },
};



export const msalConfig = {
    auth: {
        clientId: '53983332-a360-4368-b4fe-4c940e517341', 
        authority: 'https://login.microsoftonline.com/28610735-5d7e-4a84-94af-10533012ed60/', 
        redirectUri: '/',
        postLogoutRedirectUri: '/', 
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false, 
    },
    system: {
        loggerOptions: {
            loggerCallback: (level: any, message: any, containsPii: any) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

export const loginRequest = {
    // 🎯 PASO 2: Incluir el scope de tu API junto con el scope por defecto
    scopes: ["user.read", protectedResources.apiSchool.scopes[0]],
};