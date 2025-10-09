import {LogLevel} from '@azure/msal-browser';

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
    scopes: ["user.read"],
};