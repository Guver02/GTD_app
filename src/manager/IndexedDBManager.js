const itemTypesIDS = {
    todo: 1,
    section: 2,
    folder: 3
}

const specialTypesIDS = {
    subTodo: 1,
    unsectioned: 2,
    inbox: 3,
    someday: 4,
    trackingFile: 5,
    waiting: 6,
    referenceFile: 7,
};

class IndexedDBManager {
    static instance = null;

    constructor(dbName = 'MyDatabase', dbVersion = 1) {
        this.dbName = dbName;
        this.dbVersion = dbVersion;
        this.db = null;
    }

    static getInstance() {
        if (!IndexedDBManager.instance) {
            IndexedDBManager.instance = new IndexedDBManager();
        }
        return IndexedDBManager.instance;
    }

    async _init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains('users')) {
                    const usersStore = db.createObjectStore('users', { keyPath: 'id' });
                    usersStore.createIndex('username', 'username', { unique: true });
                    usersStore.createIndex('email', 'email', { unique: true });
                    usersStore.createIndex('password', 'password', { unique: true });
                    usersStore.createIndex('created_at', 'created_at');
                    usersStore.createIndex('updated_at', 'updated_at');
                }

                if (!db.objectStoreNames.contains('colors')) {
                    const colorsStore = db.createObjectStore('colors', { keyPath: 'id', autoIncrement: true });
                    colorsStore.createIndex('color', 'color', { unique: false });
                }

                if (!db.objectStoreNames.contains('item_types')) {
                    const itemTypesStore = db.createObjectStore('item_types', { keyPath: 'id', autoIncrement: true });
                    itemTypesStore.createIndex('name', 'name', { unique: true });
                }

                if (!db.objectStoreNames.contains('special_types')) {
                    const specialTypesStore = db.createObjectStore('special_types', { keyPath: 'id', autoIncrement: true });
                    specialTypesStore.createIndex('name', 'name', { unique: true });
                }

                if (!db.objectStoreNames.contains('items')) {
                    const itemsStore = db.createObjectStore('items', { keyPath: 'id' });
                    itemsStore.createIndex('item_name', 'item_name', { unique: false });
                    itemsStore.createIndex('description', 'description', { unique: false });
                    itemsStore.createIndex('order', 'order', { unique: false });
                    itemsStore.createIndex('is_favorite', 'is_favorite', { unique: false });
                    itemsStore.createIndex('status', 'status', { unique: false });
                    itemsStore.createIndex('activation_date', 'activation_date', { unique: false });
                    itemsStore.createIndex('user_id', 'user_id', { unique: false });
                    itemsStore.createIndex('parent_id', 'parent_id', { unique: false });
                    itemsStore.createIndex('type_id', 'type_id', { unique: false });
                    itemsStore.createIndex('special_type_id', 'special_type_id', { unique: false });
                    itemsStore.createIndex('color_id', 'color_id', { unique: false });
                    itemsStore.createIndex('is_next', 'color_id', { unique: false });
                    itemsStore.createIndex('created_at', 'created_at');
                    itemsStore.createIndex('updated_at', 'updated_at');

                    itemsStore.createIndex("user_id_type_id_parent_id", ["user_id", "type_id", "parent_id"], { unique: false });


                    itemsStore.createIndex("user_id_parent_id", ["user_id", "parent_id"], { unique: false });
                }

                request.transaction.oncomplete = async () => {
                    await this.#insertDefaults(db).then(resolve).catch(reject);
                };
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async #insertDefaults(db) {
        const insertIfEmpty = async (storeName, data) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const countRequest = store.count();
            await new Promise((resolve, reject) => {
                countRequest.onsuccess = () => resolve(countRequest.result);
                countRequest.onerror = () => reject(countRequest.error);
            }).then(async (count) => {
                if (count === 0) {
                    for (const item of data) {
                        store.add(item);
                    }
                }
            });
        };

        await insertIfEmpty('colors', [
            { color: '0,0,0' }, { color: "255,0,0" }, { color: "0,255,0" }, { color: "0,0,255" },
            { color: "255,255,0" }, { color: "255,0,255" }, { color: "0,255,255" }, { color: "128,0,0" },
        ]);

        await insertIfEmpty('item_types', [
            { name: 'todo' }, { name: 'section' }, { name: 'folder' }
        ]);

        await insertIfEmpty('special_types', [
            { name: 'sub-todo' }, { name: 'unsectioned' }, { name: 'inbox' },
            { name: 'someday' }, { name: 'tracking-file' }, { name: 'waiting' }, { name: 'reference-file' }
        ]);
    }


}

export { IndexedDBManager }
