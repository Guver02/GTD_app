import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthContainer } from "./auth_components/AuthContainer"
import { ProtectedRoute } from "./auth_components/ProtectedRoute"
import { Application } from "./structure_components/Application"
import '../public/variables.css'
import { Home } from "./views_container/Home"
import { setupApp } from "../utils/setupApp"
import { SpinnerLoading } from "./ui_components/SpinnerLoading"


function App() {
const [loading, setLoading] = useState(true)

    useEffect(() => {
        const ejecuteApp = async () => {
            await setupApp()
            setLoading(false)
        }
        ejecuteApp()
    }, [])

    if (loading) return <SpinnerLoading/>

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/auth/*" element={
                    <AuthContainer></AuthContainer>
                }></Route>
                <Route element={<ProtectedRoute />}>
                    <Route path='/app/*'
                        element={
                            <Application />
                        }
                    ></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export { App }
