import { IndexedDBManager } from "../manager/IndexedDBManager"

async function setupApp()  {
    const indexedDB = IndexedDBManager.getInstance()
    await indexedDB._init()
}

export {setupApp}
