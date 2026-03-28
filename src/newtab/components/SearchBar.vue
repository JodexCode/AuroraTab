<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from '~/i18n'
import { engines, type EngineName } from '~/utils/searchEngines'

const props = defineProps<{
  searchEngine: EngineName
}>()

const { t } = useI18n()

const emit = defineEmits<{
  'update:searchEngine': [value: EngineName]
}>()

const currentEngine = ref(
  engines.find(e => e.name === props.searchEngine) || engines[0],
)

watch(
  () => props.searchEngine,
  newEngine => {
    const engine = engines.find(e => e.name === newEngine)
    if (engine) currentEngine.value = engine
  },
)

const placeholder = computed(() => {
  const engineName = t(`engines.${currentEngine.value.name}`)
  return t('search.useEngine', { engine: engineName })
})
const searchQuery = ref('')
const isDropdownOpen = ref(false)
const suggestions = ref<string[]>([])
const selectedSuggestionIndex = ref(-1)
const isInputFocused = ref(false)
let debounceTimer: any = null

async function fetchSuggestions(query: string) {
  if (!query.trim()) {
    suggestions.value = []
    return
  }

  try {
    let url = ''
    if (currentEngine.value.name === 'Bing') {
      url = `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(query)}`
    } else if (currentEngine.value.name === 'Baidu') {
      url = `https://www.baidu.com/sugrec?prod=pc&wd=${encodeURIComponent(query)}`
    } else if (currentEngine.value.name === 'Google') {
      url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`
    }

    const response = await fetch(url)
    const data = await response.json()

    if (currentEngine.value.name === 'Baidu') {
      if (data.g && Array.isArray(data.g)) {
        suggestions.value = data.g
          .map((item: any) => item.q)
          .filter((v: any): v is string => !!v)
          .slice(0, 8)
      } else {
        suggestions.value = []
      }
    } else {
      // OpenSearch format is usually [query, [suggestions]]
      if (Array.isArray(data) && data[1]) {
        suggestions.value = data[1].slice(0, 8)
      }
    }
  } catch (error) {
    console.error('Failed to fetch suggestions:', error)
    suggestions.value = []
  }
}

function onInput() {
  selectedSuggestionIndex.value = -1
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fetchSuggestions(searchQuery.value)
  }, 200)
}

function moveDown() {
  if (suggestions.value.length === 0) return
  selectedSuggestionIndex.value =
    (selectedSuggestionIndex.value + 1) % suggestions.value.length
}

function moveUp() {
  if (suggestions.value.length === 0) return
  if (selectedSuggestionIndex.value <= 0) {
    selectedSuggestionIndex.value = suggestions.value.length - 1
  } else {
    selectedSuggestionIndex.value--
  }
}

function handleEnter() {
  if (
    selectedSuggestionIndex.value >= 0 &&
    suggestions.value[selectedSuggestionIndex.value]
  ) {
    searchQuery.value = suggestions.value[selectedSuggestionIndex.value]
  }
  search()
}

function selectSuggestion(suggestion: string) {
  searchQuery.value = suggestion
  search()
}

function search() {
  if (searchQuery.value.trim()) {
    window.location.href =
      currentEngine.value.url + encodeURIComponent(searchQuery.value)
    suggestions.value = []
    isDropdownOpen.value = false
  }
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function selectEngine(engine: (typeof engines)[0]) {
  currentEngine.value = engine
  isDropdownOpen.value = false
  emit('update:searchEngine', engine.name)
  fetchSuggestions(searchQuery.value) // Refresh suggestions for the new engine
}

function closeDropdown() {
  isDropdownOpen.value = false
  isInputFocused.value = false
}

function handleBlur() {
  // Delay blur slightly to allow click on suggestion
  setTimeout(() => {
    isInputFocused.value = false
  }, 200)
}

onMounted(() => {
  window.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  window.removeEventListener('click', closeDropdown)
})
</script>

<template>
  <div class="search-bar-container">
    <div class="engine-selector" @click.stop="toggleDropdown">
      <div class="current-engine">
        <div class="engine-icon-wrapper" v-html="currentEngine.icon" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          class="arrow-icon"
          :class="{ 'is-open': isDropdownOpen }"
        >
          <path fill="currentColor" d="m7 10l5 5l5-5z" />
        </svg>
      </div>

      <transition name="slide-down">
        <div v-if="isDropdownOpen" class="engine-dropdown">
          <div
            v-for="engine in engines"
            :key="engine.name"
            class="engine-item"
            :class="{ active: currentEngine.name === engine.name }"
            @mousedown.prevent
            @click.stop="selectEngine(engine)"
          >
            <div class="engine-icon-small-wrapper" v-html="engine.icon" />
            <span>{{ engine.name }}</span>
          </div>
        </div>
      </transition>
    </div>

    <div class="search-input-wrapper">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        :placeholder="placeholder"
        @keyup.enter="handleEnter"
        @keydown.down.prevent="moveDown"
        @keydown.up.prevent="moveUp"
        @input="onInput"
        @focus="isInputFocused = true"
        @blur="handleBlur"
        @click.stop
      />
      <!-- Suggestions List -->
      <transition name="fade">
        <div
          v-if="suggestions.length > 0 && isInputFocused"
          class="suggestions-container"
        >
          <div
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="suggestion-item"
            :class="{ active: selectedSuggestionIndex === index }"
            @click="selectSuggestion(suggestion)"
            @mouseenter="selectedSuggestionIndex = index"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              class="suggestion-icon"
            >
              <path
                fill="currentColor"
                d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5q0-1.875-1.312-3.187T9.5 5Q7.625 5 6.313 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14"
              />
            </svg>
            <span class="suggestion-text">{{ suggestion }}</span>
          </div>
        </div>
      </transition>
    </div>
    <button class="search-button" @click="search">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5q0-1.875-1.312-3.187T9.5 5Q7.625 5 6.313 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.search-bar-container {
  display: flex;
  align-items: center;
  border-radius: var(--search-bar-border-radius, 24px);
  padding: 8px 16px;
  width: var(--search-bar-width, 600px);
  max-width: 90%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  isolation: isolate;
  transition: all 0.25s ease;
  background-color: rgba(0, 0, 0, 0.1);
}

.engine-selector {
  margin-right: 12px;
  cursor: pointer;
  position: relative;
  user-select: none;
}

.current-engine {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  transition: background-color 0.2s;
}

.current-engine:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.engine-icon-wrapper {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.engine-icon-wrapper :deep(svg) {
  width: 100%;
  height: 100%;
}

.arrow-icon {
  color: white;
  transition: transform 0.2s;
}

.arrow-icon.is-open {
  transform: rotate(180deg);
}

.engine-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(30px) saturate(120%);
  -webkit-backdrop-filter: blur(30px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 8px;
  min-width: 140px;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.engine-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 10px;
  color: white;
  transition: all 0.2s;
}

.engine-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.engine-item.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.engine-icon-small-wrapper {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.engine-icon-small-wrapper :deep(svg) {
  width: 100%;
  height: 100%;
}

.search-input-wrapper {
  flex-grow: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: rgba(255, 255, 255, 0.95);
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.suggestions-container {
  position: absolute;
  top: calc(100% + 16px);
  left: -52px;
  right: -60px;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(30px) saturate(120%);
  -webkit-backdrop-filter: blur(30px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius, 16px);
  padding: 8px;
  z-index: 99;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-item:hover,
.suggestion-item.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.suggestion-icon {
  color: rgba(255, 255, 255, 0.4);
}

.suggestion-text {
  font-size: 14px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.search-button {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0 0 0 12px;
  display: flex;
  align-items: center;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
