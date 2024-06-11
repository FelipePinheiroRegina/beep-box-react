import { Routes, Route, Navigate } from "react-router-dom"

import { Transports } from "../pages/Transports"
import { TableTransport } from "../pages/TableTransport"
import { TableBoxesAlreadyBeep } from "../pages/TableBoxesAlreadyBeep"

export function RoutesApp() {
    return (
        <Routes>
            <Route path="/" element={<Transports/>}/>
            <Route path="/tableTransport" element={<TableTransport/>}/>
            <Route path="/TableBoxesAlreadyBeep" element={<TableBoxesAlreadyBeep/>}/>

            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    )
}