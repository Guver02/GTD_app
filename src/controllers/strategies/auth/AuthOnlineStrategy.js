import { jwtDecode } from "jwt-decode";
import { AppConfigManager } from "../../manager/AppConfigManager";
import { APP_MODES } from "../../manager/configs/appModes";

import { AuthSesionInterface } from "./AuthSesionInterface";
import { apiService } from "../../apiService";

class AuthOnlineStrategy {
    async signIn(userName, password, email) {
        try {
            const data = await apiService.post(
                '/api/v1/auth/sing-in/', {
                username: userName,
                password: password,
                email: email
            })

            if (data.error || data.message) throw new Error(data);
            return data

        } catch (error) {
            throw error
        }
    }

    async login(userName, password) {
        try {
            const data = await apiService.post(
                '/api/v1/auth/login',{
                    username: userName,
                    password: password
                })

            if (data.message) throw new Error(data.message)
            return data

        } catch (error) {
            throw error
        }
    }

    async getData(token){
        try {
            const res = await fetch('/api/v1/items', {
            method: 'GET',
            headers: {
                 Authorization: `Bearer ${token}`
            }})

            const data = res.json()

            return data
        } catch (error) {
            throw error
        }
    }

}

export { AuthOnlineStrategy }
