
import { AppConfigManager } from "../manager/AppConfigManager"
import { APP_MODES } from "../manager/configs/appModes"
;
import { OfflineStrategy } from "../strategies/auth/OfflineAuthStrategy"
import { OnlineApiStrategy } from "../strategies/auth/OnlineApiStrategy"


function createAuthSesion (sesionType) {

    let sesion
    if (sesionType){
        sesion = sesionType
    }else{
        const config = AppConfigManager.getConfig()
        sesion = config ? config.appMode : null
    }


    switch (sesion) {
        case APP_MODES.online_api.appMode:
            return new OnlineApiStrategy()
            break;

        case APP_MODES.offline.appMode:
            return new OfflineStrategy()
            break;

        default:
            return new OfflineStrategy()
            break;
    }

}

export {createAuthSesion}
