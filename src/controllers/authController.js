import { useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { checkSessionUseCase, getDataUseCase, loginUseCase, logoutUseCase, signupUseCase } from '../services/authServices';
import { AppConfigManager } from './manager/AppConfigManager';
import { unknownError } from '../utils/errorFunctions';
import { createAuthSesion } from './factories/createAuthSesion';

const useAuthController = (appMode) => {

    const navigate = useNavigate()
    const authRepo = createAuthSesion(appMode)

    const loginController = useCallback(async ({ userName, password }) => {
        try {
            await loginUseCase(
                { userName, password },
                authRepo,
                AppConfigManager,
                appMode,
            )

        } catch (err) {
            unknownError(err)
        }
    }, []);


    const singupController = useCallback(async ({ email, password, name }) => {
        try {
            signupUseCase(
                { email, password, name },
                authRepo,
                AppConfigManager,
                appMode)

        } catch (err) {
            unknownError(err)
        }
    }, []);


    const logoutController = useCallback(async (id) => {
        logoutUseCase(AppConfigManager)
        navigate('/auth/login')
    }, []);

    const checkSessionController = async () => {
        const sesion = checkSessionUseCase(AppConfigManager)
        if (!sesion) return [false, null]

        const data = await getDataUseCase(authRepo, sesion.token)
        return [true, data]
    }

    return {
        logIn: loginController,
        signUp: singupController,
        logout: logoutController,
        checkSession: checkSessionController
    };
};

export { useAuthController };
