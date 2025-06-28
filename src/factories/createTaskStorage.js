import { AppConfigManager } from "../manager/AppConfigManager";
import { APP_MODES } from "../manager/configs/appModes";
import { ApiTaskRepository } from "../strategies/storage/ApiTaskRepository";
import { IndexedDBTaskRepository } from "../strategies/storage/indexedDB/IndexedDBTaskRepository";

let taskStorageInstance = null;

function createTaskStorage() {
  if (taskStorageInstance) return taskStorageInstance;

  const config = AppConfigManager.getConfig();
  const defaultMode = APP_MODES.offline.appMode;
  const appMode = config ? config.appMode : defaultMode;

  switch (appMode) {
    case APP_MODES.online_api.appMode:
      taskStorageInstance = new ApiTaskRepository();
      break;
    case APP_MODES.offline.appMode:
    default:
      taskStorageInstance = new IndexedDBTaskRepository();
      break;
  }

  return taskStorageInstance;
}

export { createTaskStorage };
