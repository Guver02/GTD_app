import React, { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useDataStore } from '../../store/data_store'
import { createAuthSesion } from '../../factories/createAuthSesion'
import { SpinnerLoading } from '../ui_components/SpinnerLoading'
import { useAuthController } from '../../controllers/authController'

function ProtectedRoute() {
    const setItems = useDataStore(state => state.setItems)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const authSession = useAuthController()


    useEffect(() => {
        async function setupAppAndValidate() {
            try {
                console.log('Protected')
                /* const authSesion = createAuthSesion()
                const [isLoged, data] = await authSesion.isLogged() */
                const [isLoged, data] = await authSession.checkSessionAndGetData()
                console.log('Protected: ', isLoged, data)
                if (isLoged) {
                    setItems(data)
                }
                setIsAuthenticated(isLoged)
            } catch (error) {
                console.error('Error before ProtectedRoute', error)
                setIsAuthenticated(false)

            } finally {
                setIsLoading(false)
            }
        }

        setupAppAndValidate()
    }, [setItems])

    if (isLoading) {
        return <SpinnerLoading />
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" />
    }

    return <Outlet />
}

export { ProtectedRoute }
