<script setup lang="ts">
import { computed } from "vue"
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title || 'Balance Trend' }}</h3>
    <div class="h-64 bg-gradient-to-b from-blue-50 to-blue-100 rounded flex items-center justify-center">
      <div class="text-center text-gray-500">
        <div class="text-4xl mb-2">📊</div>
        <p class="text-sm">Chart Visualization</p>
        <p class="text-xs mt-1">Powered by Chart.js</p>
      </div>
    </div>
  </div>
</template>
