import { ApplicationError, InfrastructureError } from "../../errors/CustomErrors";
import { apiService } from "../../controllers/apiService";
import {AuthSessionInterface} from "./interfaces/AuthSesionInterface"

class AuthOnlineStrategy extends AuthSessionInterface{
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

            if(data.status === 401) throw new ApplicationError(data.message, {type: 'unauthorized'})

            if (data.status >= 400 && data.status < 500) throw new ApplicationError(data.message, {type: 'badRequest'})

            if(data.status >= 500)throw new InfrastructureError(data.message,{})


            return data

        } catch (error) {
            if (error instanceof ApplicationError) throw error;
            if (error instanceof InfrastructureError) throw error;
            throw new InfrastructureError(error,{})
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
