<script setup lang="ts">
interface ValidationResult {
  field: string
  valid: boolean
  error?: string
}

const results: ValidationResult[] = [
  { field: 'Transaction Type', valid: true },
  { field: 'Source Account', valid: true },
  { field: 'Destination Account', valid: true },
  { field: 'Amount', valid: true },
  { field: 'Balance Check', valid: true }
]

const isValid = results.every(r => r.valid)
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-gray-900">Validation Results</h3>
    <div class="space-y-2">
      <div v-for="result in results" :key="result.field" class="flex items-center gap-2 text-sm p-2 rounded" :class="result.valid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
        <span class="text-lg">{{ result.valid ? '✅' : '❌' }}</span>
        <span class="flex-1">{{ result.field }}</span>
      </div>
    </div>
    <div :class="['p-3 rounded text-center font-semibold', isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
      {{ isValid ? '✓ All Validations Passed' : '✗ Validation Failed' }}
    </div>
  </div>
</template>
