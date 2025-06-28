import { useCallback } from 'react';
import { checkSessionUseCase, getDataUseCase, loginUseCase, logoutUseCase, signupUseCase } from '../services/authServices';
import { AppConfigManager } from './manager/AppConfigManager';
import { unknownError } from '../utils/errorFunctions';
import { createAuthSesion } from './factories/createAuthSesion';

const useAuthController = (appModeParam) => {

    let appMode;

    if(!appModeParam){
            const config = AppConfigManager.getConfig()
            appMode = config ? config.appMode : null
    }else{
        appMode = appModeParam
    }

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


    const logoutController = useCallback(async () => {
        logoutUseCase(AppConfigManager)

    }, []);

    const checkSessionAndGetDataController = async () => {
        const sesion = checkSessionUseCase(AppConfigManager, appMode)
        console.log('sesion',sesion)
        if (!sesion) return [false, null]

        const data = await getDataUseCase(authRepo, sesion.token)
        return [true, data]
    }

    const checkConfigController = () => {
        const sesion = checkSessionUseCase(AppConfigManager, appMode)
        if (!sesion) return false

        return true
    }

    return {
        logIn: loginController,
        signUp: singupController,
        logout: logoutController,
        checkSessionAndGetData: checkSessionAndGetDataController,
        chackConfig: checkConfigController
    };
};

export { useAuthController };
