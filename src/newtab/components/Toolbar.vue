<script setup lang="ts">
import { type CSSProperties, computed, ref } from 'vue'
import { useI18n } from '~/i18n'

const props = defineProps<{ direction: string }>()
const emit = defineEmits(['open-appearance', 'open-settings', 'open-language', 'open-wallpaper'])

const { t } = useI18n()
const isToolbarOpen = ref(false)

const toolbarStyle = computed(
  (): CSSProperties => ({
    flexDirection: props.direction === 'up' ? 'column' : 'row',
  }),
)

const actionsStyle = computed(
  (): CSSProperties => ({
    flexDirection: props.direction === 'up' ? 'column' : 'row',
  }),
)

function toggleToolbar() {
  isToolbarOpen.value = !isToolbarOpen.value
}
</script>

<template>
  <div class="toolbar-container" :style="toolbarStyle">
    <transition :name="direction === 'up' ? 'slide-up' : 'slide-side'">
      <div v-if="isToolbarOpen" class="toolbar-actions" :style="actionsStyle">
        <button
          class="action-button"
          :title="t('toolbar.appearance')"
          @click="emit('open-appearance')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a.996.996 0 0 0-1.41 0L9 12.25 11.75 15l8.96-8.96a.996.996 0 0 0 0-1.41z"
            />
          </svg>
        </button>
        <button class="action-button" :title="t('toolbar.language')" @click="emit('open-language')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
            />
          </svg>
        </button>
        <button class="action-button" :title="t('toolbar.settings')" @click="emit('open-settings')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6l6 6l1.4-1.4zm5.2 0l4.6-4.6l-4.6-4.6L16 6l6 6l-6 6l-1.4-1.4z"
            />
          </svg>
        </button>
        <button
          class="action-button"
          :title="t('toolbar.wallpaper')"
          @click="emit('open-wallpaper')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
            />
          </svg>
        </button>
      </div>
    </transition>
    <button class="toolbar-button" :class="{ active: isToolbarOpen }" @click="toggleToolbar">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.toolbar-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  mix-blend-mode: difference;
}

.toolbar-button {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  width: 48px;
  height: 48px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
}

.toolbar-button:hover,
.toolbar-button.active {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.toolbar-actions {
  display: flex;
  gap: 8px;
  padding: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  backdrop-filter: blur(20px);
}

.action-button {
  background-color: transparent;
  border: none;
  border-radius: 50%;
  color: white;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.slide-side-enter-active,
.slide-side-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-side-enter-from,
.slide-side-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.9);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.toolbar-button svg,
.action-button svg {
  color: white;
  filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.2));
  transition: all 0.3s ease;
}
</style>
