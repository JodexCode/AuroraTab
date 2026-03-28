<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import '~/styles/panel-transition.css'
import '~/styles/panel.css'
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
  <transition name="panel">
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
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
}

</style>
