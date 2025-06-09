import { APP_MODES } from "../manager/configs/appModes"
import { OnlineApiStrategy } from "../strategyes/auth/OnlineApiStrategy"

function createAuthSesion (type) {
    if(type == APP_MODES.online_api.key){
        return new OnlineApiStrategy()
    }
    return new OnlineApiStrategy()
}

export {createAuthSesion}
