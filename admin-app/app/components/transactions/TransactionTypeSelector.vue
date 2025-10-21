<script setup lang="ts">
import { computed } from 'vue'

type TransactionType = 'SIMPLE' | 'COMPLEX' | 'DSL' | 'TEMPLATE'

interface TypeOption {
  value: TransactionType
  label: string
  description: string
  icon: string
}

const props = defineProps<{
  modelValue: TransactionType
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TransactionType]
}>()

const types: TypeOption[] = [
  {
    value: 'SIMPLE',
    label: 'Simple Transaction',
    description: 'Single source to single destination',
    icon: '→'
  },
  {
    value: 'COMPLEX',
    label: 'Complex Transaction',
    description: 'Multiple sources to multiple destinations',
    icon: '⇄'
  },
  {
    value: 'DSL',
    label: 'DSL Transaction',
    description: 'Domain-specific language for complex rules',
    icon: '{}' 
  },
  {
    value: 'TEMPLATE',
    label: 'From Template',
    description: 'Use a saved transaction template',
    icon: '⚙'
  }
]

const selectedType = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="transaction-type-selector">
    <h3 class="text-lg font-semibold mb-6">Select Transaction Type</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label v-for="type in types" :key="type.value" class="cursor-pointer">
        <input
          type="radio"
          :value="type.value"
          v-model="selectedType"
          class="sr-only"
        />
        <div :class="['option-card', { 'option-card-selected': selectedType === type.value }]">
          <div class="text-3xl mb-3 font-bold text-blue-600">{{ type.icon }}</div>
          <h4 class="font-semibold text-gray-900 mb-2">{{ type.label }}</h4>
          <p class="text-sm text-gray-600">{{ type.description }}</p>
        </div>
      </label>
    </div>
  </div>
</template>

<style scoped>
.option-card {
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.option-card:hover {
  border-color: #2563eb;
  background: #f0f9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.option-card-selected {
  border-color: #2563eb;
  background: #dbeafe;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
</style>
