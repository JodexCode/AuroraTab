<script setup lang="ts">
import '~/styles/panel-transition.css'
import '~/styles/panel.css'

import { computed, onMounted, ref, watch } from 'vue'
import type { DBConfig } from '~/utils/indexedDB'
import { type Locale, locales, useI18n } from '~/i18n'

const props = defineProps<{ settings: DBConfig, direction: string }>()
const emit = defineEmits<{
  'close': []
  'update:settings': [value: DBConfig]
}>()

const { t } = useI18n()

const isOpen = ref(false)
const localSettings = ref<DBConfig>(JSON.parse(JSON.stringify(props.settings)))

const panelStyle = computed(() => ({
  bottom: props.direction === 'left' ? '80px' : '20px',
}))

watch(
  localSettings,
  (newValue) => {
    emit('update:settings', newValue)
  },
  { deep: true },
)

function selectLanguage(locale: Locale) {
  updateSetting('language', locale)
}

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
  <transition name="slide-up">
    <div v-if="isOpen" class="panel-container" :style="panelStyle">
      <div class="panel-header">
        <h3>{{ t('language.title') }}</h3>
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
            <span>{{ t('language.select') }}</span>
          </div>
          <div class="language-list">
            <button
              v-for="locale in locales"
              :key="locale.code"
              class="language-option"
              :class="{ active: localSettings.language === locale.code }"
              @click="selectLanguage(locale.code)"
            >
              <span class="locale-native">{{ locale.nativeName }}</span>
              <span class="locale-name">{{ locale.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.language-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.language-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.language-option:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.language-option.active {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.locale-native {
  font-size: 16px;
  font-weight: 500;
}

.locale-name {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

</style>
