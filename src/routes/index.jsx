import { BrowserRouter } from "react-router-dom"

import { RoutesApp } from "./routes.app"
import { RoutesAuth } from "./routes.auth"
import { useAuth } from "../hooks/auth"

export function Routes() {
    const { userName } = useAuth()

    return (
        <BrowserRouter>
            { userName ? <RoutesApp/> : <RoutesAuth/> }
        </BrowserRouter>
    )
}