<script setup lang="ts">
import { type CSSProperties, computed, ref } from 'vue'

const props = defineProps<{ direction: string }>()
const emit = defineEmits(['open-settings', 'open-wallpaper'])

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
          title="Settings"
          @click="emit('open-settings')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 20.8q-2.9 0-4.95-2.05T5 13.8q0-2.9 2.05-4.95T12 6.8q2.9 0 4.95 2.05T19 13.8q0 2.9-2.05 4.95T12 20.8m0-2q2.1 0 3.55-1.45T17 13.8q0-2.1-1.45-3.55T12 8.8q-2.1 0-3.55 1.45T7 13.8q0 2.1 1.45 3.55T12 18.8m0-2.5q-.95 0-1.625-.675T9.7 14.2q0-.95.675-1.625T12 11.9q.95 0 1.625.675T14.3 14.2q0 .95-.675 1.625T12 16.3"
            />
          </svg>
        </button>
        <button
          class="action-button"
          title="Change Wallpaper"
          @click="emit('open-wallpaper')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-2-2h10V9.675l-3.6 3.6L8 11.5l-3 3z"
            />
          </svg>
        </button>
      </div>
    </transition>
    <button
      class="toolbar-button"
      :class="{ active: isToolbarOpen }"
      @click="toggleToolbar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 16.5q.65 0 1.075-.425T13.5 15q0-.65-.425-1.075T12 13.5q-.65 0-1.075.425T10.5 15q0 .65.425 1.075T12 16.5m0-5q.65 0 1.075-.425T13.5 10q0-.65-.425-1.075T12 8.5q-.65 0-1.075.425T10.5 10q0 .65.425 1.075T12 11.5m0-5q.65 0 1.075-.425T13.5 5q0-.65-.425-1.075T12 3.5q-.65 0-1.075.425T10.5 5q0 .65.425 1.075T12 6.5M4 21V3h16v18z"
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
