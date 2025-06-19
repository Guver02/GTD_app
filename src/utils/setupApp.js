import { IndexedDBManager } from "../controllers/manager/IndexedDBManager"

async function setupApp()  {
    const indexedDB = IndexedDBManager.getInstance()
    await indexedDB._init()
}

export {setupApp}
