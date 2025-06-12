import { IndexedDBManager } from "../services/manager/IndexedDBManager"

async function setupApp()  {
    console.log('setupo')
    const indexedDB = IndexedDBManager.getInstance()

    await indexedDB._init()

    console.log(indexedDB)
}

export {setupApp}
