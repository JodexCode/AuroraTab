<script setup lang="ts">
import { onMounted, ref } from 'vue'

const emit = defineEmits(['close', 'wallpaper-change'])
const isOpen = ref(false)

onMounted(() => {
  isOpen.value = true
})

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        emit('wallpaper-change', e.target.result as string, file.type)
      }
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <transition name="slide-up">
    <div v-if="isOpen" class="panel-container">
      <div class="panel-header">
        <h3>Wallpaper</h3>
        <button class="close-btn" @click="emit('close')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
            />
          </svg>
        </button>
      </div>
      <div class="panel-content">
        <div class="wallpaper-options">
          <label class="upload-area" for="wallpaper-upload">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16h-2ZM6 20q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20H6Z"
              />
            </svg>
            <span>Upload Image or Video</span>
            <p class="hint">Supports JPG, PNG, MP4, WebM</p>
            <input
              id="wallpaper-upload"
              type="file"
              accept="image/*,video/*"
              hidden
              @change="handleFileUpload"
            >
          </label>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.panel-container {
  position: fixed;
  bottom: 20px;
  right: 80px;
  width: 320px;
  background-color: rgba(40, 40, 40, 0.8);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--panel-border-radius, 20px);
  color: white;
  z-index: 1000;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
  padding: 4px;
  border-radius: 50%;
  display: flex;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.panel-content {
  padding: 20px;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 20px;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: #4facfe;
}

.upload-area span {
  font-size: 14px;
  font-weight: 500;
}

.upload-area .hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
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
