import { jwtDecode } from "jwt-decode";
import { AppConfigManager } from "../../manager/AppConfigManager";
import { APP_MODES } from "../../manager/configs/appModes";
import { apiService } from "../../apiService";
import { AuthSesionInterface } from "./AuthSesionInterface";

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

            const { token } = data
            AppConfigManager.setMode(APP_MODES.online_api.appMode, token)
        } catch (error) {
            AppConfigManager.clear()
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
/*         else{
            AppConfigManager.clear()
            return false
        } */
        return false
    }

    async isLogged() {//debo verificar que el usuario existe
        try {
            !this.validateSesion() ?? new Error()
            const data = await apiService.get('/api/v1/items');
            return [true, data]
        } catch (error) {
            return [false, null]
        }
    }

/*     getToken() {
        const config = AppConfigManager.getConfig()

        if(config){
            return config.jwt
        }
        return null
    }

    getAuthHeader() {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    } */
}

export { OnlineApiStrategy }
