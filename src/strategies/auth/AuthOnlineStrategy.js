import { apiService } from "../../controllers/apiService";
import {AuthSessionInterface} from "./interfaces/AuthSesionInterface"
import { BadRequestError, InternalServerError, InvalidCredentialsError } from "../../errors/AuthCustomErrors";

class AuthOnlineStrategy extends AuthSessionInterface{
    async signIn(userName, password, email) {
        try {
            const data = await apiService.post(
                '/api/v1/auth/sing-in/', {
                username: userName,
                password: password,
                email: email
            })

            if (data.error || data.message) throw new BadRequestError(data)
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

            if(data.status === 401) throw new InvalidCredentialsError(data)

            if (data.status >= 400 && data.status < 500) throw new BadRequestError(data)

            if(data.status >= 500)throw new InternalServerError(data)

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

            const data = await apiService.get(
                '/api/v1/items',
                {
                    Authorization: `Bearer ${token}`})


            if(data.status === 401) throw new InvalidCredentialsError(data)

            if (data.status >= 400 && data.status < 500) throw new BadRequestError(data)

            if(data.status >= 500)throw new InternalServerError(data)

            return data
        } catch (error) {
            throw error
        }
    }

}

export { AuthOnlineStrategy }
