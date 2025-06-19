
import { AppConfigManager } from "../manager/AppConfigManager";
import { APP_MODES } from "../manager/configs/appModes";
import { ApiSectionRepository } from "../strategies/storage/ApiSectionRepository";
import { IndexedDBSectionRepository } from "../strategies/storage/indexedDB/IndexedDBSectionRepository";

function createSectionStorage() {
  const config = AppConfigManager.getConfig();
  const defaultMode = APP_MODES.offline.appMode;
  const appMode = config ? config.appMode : defaultMode;

  switch (appMode) {
    case APP_MODES.online_api.appMode:
      return new ApiSectionRepository();
    case APP_MODES.offline.appMode:
      return new IndexedDBSectionRepository();
    default:
      return new IndexedDBSectionRepository();
  }
}

export { createSectionStorage };
