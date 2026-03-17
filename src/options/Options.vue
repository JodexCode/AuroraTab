<script setup lang="ts">
import { computed, ref } from 'vue'
import SearchBar from './components/SearchBar.vue'
import Toolbar from './components/Toolbar.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import WallpaperPanel from './components/WallpaperPanel.vue'

const showSettings = ref(false)
const showWallpaper = ref(false)

const wallpaperUrl = ref('')
const wallpaperType = ref('')

const settings = ref({
  toolbarDirection: 'left',
  searchBar: {
    width: { value: 600, unit: 'px' },
    borderRadius: { value: 24, unit: 'px' },
  },
  panels: {
    borderRadius: { value: 20, unit: 'px' },
  },
})

const style = computed(() => ({
  '--search-bar-width': `${settings.value.searchBar.width.value}${settings.value.searchBar.width.unit}`,
  '--search-bar-border-radius': `${settings.value.searchBar.borderRadius.value}${settings.value.searchBar.borderRadius.unit}`,
  '--panel-border-radius': `${settings.value.panels.borderRadius.value}${settings.value.panels.borderRadius.unit}`,
}))

function handleWallpaperChange(url: string, type: string) {
  wallpaperUrl.value = url
  wallpaperType.value = type
  showWallpaper.value = false
}
</script>

<template>
  <div class="aurora-tab-container" :style="style">
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
