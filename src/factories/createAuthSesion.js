import { AppConfigManager } from "../manager/AppConfigManager"
import { APP_MODES } from "../manager/configs/appModes"
import { AuthOfflineStrategy } from "../strategies/auth/AuthOfflineStrategy"
import { AuthOnlineStrategy } from "../strategies/auth/AuthOnlineStrategy"

let authSessionInstance = null

function createAuthSesion(sesionType) {

    if (authSessionInstance) {
        return authSessionInstance
    }

    let sesion
    if (sesionType) {
        sesion = sesionType
    } else {
        const config = AppConfigManager.getConfig()
        sesion = config ? config.appMode : null
    }

    switch (sesion) {
        case APP_MODES.online_api.appMode:
            authSessionInstance = new AuthOnlineStrategy()
            break

        case APP_MODES.offline.appMode:
        default:
            authSessionInstance = new AuthOfflineStrategy()
            break
    }

    return authSessionInstance
}

export { createAuthSesion }
