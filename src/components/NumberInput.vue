<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  localValue.value = val
})

function increase() {
  const newValue = localValue.value + 1
  if (props.max !== undefined && newValue > props.max)
    return
  localValue.value = newValue
  emit('update:modelValue', newValue)
}

function decrease() {
  const newValue = localValue.value - 1
  if (props.min !== undefined && newValue < props.min)
    return
  localValue.value = newValue
  emit('update:modelValue', newValue)
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value = Number(target.value)
  if (props.min !== undefined && value < props.min)
    value = props.min
  if (props.max !== undefined && value > props.max)
    value = props.max
  localValue.value = value
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="number-input-container">
    <input
      type="number"
      class="number-input"
      :value="localValue"
      :min="min"
      :max="max"
      @input="handleInput"
    >
    <div class="number-buttons">
      <button type="button" class="number-btn" @click="increase">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
          <path fill="currentColor" d="M7 14l5-5 5 5z" />
        </svg>
      </button>
      <button type="button" class="number-btn" @click="decrease">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.number-input-container {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.number-input {
  flex-grow: 1;
  background: transparent;
  border: none;
  color: white;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;
  width: 60px;
}

.number-input::-webkit-inner-spin-button,
.number-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-input[type='number'] {
  -moz-appearance: textfield;
}

.number-buttons {
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.number-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.number-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.number-btn:first-child {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
