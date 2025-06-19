import React, { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useDataStore } from '../../store/data_store'
import { createAuthSesion } from '../../controllers/factories/createAuthSesion'
import { SpinnerLoading } from '../ui_components/SpinnerLoading'

function ProtectedRoute() {
    const setItems = useDataStore(state => state.setItems)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)


    useEffect(() => {
        async function setupAppAndValidate() {
            try {
                console.log('Protected')
                const authSesion = createAuthSesion()
                const [isLoged, data] = await authSesion.isLogged()
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
