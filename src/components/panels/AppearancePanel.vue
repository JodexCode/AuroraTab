<script setup lang="ts">
import '~/styles/panel-transition.css'

import { computed, onMounted, ref, watch } from 'vue'
import type { DBConfig } from '~/utils/indexedDB'
import { useI18n } from '~/i18n'
import NumberInput from '~/components/NumberInput.vue'

const props = defineProps<{ settings: DBConfig, direction: string }>()
const emit = defineEmits<{
  'close': []
  'update:settings': [value: DBConfig]
}>()

const { t } = useI18n()

const isOpen = ref(false)
const localSettings = ref<DBConfig>(JSON.parse(JSON.stringify(props.settings)))

const panelStyle = computed(() => ({
  '--panel-border-radius': `${localSettings.value.panels.borderRadius.value}${localSettings.value.panels.borderRadius.unit}`,
  'bottom': props.direction === 'left' ? '80px' : '20px',
}))

watch(
  localSettings,
  (newValue) => {
    emit('update:settings', newValue)
  },
  { deep: true },
)

function updateSetting(keyPath: string, value: any) {
  const keys = keyPath.split('.')
  let current: any = localSettings.value
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]]
  }
  current[keys[keys.length - 1]] = value
}

onMounted(() => {
  isOpen.value = true
})
</script>

<template>
  <transition name="panel">
    <div v-if="isOpen" class="panel-container" :style="panelStyle">
      <div class="panel-header">
        <h3>{{ t('appearance.title') }}</h3>
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
        <div class="setting-item">
          <div class="setting-label">
            <span>{{ t('appearance.toolbarDirection') }}</span>
          </div>
          <div class="segmented-control">
            <button
              :class="{ active: localSettings.toolbarDirection === 'left' }"
              @click="updateSetting('toolbarDirection', 'left')"
            >
              {{ t('appearance.left') }}
            </button>
            <button
              :class="{ active: localSettings.toolbarDirection === 'up' }"
              @click="updateSetting('toolbarDirection', 'up')"
            >
              {{ t('appearance.up') }}
            </button>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-label">
            <span>{{ t('appearance.searchBarWidth') }}</span>
          </div>
          <div class="input-group">
            <NumberInput
              v-model="localSettings.searchBar.width.value"
              :min="1"
            />
            <div class="segmented-control">
              <button
                :class="{ active: localSettings.searchBar.width.unit === 'px' }"
                @click="updateSetting('searchBar.width.unit', 'px')"
              >
                {{ t('common.px') }}
              </button>
              <button
                :class="{ active: localSettings.searchBar.width.unit === '%' }"
                @click="updateSetting('searchBar.width.unit', '%')"
              >
                {{ t('common.percent') }}
              </button>
            </div>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-label">
            <span>{{ t('appearance.searchBarRadius') }}</span>
          </div>
          <div class="input-group">
            <NumberInput
              v-model="localSettings.searchBar.borderRadius.value"
              :min="0"
            />
            <div class="segmented-control">
              <button
                :class="{
                  active: localSettings.searchBar.borderRadius.unit === 'px',
                }"
                @click="updateSetting('searchBar.borderRadius.unit', 'px')"
              >
                {{ t('common.px') }}
              </button>
              <button
                :class="{
                  active: localSettings.searchBar.borderRadius.unit === '%',
                }"
                @click="updateSetting('searchBar.borderRadius.unit', '%')"
              >
                {{ t('common.percent') }}
              </button>
            </div>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-label">
            <span>{{ t('appearance.panelRadius') }}</span>
          </div>
          <div class="input-group">
            <NumberInput
              v-model="localSettings.panels.borderRadius.value"
              :min="0"
            />
            <div class="segmented-control">
              <button
                :class="{
                  active: localSettings.panels.borderRadius.unit === 'px',
                }"
                @click="updateSetting('panels.borderRadius.unit', 'px')"
              >
                {{ t('common.px') }}
              </button>
              <button
                :class="{
                  active: localSettings.panels.borderRadius.unit === '%',
                }"
                @click="updateSetting('panels.borderRadius.unit', '%')"
              >
                {{ t('common.percent') }}
              </button>
            </div>
          </div>
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

.setting-item {
  margin-bottom: 24px;
}

.setting-label {
  margin-bottom: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.input-group {
  display: flex;
  gap: 8px;
}

.input-group :deep(.number-input-container) {
  flex: 1;
}

.segmented-control {
  order: 2;
}

.segmented-control {
  display: flex;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 4px;
}

.segmented-control button {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.segmented-control button.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

</style>
