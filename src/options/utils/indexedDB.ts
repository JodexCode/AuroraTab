const DB_NAME = 'AuroraTabDB'
const DB_VERSION = 1
const STORE_NAME = 'settings'

interface DBConfig {
  toolbarDirection: 'left' | 'up'
  searchBar: {
    width: { value: number, unit: 'px' | '%' }
    borderRadius: { value: number, unit: 'px' | '%' }
  }
  panels: {
    borderRadius: { value: number, unit: 'px' | '%' }
  }
}

const defaultConfig: DBConfig = {
  toolbarDirection: 'left',
  searchBar: {
    width: { value: 600, unit: 'px' },
    borderRadius: { value: 24, unit: 'px' },
  },
  panels: {
    borderRadius: { value: 20, unit: 'px' },
  },
}

class SettingsDB {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      }
    })
  }

  async getSettings(): Promise<DBConfig> {
    if (!this.db)
      await this.init()

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get('userSettings')

      request.onsuccess = () => {
        resolve(request.result || defaultConfig)
      }
      request.onerror = () => resolve(defaultConfig)
    })
  }

  async saveSettings(settings: DBConfig): Promise<void> {
    if (!this.db)
      await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(settings, 'userSettings')

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export const settingsDB = new SettingsDB()
export type { DBConfig }
