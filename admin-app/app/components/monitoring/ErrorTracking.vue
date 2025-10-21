<script setup lang="ts">
import { computed } from "vue"
interface Error {
  id: string
  message: string
  count: number
  lastOccurred: string
  status: 'NEW' | 'ACTIVE' | 'RESOLVED'
}

const props = withDefaults(
  defineProps<{
    errors?: Error[]
  }>(),
  {
    errors: () => [
      { id: '1', message: 'Database connection timeout', count: 3, lastOccurred: new Date().toISOString(), status: 'ACTIVE' },
      { id: '2', message: 'API rate limit exceeded', count: 12, lastOccurred: new Date(Date.now() - 3600000).toISOString(), status: 'ACTIVE' }
    ]
  }
)

const getStatusBadge = (s: string) => {
  const colors: Record<string, string> = {
    'NEW': 'bg-red-100 text-red-800',
    'ACTIVE': 'bg-yellow-100 text-yellow-800',
    'RESOLVED': 'bg-green-100 text-green-800'
  }
  return colors[s] || 'bg-gray-100'
}
</script>

<template>
  <div class="space-y-3">
    <h3 class="font-semibold text-gray-900">Error Tracking</h3>
    <div v-for="err in errors" :key="err.id" class="p-3 border border-gray-200 rounded-lg">
      <div class="flex justify-between items-start">
        <div class="text-sm">
          <p class="font-medium text-gray-900">{{ err.message }}</p>
          <p class="text-xs text-gray-600 mt-1">Occurrences: {{ err.count }}</p>
        </div>
        <span :class="['px-2 py-1 text-xs font-medium rounded', getStatusBadge(err.status)]">
          {{ err.status }}
        </span>
      </div>
    </div>
  </div>
</template>
