<script setup lang="ts">
import { computed } from "vue"
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title || 'Transaction Trends' }}</h3>
    <div class="h-64 bg-gradient-to-b from-purple-50 to-purple-100 rounded flex items-center justify-center">
      <div class="text-center text-gray-500">
        <div class="text-4xl mb-2">📈</div>
        <p class="text-sm">Transaction Volume Trend</p>
      </div>
    </div>
  </div>
</template>
