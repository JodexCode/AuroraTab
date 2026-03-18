<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
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

// 默认配置
const defaultSettings: DBConfig = {
  toolbarDirection: 'left',
  searchBar: {
    width: { value: 600, unit: 'px' },
    borderRadius: { value: 24, unit: 'px' },
  },
  panels: {
    borderRadius: { value: 20, unit: 'px' },
  },
}

const settings = ref<DBConfig>({ ...defaultSettings })

// 计算样式
const style = computed(() => ({
  '--search-bar-width': `${settings.value.searchBar.width.value}${settings.value.searchBar.width.unit}`,
  '--search-bar-border-radius': `${settings.value.searchBar.borderRadius.value}${settings.value.searchBar.borderRadius.unit}`,
  '--panel-border-radius': `${settings.value.panels.borderRadius.value}${settings.value.panels.borderRadius.unit}`,
}))

// 初始化：从 IndexedDB 加载设置
onMounted(async () => {
  try {
    const savedSettings = await settingsDB.getSettings()
    settings.value = savedSettings
  }
  catch (error) {
    console.error('Failed to load settings:', error)
  }
  finally {
    isLoading.value = false
  }
})

// 监听设置变化并保存到 IndexedDB
watch(
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
  { deep: true },
)

function handleWallpaperChange(url: string, type: string) {
  wallpaperUrl.value = url
  wallpaperType.value = type
  showWallpaper.value = false
}
</script>

<template>
  <div class="aurora-tab-container" :style="style">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner" />
    </div>

    <div class="wallpaper-container">
      <img
        v-if="wallpaperType.startsWith('image')"
        :src="wallpaperUrl"
        class="wallpaper"
      >
      <video
        v-if="wallpaperType.startsWith('video')"
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
  /* Placeholder for wallpaper */
  background: linear-gradient(135deg, #2b5876, #4e4376);
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
}
</style>
