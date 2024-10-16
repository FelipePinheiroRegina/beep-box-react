import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [data, setData] = useState('');

    async function Login(userName, password, isAutoLogin = false) {
        try {
            const response = await api.post(`/api/oauth2/v1/token?grant_type=password&password=${password}&username=${userName}`);

            const { access_token } = response.data;

            setData(userName);

            localStorage.setItem('@patralbeep:userName', userName);
            localStorage.setItem('@patralbeep:password', password);
            localStorage.setItem('@patralbeep:accessToken', access_token);

            if (!isAutoLogin) {
                // Set a timeout to re-login after 55 minutes (3300000 milliseconds)
                setTimeout(() => {
                    autoLogin();
                }, 3300000);
            }
        } catch (error) {
            if (error.response) {
                return alert(error.response.statusText);
            } else {
                return alert('Unable to log in');
            }
        }
    }

    async function logOut() {
        localStorage.removeItem('@patralbeep:userName');
        localStorage.removeItem('@patralbeep:password');
        localStorage.removeItem('@patralbeep:accessToken');

        setData('');
    }

    function autoLogin() {
        const userName = localStorage.getItem('@patralbeep:userName');
        const password = localStorage.getItem('@patralbeep:password');

        if (userName && password) {
            Login(userName, password, true);
        }
    }

    useEffect(() => {
        const userName = localStorage.getItem('@patralbeep:userName');
        const password = localStorage.getItem('@patralbeep:password');

        if (userName && password) {
            setData(userName);
            // Optionally trigger an initial auto-login
            autoLogin();
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                Login,
                logOut,
                userName: data
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth };
