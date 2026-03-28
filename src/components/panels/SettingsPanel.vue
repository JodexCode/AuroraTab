<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { DBConfig } from '~/utils/indexedDB'
import { useI18n } from '~/i18n'

const props = withDefaults(defineProps<{ settings: DBConfig, direction: string }>(), {})
const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const isOpen = ref(false)

const panelStyle = computed(() => ({
  bottom: props.direction === 'left' ? '80px' : '20px',
}))

onMounted(() => {
  isOpen.value = true
})
</script>

<template>
  <transition name="slide-up">
    <div v-if="isOpen" class="panel-container" :style="panelStyle">
      <div class="panel-header">
        <h3>{{ t('settings.title') }}</h3>
        <button class="close-btn" @click="emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
            />
          </svg>
        </button>
      </div>
      <div class="panel-content">
        <div class="empty-state">
          <p>{{ t('settings.title') }}</p>
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
  width: 340px;
  background-color: rgba(40, 40, 40, 0.8);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
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

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
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
