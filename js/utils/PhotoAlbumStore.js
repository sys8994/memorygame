class PhotoAlbumStore {
    constructor() {
        this.dbName = 'memorygame-photo-album';
        this.storeName = 'photos';
        this.version = 1;
        this.dbPromise = null;
    }

    open() {
        if (this.dbPromise) {
            return this.dbPromise;
        }

        this.dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
                    store.createIndex('createdAt', 'createdAt');
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        return this.dbPromise;
    }

    async getAllPhotos() {
        const db = await this.open();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                const results = Array.isArray(request.result) ? request.result : [];
                results.sort((left, right) => left.createdAt - right.createdAt);
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async addPhotos(dataUrls) {
        if (!Array.isArray(dataUrls) || dataUrls.length === 0) {
            return;
        }

        const db = await this.open();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);

            dataUrls.forEach((dataUrl) => {
                store.put({
                    id: this.createId(),
                    dataUrl,
                    createdAt: Date.now() + Math.random()
                });
            });

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = () => reject(transaction.error);
        });
    }

    async deletePhoto(photoId) {
        const db = await this.open();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(photoId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    createId() {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }

        return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }
}

export const photoAlbumStore = new PhotoAlbumStore();
