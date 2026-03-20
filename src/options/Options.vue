<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import SearchBar from './components/SearchBar.vue'
import Toolbar from './components/Toolbar.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import WallpaperPanel from './components/WallpaperPanel.vue'
import { type DBConfig, settingsDB } from './utils/indexedDB'

const showSettings = ref(false)
const showWallpaper = ref(false)
const isLoading = ref(true)

const wallpaperUrl = ref('')
const wallpaperType = ref('')

// 用于记录当前生成的 Blob URL，以便在切换时释放内存，防止卡顿
let currentBlobUrl = ''

// 更新默认配置，加入 wallpaper 字段
const defaultSettings: DBConfig = {
  toolbarDirection: 'left',
  searchBar: {
    width: { value: 600, unit: 'px' },
    borderRadius: { value: 24, unit: 'px' },
  },
  panels: {
    borderRadius: { value: 20, unit: 'px' },
  },
  wallpaper: {
    type: 'preset',
    idOrUrl: '',
    mimeType: '',
  },
}

const settings = ref<DBConfig>({ ...defaultSettings })

// 计算样式[cite: 14]
const style = computed(() => ({
  '--search-bar-width': `${settings.value.searchBar.width.value}${settings.value.searchBar.width.unit}`,
  '--search-bar-border-radius': `${settings.value.searchBar.borderRadius.value}${settings.value.searchBar.borderRadius.unit}`,
  '--panel-border-radius': `${settings.value.panels.borderRadius.value}${settings.value.panels.borderRadius.unit}`,
}))

// 应用壁纸的核心逻辑：负责区分预设还是自定义，并从 IndexedDB 提取二进制数据
async function applyWallpaperSettings(wpConfig: DBConfig['wallpaper']) {
  if (!wpConfig || !wpConfig.idOrUrl)
    return

  // 核心优化：如果之前有自定义壁纸的 Blob URL，释放掉它，防止内存泄漏
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl)
    currentBlobUrl = ''
  }

  wallpaperType.value = wpConfig.mimeType

  if (wpConfig.type === 'preset') {
    wallpaperUrl.value = wpConfig.idOrUrl
  }
  else if (wpConfig.type === 'custom') {
    // 根据 ID 从 IndexedDB 提取实际的文件 (Blob)
    const wpItem = await settingsDB.getWallpaper(wpConfig.idOrUrl)
    if (wpItem) {
      currentBlobUrl = URL.createObjectURL(wpItem.data)
      wallpaperUrl.value = currentBlobUrl
    }
    else {
      // 找不到文件时的降级处理
      wallpaperUrl.value = ''
    }
  }
}

// 初始化：从 IndexedDB 加载设置并恢复壁纸[cite: 14]
onMounted(async () => {
  try {
    const savedSettings = await settingsDB.getSettings()
    // 合并配置，防止旧用户的数据库里缺少 wallpaper 字段导致报错
    settings.value = { ...defaultSettings, ...savedSettings }

    // 初始化时加载壁纸
    await applyWallpaperSettings(settings.value.wallpaper)
  }
  catch (error) {
    console.error('Failed to load settings:', error)
  }
  finally {
    isLoading.value = false
  }
})

// 监听设置变化并保存到 IndexedDB（防抖优化，避免频繁写入）
watchDebounced(
  settings,
  async (newSettings) => {
    try {
      const rawSettings = JSON.parse(JSON.stringify(newSettings))
      await settingsDB.saveSettings(rawSettings)
    }
    catch (error) {
      console.error('Failed to save settings:', error)
    }
  },
  { deep: true, debounce: 300 },
)

// 接收来自 WallpaperPanel 的更新事件
function handleWallpaperChange(payload: any) {
  // 1. 立即更新 UI 进行预览
  if (payload.type === 'preset') {
    wallpaperUrl.value = payload.idOrUrl
  }
  else {
    // 对于自定义类型，面板组件已经传来了临时预览图 displayUrl
    wallpaperUrl.value = payload.displayUrl
  }
  wallpaperType.value = payload.mimeType

  // 2. 更新配置对象，触发上面的 watch 自动将设置保存到 IndexedDB
  settings.value.wallpaper = {
    type: payload.type,
    idOrUrl: payload.idOrUrl,
    mimeType: payload.mimeType,
  }

  // 考虑到用户可能想预览多个壁纸，这里不再强制把 showWallpaper.value 置为 false
  // 如果你需要点击应用后马上关闭面板，可以取消下面这行的注释：
  // showWallpaper.value = false
}
</script>

<template>
  <div class="aurora-tab-container" :style="style">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner" />
    </div>

    <div
      class="wallpaper-container"
      :style="
        wallpaperType === 'image/css-gradient'
          ? { background: wallpaperUrl }
          : {}
      "
    >
      <img
        v-if="
          wallpaperUrl
            && wallpaperType.startsWith('image')
            && wallpaperType !== 'image/css-gradient'
        "
        :src="wallpaperUrl"
        class="wallpaper"
      >
      <video
        v-if="wallpaperUrl && wallpaperType.startsWith('video')"
        :src="wallpaperUrl"
        class="wallpaper"
        autoplay
        loop
        muted
      />
    </div>

    <main
      class="main-content"
      :class="{ blurred: showSettings || showWallpaper }"
    >
      <div class="search-wrapper">
        <SearchBar />
      </div>
    </main>

    <footer class="footer-toolbar">
      <Toolbar
        :direction="settings.toolbarDirection"
        @open-settings="showSettings = true"
        @open-wallpaper="showWallpaper = true"
      />
    </footer>

    <SettingsPanel
      v-if="showSettings"
      v-model:settings="settings"
      @close="showSettings = false"
    />
    <WallpaperPanel
      v-if="showWallpaper"
      @close="showWallpaper = false"
      @wallpaper-change="handleWallpaperChange"
    />
  </div>
</template>

<style scoped>
.aurora-tab-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(26, 26, 26, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.wallpaper-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: #1a1a1a;
  overflow: hidden;
}

.wallpaper {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  transition: filter 0.3s ease;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* 给文字添加微弱阴影 */
}

.main-content.blurred {
  filter: blur(10px) brightness(0.8);
}

.search-wrapper {
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: center;
}

.footer-toolbar {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  filter: drop-shadow(0 0 15px rgba(0, 0, 0, 0.8));
}
</style>
