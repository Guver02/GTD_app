import { AppConfigManager } from "../manager/AppConfigManager"
import { APP_MODES } from "../manager/configs/appModes"
import { ApiTaskRepository } from "../strategies/storage/ApiTaskRepository"
import { IndexedDBTaskRepository } from "../strategies/storage/indexedDB/IndexedDBTaskRepository";

function createTaskStorage() {
    const config = AppConfigManager.getConfig();
    const defaultMode = APP_MODES.offline.appMode;
    const appMode = config ? config.appMode : defaultMode;

    switch (appMode) {
        case APP_MODES.online_api.appMode:
            return new ApiTaskRepository();
        case APP_MODES.offline.appMode:
            return new IndexedDBTaskRepository();
        default:
            return new IndexedDBTaskRepository();
    }

}

export { createTaskStorage }
