import { jwtDecode } from "jwt-decode";
import { AppConfigManager } from "../../manager/AppConfigManager";
import { APP_MODES } from "../../manager/configs/appModes";
import { getUUID } from "../../../utils/generateUUID";

class OfflineStrategy extends authSesionInterface {
    static signIn(userName, password, email) {
        const token = this.#generateSymbolicJwt(userName, email);
        AppConfigManager.setMode(APP_MODES.offline, token);
        this.#savePassword(password)
    }
    static async login(userName, password) {
        const token = AppConfigManager.getConfig().jwt
        const decoded = jwtDecode(token)

        if(decoded.username !== userName ||
            !(await this.#validatePassword(password))
        ) throw new Error('Invalid Credentials')
    }

    static logout() {
        AppConfigManager.clear()
        this.#clearPassword()
    }

    static validateSesion () {
        const config = AppConfigManager.getConfig()
        if(config.appMode === APP_MODES.offline.appMode &&
            config.storageType === APP_MODES.offline.storageType &&
            config.jwt && //jwt exists
            localStorage.getItem('password')
        ) return true

        return false
    }

    static isLogged () {
        const token = AppConfigManager.getConfig().jwt
        const decoded = jwtDecode(token)

        if(decoded.username &&
            decoded.email &&
            decoded.userId &&
            localStorage.getItem('password')
        ) return true

        return false
    }

    static async #savePassword(password) {
      const hashed = await this.#hashPassword(password)
      localStorage.setItem('password', hashed)
    }

    static #clearPassword(){
        localStorage.removeItem('password')
    }

    static async #hashPassword(password) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
    }

    static async #validatePassword(password) {
      const hashed = await this.#hashPassword(password)
      const stored = localStorage.getItem('password')

      if (hashed === stored) return true
      return false
    }


    static #generateSymbolicJwt(userName, email) {
        const header = {
            "alg": "HS256",
            "typ": "JWT"
        };

        const payload = {
            "userId": getUUID(),
            "username": userName,
            "email": email,
        };

        const encodedHeader = btoa(JSON.stringify(header)).replace(/\=/g, '');
        const encodedPayload = btoa(JSON.stringify(payload)).replace(/\=/g, '');
        const symbolicSignature = btoa('this-is-a-symbolic-signature-for-offline-mode').replace(/\=/g, '');
        return `${encodedHeader}.${encodedPayload}.${symbolicSignature}`;
    }


}

export {OfflineStrategy}
