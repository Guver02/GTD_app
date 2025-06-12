class UsersIndexedDBServices {
    // Recibe el IndexedDBManager completo, no solo la DB
    constructor(indexedDBManager) {
        this.dbManager = indexedDBManager;
    }

    async getByUserAndPassword(username, password) {
        const db = await this.dbManager.db; // <--- Ahora 'db' es una promesa, y la 'await' es crucial
        const hash = await this.#hashPassword(password);

        return new Promise((resolve, reject) => {
            const tx = db.transaction('users', 'readonly');
            const store = tx.objectStore('users');
            const index = store.index('username');
            const request = index.get(username);

            request.onsuccess = () => {
                const user = request.result;
                if (!user || user.password !== hash) {
                    resolve(null);
                } else {
                    resolve(user);
                }
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async getByUser(username) {
        const db = await this.dbManager.db; // <--- ¡Importante!
        return new Promise((resolve, reject) => {
            const tx = db.transaction('users', 'readonly');
            const store = tx.objectStore('users');
            const index = store.index('username');
            const request = index.get(username);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async getById(id) {
        const db = await this.dbManager.db; // <--- ¡Importante!
        return new Promise((resolve, reject) => {
            const tx = db.transaction('users', 'readonly');
            const store = tx.objectStore('users');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = (event) => reject(request.error);
        });
    }

    async create(user) {
        // Primero, esperamos a que la DB esté lista antes de hacer cualquier cosa.
        const db = await this.dbManager.db; // <--- ¡Importante!

        const existingUser = await this.getByUser(user.username); // Esta llamada también espera la DB
        if (existingUser) {
            throw new Error('User already exists');
        }

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

    async #hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

}

export { UsersIndexedDBServices }
