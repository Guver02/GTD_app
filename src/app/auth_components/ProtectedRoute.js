import React, { useState, useEffect, useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useDataStore } from '../../store/data_store'
import { createAuthSesion } from '../../factories/createAuthSesion'
import { SpinnerLoading } from '../ui_components/SpinnerLoading'
import { useAuthController } from '../../controllers/authController'
import { InvalidCredentialsError } from '../../errors/AuthCustomErrors'
import { InfrastructureError } from '../../errors/LayerErrors'
import { UnknowError } from '../../errors/UnknowError'
import { ErrorBanner } from '../ui_components/ErrorBanner'
import { ModalContext } from '../providers/ModalContext'

function ProtectedRoute() {
    const setItems = useDataStore(state => state.setItems)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const authSession = useAuthController()
    const { openModal, closeModal } = useContext(ModalContext)

    const showErrors = (error) => {
        if (error instanceof InvalidCredentialsError)
            openModal(<ErrorBanner
                principalMesssage={error.message}
                onClose={closeModal} />);

        if (error instanceof InfrastructureError)
            openModal(<ErrorBanner
                principalMesssage={error.message}
                onClose={closeModal} />);

        if (error instanceof UnknowError)
            openModal(<ErrorBanner
                principalMesssage={error.message}
                secondaryMessage={'Error Desconcido'}
                onClose={closeModal} />);
    }

    useEffect(() => {
        async function setupAppAndValidate() {

            //console.log('Protected')
            const [isLoged, data] = await authSession.checkSessionAndGetData(showErrors)
            //console.log('Protected: ', isLoged, data)
            if (!isLoged) {
                setIsLoading(false)
                setIsAuthenticated(false)
            }
            if (isLoged) {
                setItems(data)
                setIsAuthenticated(true)
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
