import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { AuthContainer } from "./auth_components/AuthContainer"
import { ProtectedRoute } from "./auth_components/ProtectedRoute"
import { Application } from "./structure_components/Application"
import '../public/variables.css'
import { Home } from "./views_container/Home"
import { setupApp } from "../utils/setupApp"
import { SpinnerLoading } from "./ui_components/SpinnerLoading"
import { ModalProvider } from "./providers/ModalContext"
import { GlobalTooltipProvider } from "./providers/GlobalTooltip"
import { useAuthController } from "../controllers/authController"


function App() {
    const [loading, setLoading] = useState(true)
    const {chackConfig} = useAuthController()
    const navigate = useNavigate()

    useEffect(() => {
        const ejecuteApp = async () => {
            await setupApp()
            setLoading(false)
        }
        ejecuteApp()

        if(chackConfig()) navigate('/app/inbox')

    }, [])

    if (loading) return <SpinnerLoading />

    return (
        <ModalProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth/*" element={
                    <AuthContainer></AuthContainer>
                }></Route>
                <Route element={<ProtectedRoute />}>
                    <Route path='/app/*'
                        element={<GlobalTooltipProvider>


                                <Application />


                        </GlobalTooltipProvider>

                        }
                    ></Route>
                </Route>
            </Routes>
        </ModalProvider>
    )
}

export { App }
