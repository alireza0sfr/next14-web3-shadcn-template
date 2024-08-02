import ImplementationException from '~/exceptions/ImplementationException'

export interface ObjectStoreConfig {
  name: string
  options?: IDBObjectStoreParameters
}

export interface DBConfig {
  dbName: string
  version: number
  objectStores: ObjectStoreConfig[]
}

export default class IndexedDB {
  private dbName: string
  private version: number
  private objectStores: ObjectStoreConfig[]
  private db: IDBDatabase | null = null;

  constructor(config: DBConfig) {
    this.dbName = config.dbName
    this.version = config.version
    this.objectStores = config.objectStores
    this.initializeDB()
  }

  private initializeDB(): void {
    const request = window.indexedDB.open(this.dbName, this.version)

    request.onerror = (event: Event) => {
      new ImplementationException('Failed to open IndexedDB', { event })
    }

    request.onsuccess = (event: Event) => {
      this.db = (event.target as IDBRequest).result as IDBDatabase
    }

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result
      this.objectStores.forEach(({ name, options }) => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, options)
        }
      })
    }
  }

  private transaction(storeName: string, mode: IDBTransactionMode): IDBTransaction {
    if (!this.db) {
      throw new Error('Database not initialized')
    }
    return this.db.transaction([storeName], mode)
  }

  public loadData<T>(storeName: string, key: IDBValidKey): Promise<T | null> {
    return new Promise((resolve, reject) => {
      const transaction = this.transaction(storeName, 'readonly')
      const objectStore = transaction.objectStore(storeName)
      const request = objectStore.get(key)

      request.onerror = (event: Event) => {
        new ImplementationException('Error fetching data from IndexedDB', { storeName, key, objectStore, transaction, request, event })
        reject((event.target as IDBRequest).error)
      }

      request.onsuccess = (event: Event) => {
        resolve((event.target as IDBRequest).result as T | null)
      }
    })
  }

  public saveData<T>(storeName: string, key: IDBValidKey, data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.transaction(storeName, 'readwrite')
      const objectStore = transaction.objectStore(storeName)
      const request = objectStore.put(data, key)

      request.onerror = (event: Event) => {
        new ImplementationException('Error saving data to IndexedDB', { storeName, key, objectStore, transaction, request, event })
        reject((event.target as IDBRequest).error)
      }

      request.onsuccess = () => {
        resolve()
      }
    })
  }

  public deleteData(storeName: string, key: IDBValidKey): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.transaction(storeName, 'readwrite')
      const objectStore = transaction.objectStore(storeName)
      const request = objectStore.delete(key)

      request.onerror = (event: Event) => {
        new ImplementationException('Error deleting data from IndexedDB', { storeName, key, objectStore, transaction, request, event })
        reject((event.target as IDBRequest).error)
      }

      request.onsuccess = () => {
        resolve()
      }
    })
  }

  public deleteDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.deleteDatabase(this.dbName)

      request.onerror = (event: Event) => {
        new ImplementationException('Error saving data to IndexedDB', { dbName: this.dbName, request, event })
        reject((event.target as IDBRequest).error)
      }

      request.onsuccess = () => {
        resolve()
      }
    })
  }
}

// Usage example:
// const dbConfig: DBConfig = {
//   dbName: 'chat_database',
//   version: 1,
//   objectStores: [{ name: 'attachments' }, { name: 'users' }]
// };