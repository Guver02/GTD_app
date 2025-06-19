import { AppConfigManager } from "../manager/AppConfigManager";
import { APP_MODES } from "../manager/configs/appModes";
import { ApiProjectRepository } from "../strategies/storage/ApiProjectRepository";
import { IndexedDBProjectRepository } from "../strategies/storage/indexedDB/IndexedDBProjectRepository";

function createProjectStorage() {
  const config = AppConfigManager.getConfig();
  const defaultMode = APP_MODES.offline.appMode;
  const appMode = config ? config.appMode : defaultMode;

  switch (appMode) {
    case APP_MODES.online_api.appMode:
      return new ApiProjectRepository();
    case APP_MODES.offline.appMode:
      return new IndexedDBProjectRepository();
    default:
      return new ApiProjectRepository();
  }
}

export { createProjectStorage };
