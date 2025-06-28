
import { AppConfigManager } from "../manager/AppConfigManager";
import { APP_MODES } from "../manager/configs/appModes";
import { ApiSectionRepository } from "../strategies/storage/apiStorage/ApiSectionRepository";
import { IndexedDBSectionRepository } from "../strategies/storage/indexedDB/IndexedDBSectionRepository";

let _sectionStorage = null;

function createSectionStorage() {
  if (_sectionStorage) return _sectionStorage;

  const config = AppConfigManager.getConfig();
  const defaultMode = APP_MODES.offline.appMode;
  const appMode = config ? config.appMode : defaultMode;

  switch (appMode) {
    case APP_MODES.online_api.appMode:
      _sectionStorage = new ApiSectionRepository();
      break;
    case APP_MODES.offline.appMode:
    default:
      _sectionStorage = new IndexedDBSectionRepository();
      break;
  }

  return _sectionStorage;
}

export {createSectionStorage}

