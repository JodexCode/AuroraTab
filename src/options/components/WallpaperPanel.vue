<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { type WallpaperItem, settingsDB } from '../utils/indexedDB'
import { presets } from '../utils/presets'
import { useI18n } from '~/i18n'

const props = defineProps<{ direction: string }>()
const emit = defineEmits(['close', 'wallpaper-change'])

const { t } = useI18n()

const isOpen = ref(false)
const customWallpapers = ref<(WallpaperItem & { displayUrl: string })[]>([])

const panelStyle = computed(() => ({
  bottom: props.direction === 'left' ? '80px' : '20px',
}))

onMounted(async () => {
  isOpen.value = true
  await loadCustomWallpapers()
})

onUnmounted(() => {
  customWallpapers.value.forEach(wp => URL.revokeObjectURL(wp.displayUrl))
})

async function loadCustomWallpapers() {
  const items = await settingsDB.getAllWallpapers()
  customWallpapers.value.forEach(wp => URL.revokeObjectURL(wp.displayUrl))
  customWallpapers.value = items.map(item => ({
    ...item,
    displayUrl: URL.createObjectURL(item.data),
  }))
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    for (let i = 0; i < target.files.length; i++) {
      const file = target.files[i]
      const id = `custom-${Date.now()}-${i}`
      await settingsDB.addWallpaper({
        id,
        name: file.name,
        type: file.type,
        data: file,
      })
    }
    await loadCustomWallpapers()
    target.value = ''
  }
}

async function removeWallpaper(id: string) {
  await settingsDB.deleteWallpaper(id)
  await loadCustomWallpapers()
}

function selectPreset(preset: any) {
  emit('wallpaper-change', {
    type: 'preset',
    idOrUrl: preset.id,
    mimeType: preset.type,
  })
}

function selectCustom(wp: any) {
  emit('wallpaper-change', {
    type: 'custom',
    idOrUrl: wp.id,
    mimeType: wp.type,
    displayUrl: wp.displayUrl,
  })
}
</script>

<template>
  <transition name="slide-up">
    <div v-if="isOpen" class="panel-container" :style="panelStyle">
      <div class="panel-header">
        <h3>{{ t('wallpaper.title') }}</h3>
        <button class="close-btn" @click="emit('close')">
          ×
        </button>
      </div>

      <div class="panel-content scroll-container">
        <h4 class="section-title">
          {{ t('wallpaper.presets') }}
        </h4>
        <div class="wallpaper-grid">
          <div
            v-for="preset in presets"
            :key="preset.id"
            class="wp-item preset-item"
            :style="{ background: preset.css }"
            :title="preset.name"
            @click="selectPreset(preset)"
          />
        </div>

        <h4 class="section-title" style="margin-top: 20px">
          {{ t('wallpaper.custom') }}
        </h4>
        <div class="wallpaper-grid">
          <label class="wp-item upload-btn">
            <span class="plus-icon">+</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              hidden
              @change="handleFileUpload"
            >
          </label>

          <div
            v-for="wp in customWallpapers"
            :key="wp.id"
            class="wp-item"
            @click="selectCustom(wp)"
          >
            <img v-if="wp.type.startsWith('image')" :src="wp.displayUrl">
            <video
              v-else-if="wp.type.startsWith('video')"
              :src="wp.displayUrl"
              muted
              loop
              autoplay
            />
            <button class="delete-btn" @click.stop="removeWallpaper(wp.id)">
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* 原有样式保持不变 */
.panel-container {
  position: fixed;
  bottom: 20px;
  right: 80px;
  width: 340px;
  max-height: 80vh;
  background-color: rgba(40, 40, 40, 0.85);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}
.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}
.close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
}
.close-btn:hover {
  color: white;
}
.scroll-container {
  padding: 20px;
  overflow-y: auto;
}
.scroll-container::-webkit-scrollbar {
  width: 6px;
}
.scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.section-title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
  margin-top: 0;
  font-weight: normal;
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.wp-item {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.3);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.wp-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

/* --- 修改：确保预设项目没有背景色覆盖 --- */
.preset-item {
  background-size: cover;
}

.wp-item img,
.wp-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  background: transparent;
}
.upload-btn:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.05);
}
.plus-icon {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.5);
}

.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(255, 0, 0, 0.7);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  backdrop-filter: blur(4px);
}
.wp-item:hover .delete-btn {
  opacity: 1;
}
.delete-btn:hover {
  background-color: rgba(255, 0, 0, 0.9);
  transform: scale(1.1);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
