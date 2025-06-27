import { jwtDecode } from "jwt-decode";
import { AppConfigManager } from "../../manager/AppConfigManager";
import { APP_MODES } from "../../manager/configs/appModes";

import { AuthSesionInterface } from "./AuthSesionInterface";
import { apiService } from "../../apiService";

class OnlineApiStrategy extends AuthSesionInterface {
    async signIn(userName, password, email) {
        try {
            const data = await apiService.post(
                '/api/v1/auth/sing-in/',
                {
                    username: userName,
                    password: password,
                    email: email
                })
            if (data.error || data.message) throw new Error(data);

            const { token } = data

            AppConfigManager.setMode(APP_MODES.online_api.appMode, token)

        } catch (error) {
            throw error
        }
    }
    async login(userName, password) {
        try {
            const data = await apiService.post(
                '/api/v1/auth/login',
                {
                    username: userName,
                    password: password
                })
                console.log('data',data)
            if(data.message) throw new Error(data.message)

            const { token } = data
            AppConfigManager.setMode(APP_MODES.online_api.appMode, token)

        } catch (error) {
            this.logout()
            throw error
        }
    }

    logout() {
        AppConfigManager.clear()
    }

    validateSesion() {
        const config = AppConfigManager.getConfig()
        if (config.appMode === APP_MODES.online_api.appMode &&
            config.storageType === APP_MODES.online_api.storageType &&
            config.jwt //jwt exists
        ) return true

        return false
    }

    async isLogged() {//debo verificar que el usuario existe
        try {
            !this.validateSesion() ?? new Error('No hay ninguna Sesion Activa')
            const data = await apiService.get('/api/v1/items');
            return [true, data]
        } catch (error) {
            return [false, null]
        }
    }
}

export { OnlineApiStrategy }
