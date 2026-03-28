const DB_NAME = 'AuroraTabDB'
const DB_VERSION = 3 // 升级版本号，触发 onupgradeneeded
const STORE_NAME = 'settings'
const WALLPAPER_STORE = 'wallpapers' // 新增壁纸仓库

import type { EngineName } from './searchEngines'

// 新增壁纸数据类型
export interface WallpaperItem {
  id: string
  name: string
  type: string // MIME 类型，如 'image/png', 'video/mp4'
  data: File | Blob // 核心：直接存二进制对象防卡顿
}

export interface DBConfig {
  toolbarDirection: 'left' | 'up'
  language: 'en' | 'zh'
  searchEngine: EngineName
  searchBar: {
    width: { value: number, unit: 'px' | '%' }
    borderRadius: { value: number, unit: 'px' | '%' }
  }
  panels: {
    borderRadius: { value: number, unit: 'px' | '%' }
  }
  // 新增：记录当前选用的壁纸状态
  wallpaper: {
    type: 'preset' | 'custom'
    idOrUrl: string
    mimeType: string
  }
}

const defaultConfig: DBConfig = {
  toolbarDirection: 'left',
  language: 'en',
  searchEngine: 'Bing',
  searchBar: {
    width: { value: 600, unit: 'px' },
    borderRadius: { value: 24, unit: 'px' },
  },
  panels: {
    borderRadius: { value: 20, unit: 'px' },
  },
  // 默认壁纸配置
  wallpaper: {
    type: 'preset',
    idOrUrl: '', // 空字符串可以代表使用默认 CSS 背景
    mimeType: '',
  },
}

class SettingsDB {
  private db: IDBDatabase | null = null
  private initPromise: Promise<void> | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      // 数据库升级逻辑[cite: 13]
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        // 创建设置仓库[cite: 13]
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
        // 创建壁纸仓库，使用 id 作为主键
        if (!db.objectStoreNames.contains(WALLPAPER_STORE)) {
          db.createObjectStore(WALLPAPER_STORE, { keyPath: 'id' })
        }
      }
    })
  }

  // 统一的初始化检查，避免重复初始化
  private async ensureInit(): Promise<IDBDatabase> {
    if (this.db)
      return this.db
    if (!this.initPromise) {
      this.initPromise = this.init()
    }
    await this.initPromise
    return this.db!
  }

  // --- Settings 方法 ---[cite: 13]
  async getSettings(): Promise<DBConfig> {
    await this.ensureInit()

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get('userSettings')

      request.onsuccess = () => resolve(request.result || defaultConfig)
      request.onerror = () => resolve(defaultConfig)
    })
  }

  async saveSettings(settings: DBConfig): Promise<void> {
    await this.ensureInit()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(settings, 'userSettings')

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // --- Wallpaper 方法 ---
  async getAllWallpapers(): Promise<WallpaperItem[]> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([WALLPAPER_STORE], 'readonly')
      const request = transaction.objectStore(WALLPAPER_STORE).getAll()
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async getWallpaper(id: string): Promise<WallpaperItem | undefined> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([WALLPAPER_STORE], 'readonly')
      const request = transaction.objectStore(WALLPAPER_STORE).get(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async addWallpaper(wallpaper: WallpaperItem): Promise<void> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([WALLPAPER_STORE], 'readwrite')
      const request = transaction.objectStore(WALLPAPER_STORE).put(wallpaper)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async deleteWallpaper(id: string): Promise<void> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([WALLPAPER_STORE], 'readwrite')
      const request = transaction.objectStore(WALLPAPER_STORE).delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export const settingsDB = new SettingsDB()
