import { jwtDecode } from "jwt-decode";
import { AppConfigManager } from "../../manager/AppConfigManager";
import { APP_MODES } from "../../manager/configs/appModes";
import { apiService } from "../../apiService";

class OnlineApiStrategy extends authSesionInterface {
    static async signIn(userName, password, email) {
        try {
            const data = apiService.post(
                '/api/v1/auth/sing-in/',
                {
                    username: userName,
                    password: password,
                    email: email
                })
            const { token } = data
            AppConfigManager.setMode(APP_MODES.online_api, token)

        } catch (error) {
            throw error
        }
    }
    static async login(userName, password) {
        try {
            const data = await apiService.post(
                '/api/v1/auth/login',
                {
                    username: userName,
                    password: password
                })

            const { token } = data
            AppConfigManager.setMode(APP_MODES.online_api, token)
        } catch (error) {
            throw error
        }
    }

    static logout() {
        AppConfigManager.clear()
    }

    static validateSesion() {
        const config = AppConfigManager.getConfig()
        if (config.appMode === APP_MODES.online_api.appMode &&
            config.storageType === APP_MODES.online_api.storageType &&
            config.jwt //jwt exists
        ) return true

        return false
    }

    static async isLogged() {//debo verificar que el usuario existe
        if (this.validateSesion()) return [false, null]

        try {
            const data = await apiService.get('/api/v1/items');
            return [true, data]
        } catch (error) {
            return [false, null]
        }
    }
}

export { OnlineApiStrategy }
