<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import SearchBar from './components/SearchBar.vue'
import Toolbar from './components/Toolbar.vue'
import AppearancePanel from '~/components/panels/AppearancePanel.vue'
import SettingsPanel from '~/components/panels/SettingsPanel.vue'
import LanguagePanel from '~/components/panels/LanguagePanel.vue'
import WallpaperPanel from '~/components/panels/WallpaperPanel.vue'
import { type DBConfig, settingsDB } from '~/utils/indexedDB'
import { presets } from '~/utils/presets'
import { type Locale, getDeviceLocale, useI18n } from '~/i18n'

const { setLocale } = useI18n()

const showAppearance = ref(false)
const showSettings = ref(false)
const showLanguage = ref(false)
const showWallpaper = ref(false)
const isLoading = ref(true)

const panelMap: Record<string, Ref<boolean>> = {
  appearance: showAppearance,
  settings: showSettings,
  language: showLanguage,
  wallpaper: showWallpaper,
}

function openPanel(panel: keyof typeof panelMap) {
  if (!(panel in panelMap))
    return
  Object.values(panelMap).forEach(p => p.value = false)
  panelMap[panel].value = true
}

const wallpaperUrl = ref('')
const wallpaperType = ref('')

let currentBlobUrl = ''

const defaultSettings: DBConfig = {
  toolbarDirection: 'left',
  language: getDeviceLocale(),
  searchBar: {
    width: { value: 600, unit: 'px' },
    borderRadius: { value: 24, unit: 'px' },
  },
  panels: {
    borderRadius: { value: 20, unit: 'px' },
  },
  wallpaper: {
    type: 'preset',
    idOrUrl: presets[0].id,
    mimeType: presets[0].type,
  },
}

const settings = ref<DBConfig>({ ...defaultSettings })

const style = computed(() => ({
  '--search-bar-width': `${settings.value.searchBar.width.value}${settings.value.searchBar.width.unit}`,
  '--search-bar-border-radius': `${settings.value.searchBar.borderRadius.value}${settings.value.searchBar.borderRadius.unit}`,
  '--panel-border-radius': `${settings.value.panels.borderRadius.value}${settings.value.panels.borderRadius.unit}`,
}))

async function applyWallpaperSettings(wpConfig: DBConfig['wallpaper']) {
  if (!wpConfig)
    return

  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl)
    currentBlobUrl = ''
  }

  wallpaperType.value = wpConfig.mimeType

  if (wpConfig.type === 'preset') {
    const preset = presets.find(p => p.id === wpConfig.idOrUrl)
    wallpaperUrl.value = preset?.css || presets[0].css
  }
  else if (wpConfig.type === 'custom') {
    const wpItem = await settingsDB.getWallpaper(wpConfig.idOrUrl)
    if (wpItem) {
      currentBlobUrl = URL.createObjectURL(wpItem.data)
      wallpaperUrl.value = currentBlobUrl
    }
    else {
      wallpaperUrl.value = ''
    }
  }
}

watch(
  () => settings.value.language,
  (newLang) => {
    setLocale(newLang as Locale)
  },
)

onMounted(async () => {
  try {
    const savedSettings = await settingsDB.getSettings()

    if (!savedSettings?.wallpaper?.idOrUrl) {
      settings.value = { ...defaultSettings }
    }
    else {
      settings.value = { ...defaultSettings, ...savedSettings }
    }

    setLocale(settings.value.language as Locale)

    await applyWallpaperSettings(settings.value.wallpaper)
  }
  catch (error) {
    console.error('Failed to load settings:', error)
  }
  finally {
    isLoading.value = false
  }
})

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

function handleWallpaperChange(payload: any) {
  if (payload.type === 'preset') {
    const preset = presets.find(p => p.id === payload.idOrUrl)
    wallpaperUrl.value = preset?.css || presets[0].css
  }
  else {
    wallpaperUrl.value = payload.displayUrl
  }
  wallpaperType.value = payload.mimeType

  settings.value.wallpaper = {
    type: payload.type,
    idOrUrl: payload.idOrUrl,
    mimeType: payload.mimeType,
  }
}

const isAnyPanelOpen = computed(
  () => showAppearance.value || showSettings.value || showLanguage.value || showWallpaper.value,
)
</script>

<template>
  <div class="aurora-tab-container" :style="style">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner" />
    </div>

    <div
      class="wallpaper-container"
      :style="wallpaperType === 'image/css-gradient' ? { background: wallpaperUrl } : {}"
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

    <main class="main-content" :class="{ blurred: isAnyPanelOpen }">
      <div class="search-wrapper">
        <SearchBar />
      </div>
    </main>

    <footer class="footer-toolbar">
      <Toolbar
        :direction="settings.toolbarDirection"
        @open-appearance="openPanel('appearance')"
        @open-settings="openPanel('settings')"
        @open-language="openPanel('language')"
        @open-wallpaper="openPanel('wallpaper')"
      />
    </footer>

    <AppearancePanel
      v-if="showAppearance"
      v-model:settings="settings"
      :direction="settings.toolbarDirection"
      @close="showAppearance = false"
    />
    <SettingsPanel v-if="showSettings" :settings="settings" :direction="settings.toolbarDirection" @close="showSettings = false" />
    <LanguagePanel v-if="showLanguage" v-model:settings="settings" :direction="settings.toolbarDirection" @close="showLanguage = false" />
    <WallpaperPanel
      v-if="showWallpaper"
      :direction="settings.toolbarDirection"
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
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
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
