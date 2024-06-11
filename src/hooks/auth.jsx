import { createContext, useContext } from "react"

export const AuthContext = createContext({})

import { useState, useEffect } from "react"
import { api } from "../services/api"

function AuthProvider({children}) {
    const [ data, setData ] = useState({})

    async function Login(userName, password) {
        try {
            const response = await api.post(`/api/oauth2/v1/token?grant_type=password&password=${password}&username=${userName}`)

            const { access_token } = response.data

            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

            setData({userName, access_token})

            localStorage.setItem('@patralbeep:userName', userName)
            localStorage.setItem('@patralbeep:password', password)
            localStorage.setItem('@patralbeep:access_token', access_token)
        } catch (error) {
            if(error.response) {
                return alert(error.response.statusText)
            } else {
                return alert('Unable to log')
            }
        }
    }

    async function logOut() {
        localStorage.removeItem('@patralbeep:userName')
        localStorage.removeItem('@patralbeep:password')
        localStorage.removeItem('@patralbeep:access_token')
        
        setData({})
    }

    useEffect(() => {
        async function persistentLogin(userName, password) {
            const response = await api.post(`/api/oauth2/v1/token?grant_type=password&password=${password}&username=${userName}`)

            const { access_token } = response.data

            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

            localStorage.setItem('@patralbeep:access_token', access_token)

            setData({userName, access_token})
        }

        const userName = localStorage.getItem('@patralbeep:userName')
        const password = localStorage.getItem('@patralbeep:password')

        if(userName && password) {
            setData({userName})
            persistentLogin(userName, password) 
        }
    }, [])

    return (
        <AuthContext.Provider 
            value={{
                Login,
                logOut,
                userName: data.userName
            }}>

            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext)

    return context
}

export { AuthProvider, useAuth }