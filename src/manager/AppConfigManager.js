import { APP_MODES } from './configs/appModes';

export class AppConfigManager {
    static setMode(modeKey, token) {
        const config = APP_MODES[modeKey]

        if (!config) {
            throw new Error(`[AppConfig] Modo inválido: ${modeKey}`)
        }

        const finalConfig = {
            ...config,
            jwt: token || config.jwt,
        };

        console.log('configFilnal', finalConfig)

        localStorage.setItem('appConfig', JSON.stringify(finalConfig))
    }

    static getConfig() {
        try {
            const config = JSON.parse(localStorage.getItem('appConfig'))
            if (!config || !config.appMode || !config.storageType) {
                throw new Error('Configuración incompleta')
            }
            return config
        } catch {
            return null
        }
    }

    static setJWT(token) {
        try {
            const config = this.getConfig()
            config.jwt = token;

            localStorage.setItem('appConfig', JSON.stringify(config))

        } catch {
            throw new Error('Error al insertar')
        }
    }

    static clear() {
        localStorage.removeItem('appConfig')
    }

    static getToken() {
        const config = this.getConfig()

        if(config){
            return config.jwt
        }
        return null
    }
}
