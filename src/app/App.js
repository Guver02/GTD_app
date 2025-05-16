import React from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {AuthContainer} from "./auth_components/AuthContainer"
import { ProtectedRoute } from "./auth_components/ProtectedRoute"
import { Sidebar } from "./ui_components/Sidebar"
import { Application } from "./structure_components/Application"
import '../public/variables.css'


function App() {




    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/auth/*" element={
                    <AuthContainer></AuthContainer>
                }></Route>
                <Route element = {<ProtectedRoute/>}>
                    <Route path='/app/*'
                        element = {
                            <Application/>
                        }
                    ></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export {App}
