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

    async addUser(user) {
        const db = this.db;
        const tx = db.transaction('users', 'readwrite');
        const store = tx.objectStore('users');
        user.created_at = new Date();
        user.updated_at = new Date();
        store.add(user);

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(user);
            tx.onerror = (event) => reject(event.target.error);
        });
    }

    async addItem(item) {
        const db = this.db;
        const tx = db.transaction('items', 'readwrite');
        const store = tx.objectStore('items');
        item.created_at = new Date();
        item.updated_at = new Date();
        store.add(item);
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(item);
            tx.onerror = (event) => reject(event.target.error);
        });
    }

    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async update(storeName, id, updatedFields) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const getRequest = store.get(id);
            getRequest.onsuccess = () => {
                const record = getRequest.result;
                if (!record) {
                    reject(new Error('Record not found'));
                    return;
                }
                const updated = { ...record, ...updatedFields, updated_at: new Date().toISOString() };
                const updateRequest = store.put(updated);
                updateRequest.onsuccess = () => resolve(updated);
                updateRequest.onerror = () => reject(updateRequest.error);
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async getItems(userId) {
        const db = await this.db;

        try {
            const folders = await this._getItemsByType(userId, itemTypesIDS.folder, null);
            const sections = await this._getItemsByType(userId, itemTypesIDS.section);
            const todos = await this._getItemsByType(userId, itemTypesIDS.todo, null);
            const subTodos = await this._getItemsByType(userId, itemTypesIDS.todo, specialTypesIDS.subTodo);
            const inbox = await this._getItemBySpecialType(userId, specialTypesIDS.inbox);
            const specialProjects = await this._getSpecialProjects(userId);
            const unsections = await this._getItemsBySpecialType(userId, specialTypesIDS.unsectioned);
            const colors = await this._getColors();

            return {
                folders,
                sections,
                todos,
                subTodos,
                specialProjects,
                inbox,
                unsections,
                colors
            };

        } catch (error) {
            console.error("Error fetching items:", error);
            throw error;
        }
    }

    // Helper method to get items by type (folder, section, etc.)
    async _getItemsByType(userId, typeId, specialTypeId = null) {
        const db = await this.db;
        const tx = db.transaction('items', 'readonly');
        const store = tx.objectStore('items');
        const index = store.index('type_id');

        return new Promise((resolve, reject) => {
            const items = [];
            const request = index.openCursor(IDBKeyRange.only(typeId));

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.user_id === userId && (specialTypeId === null || cursor.value.special_type_id === specialTypeId)) {
                        items.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    resolve(items);
                }
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    // Helper method to get items by special type
    async _getItemsBySpecialType(userId, specialTypeId) {
        const db = await this.db;
        const tx = db.transaction('items', 'readonly');
        const store = tx.objectStore('items');
        const index = store.index('special_type_id');

        return new Promise((resolve, reject) => {
            const items = [];
            const request = index.openCursor(IDBKeyRange.only(specialTypeId));

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.user_id === userId) {
                        items.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    resolve(items);
                }
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    // Helper method to get a single item by special type
    async _getItemBySpecialType(userId, specialTypeId) {
        const db = await this.db;
        const tx = db.transaction('items', 'readonly');
        const store = tx.objectStore('items');

        return new Promise((resolve, reject) => {
            const request = store.index('special_type_id').get(specialTypeId);

            request.onsuccess = (event) => {
                const result = event.target.result;
                if (result && result.user_id === userId) {
                    resolve(result);
                } else {
                    resolve(null);
                }
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    // Helper method to get special projects (folders with special types)
    async _getSpecialProjects(userId) {
        const db = await this.db;
        const tx = db.transaction('items', 'readonly');
        const store = tx.objectStore('items');
        const index = store.index('type_id');

        return new Promise((resolve, reject) => {
            const specialProjects = [];
            const request = index.openCursor(IDBKeyRange.only(itemTypesIDS.folder));

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.user_id === userId && specialTypesIDS[cursor.value.special_type_id]) {
                        specialProjects.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    resolve(specialProjects);
                }
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    // Helper method to get all colors
    async _getColors() {
        const db = await this.db;
        const tx = db.transaction('colors', 'readonly');
        const store = tx.objectStore('colors');

        return new Promise((resolve, reject) => {
            const colors = [];
            const request = store.openCursor();

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    colors.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(colors);
                }
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
}

export { IndexedDBManager }
