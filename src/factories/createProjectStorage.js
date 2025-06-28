import { AppConfigManager } from "../manager/AppConfigManager";
import { APP_MODES } from "../manager/configs/appModes";
import { ApiProjectRepository } from "../strategies/storage/ApiProjectRepository";
import { IndexedDBProjectRepository } from "../strategies/storage/indexedDB/IndexedDBProjectRepository";

let projectStorageInstance = null;

function createProjectStorage() {
  if (projectStorageInstance) return projectStorageInstance;

  const config = AppConfigManager.getConfig();
  const defaultMode = APP_MODES.offline.appMode;
  const appMode = config ? config.appMode : defaultMode;

  switch (appMode) {
    case APP_MODES.online_api.appMode:
      projectStorageInstance = new ApiProjectRepository();
      break;
    case APP_MODES.offline.appMode:
      projectStorageInstance = new IndexedDBProjectRepository();
      break;
    default:
      projectStorageInstance = new ApiProjectRepository();
      break;
  }

  return projectStorageInstance;
}

export { createProjectStorage };
