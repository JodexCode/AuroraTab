<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { type WallpaperItem, settingsDB } from '../utils/indexedDB'

const emit = defineEmits(['close', 'wallpaper-change'])
const isOpen = ref(false)
const customWallpapers = ref<(WallpaperItem & { displayUrl: string })[]>([])

// --- 核心修改：定义五套高质量 CSS 渐变色预设 ---
// 我们使用自定义的 mimeType: 'image/css-gradient' 来标记
const presets = [
  {
    id: 'preset-deep-ocean',
    name: '深海流光',
    // 蓝绿交织，饱和度适中，像深海中的荧光
    css: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #2193b0 100%)',
    type: 'image/css-gradient',
  },
  {
    id: 'preset-forest-life',
    name: '森林呼吸',
    // 沉稳的苔藓绿到青蓝色，极度护眼
    css: 'linear-gradient(120deg, #134E5E 0%, #71B280 100%)',
    type: 'image/css-gradient',
  },
  {
    id: 'preset-mystic-purple',
    name: '幻紫幽邃',
    // 深紫、深蓝与暗红的交织，极具生命力且不刺眼
    css: 'radial-gradient(at 0% 0%, rgba(78, 84, 200, 0.6) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(143, 148, 251, 0.5) 0, transparent 50%), radial-gradient(at 50% 100%, rgba(35, 37, 38, 1) 0, transparent 80%), #2c3e50',
    type: 'image/css-gradient',
  },
  {
    id: 'preset-emerald-flow',
    name: '翡翠流转',
    // 渐变在对角线流动，色彩丰富但不杂乱
    css: 'linear-gradient(135deg, #004d40 0%, #00acc1 50%, #80deea 100%)',
    type: 'image/css-gradient',
  },
  {
    id: 'preset-sunset-vibe',
    name: '暮色弥漫',
    // 暖色调但压低了亮度，模拟日落后的余晖
    css: 'radial-gradient(at 80% 20%, rgba(255, 126, 95, 0.4) 0, transparent 50%), radial-gradient(at 20% 80%, rgba(254, 180, 123, 0.3) 0, transparent 50%), #3e5151',
    type: 'image/css-gradient',
  },
  {
    id: 'preset-deep-nebula',
    name: '深空星云',
    // 沉稳的暗蓝色底色，带有极光绿的边缘
    css: 'radial-gradient(circle at 10% 20%, rgba(0, 150, 136, 0.3) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(76, 175, 80, 0.2) 0%, transparent 40%), #121f1f',
    type: 'image/css-gradient',
  },
  {
    id: 'preset-modern-gray',
    name: '现代极简',
    // 并不是纯灰，而是带有一点蓝紫调的高级冷灰
    css: 'linear-gradient(135deg, #434343 0%, #243b55 100%)',
    type: 'image/css-gradient',
  },
]

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
    idOrUrl: preset.css, // 现在这里存的是 CSS 字符串
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
    <div v-if="isOpen" class="panel-container">
      <div class="panel-header">
        <h3>Wallpaper Settings</h3>
        <button class="close-btn" @click="emit('close')">
          ×
        </button>
      </div>

      <div class="panel-content scroll-container">
        <h4 class="section-title">
          Presets (Gradients)
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
          Custom (Images/Videos)
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
