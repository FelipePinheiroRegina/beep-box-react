import { React } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import { Login } from "../pages/Login"

export function RoutesAuth() {
    const userName = localStorage.getItem("@patralbeep:userName")

    return (
        <Routes>
            <Route path="/" element={<Login />} />
        
            { !userName && <Route path="*" element={< Navigate to="/" />}/> }
        </Routes>
    );
}