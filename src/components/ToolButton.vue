<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <button class="action-button" v-bind="$attrs">
    <slot />
    <span class="tooltip">{{ title }}</span>
  </button>
</template>

<style scoped>
.action-button {
  position: relative;
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

.tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translateX(-50%);
  left: 50%;
  bottom: calc(100% + 8px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 1000;
}

.action-button:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-4px);
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.8);
}
</style>
