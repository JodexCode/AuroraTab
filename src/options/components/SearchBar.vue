<script setup lang="ts">
// 部分功能实现效果没达到预期，但不是关键功能，暂时搁置
import { onMounted, onUnmounted, ref } from 'vue'

const engines = [
  {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#008373" d="M22.094 17.344l-4.75 2.656v5.875l7.938-4.438zM17.344 3.75l-7.938 10.375v11.875l4.75-2.656v-5.875l7.938-4.438z"/></svg>',
  },
  {
    name: 'Baidu',
    url: 'https://www.baidu.com/s?wd=',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#2932e1" d="M15.26 1.1c.14 0 .27.05.38.14.34.28.37.78.07 1.11l-2.03 2.22c-.22.24-.55.35-.87.29l-2.5-.43c-.32-.05-.63.07-.84.31l-2.03 2.22c-.28.31-.76.33-1.07.06-.31-.27-.33-.75-.06-1.06l2.03-2.22c.22-.24.55-.35.87-.29l2.5.43c.32.05.63-.07.84-.31l2.03-2.22c.11-.12.24-.18.38-.18zm1.96 4.31c.21 0 .42.09.57.26.31.33.29.85-.06 1.16l-4.34 3.86c-.23.2-.53.28-.83.21l-3.33-.78c-.3-.07-.57.03-.78.23l-4.34 3.86c-.34.3-.86.27-1.16-.08-.3-.35-.27-.86.08-1.16l4.34-3.86c.23-.2.53-.28.83-.21l3.33.78c.3.07.57-.03.78-.23l4.34-3.86c.17-.15.39-.22.61-.22zm3.32 4.13c.24 0 .47.11.62.31.28.37.21.9-.17 1.18l-5.63 4.2c-.24.18-.54.23-.82.14l-3.88-1.17c-.28-.08-.58-.02-.79.17l-5.63 4.2c-.38.28-.9.2-1.18-.18-.28-.38-.2-.9.18-1.18l5.63-4.2c.24-.18.54-.23.82-.14l3.88 1.17c.28.08.58.02.79-.17l5.63-4.2c.18-.14.36-.21.55-.21zM24 14.5c.27 0 .52.13.68.36.26.39.15.92-.25 1.18l-6.84 4.51c-.24.16-.53.2-.8.11l-4.31-1.55c-.27-.1-.58-.04-.8.1l-6.84 4.51c-.4.26-.93.15-1.19-.25-.26-.4-.15-.93.25-1.19l6.84-4.51c.24-.16.53-.2.8-.11l4.31 1.55c.27.1.58.04.8-.1l6.84-4.51c.18-.12.37-.18.57-.18z"/></svg>',
  },
  {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>',
  },
]

const currentEngine = ref(engines[0])
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
    }
    else if (currentEngine.value.name === 'Baidu') {
      url = `https://www.baidu.com/sugrec?prod=pc&wd=${encodeURIComponent(query)}`
    }
    else if (currentEngine.value.name === 'Google') {
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
      }
      else {
        suggestions.value = []
      }
    }
    else {
      // OpenSearch format is usually [query, [suggestions]]
      if (Array.isArray(data) && data[1]) {
        suggestions.value = data[1].slice(0, 8)
      }
    }
  }
  catch (error) {
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
  if (suggestions.value.length === 0)
    return
  selectedSuggestionIndex.value =
    (selectedSuggestionIndex.value + 1) % suggestions.value.length
}

function moveUp() {
  if (suggestions.value.length === 0)
    return
  if (selectedSuggestionIndex.value <= 0) {
    selectedSuggestionIndex.value = suggestions.value.length - 1
  }
  else {
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
        placeholder="Search the web..."
        @keyup.enter="handleEnter"
        @keydown.down.prevent="moveDown"
        @keydown.up.prevent="moveUp"
        @input="onInput"
        @focus="isInputFocused = true"
        @blur="handleBlur"
        @click.stop
      >
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
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.2) !important; /* 稍微深一点，压住背景色 */
  backdrop-filter: blur(20px) saturate(180%); /* 增加饱和度提升，让毛玻璃更透亮 */
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
  background-color: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 8px;
  min-width: 140px;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
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
  color: white;
  font-size: 16px;
}

.suggestions-container {
  position: absolute;
  top: calc(100% + 16px);
  left: -52px;
  right: -60px;
  background-color: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius, 16px);
  padding: 8px;
  z-index: 99;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
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
  color: rgba(255, 255, 255, 0.7);
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
