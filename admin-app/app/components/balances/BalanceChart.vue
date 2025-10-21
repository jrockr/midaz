<script setup lang="ts">
interface Props {
  data: Array<{
    label: string
    volume: number
    transactions: number
  }>
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Balance Trends'
})
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-6">{{ title }}</h3>
    
    <div class="space-y-6">
      <div v-for="item in data" :key="item.label" class="flex items-center gap-4">
        <div class="w-24">
          <p class="text-sm font-medium text-gray-900">{{ item.label }}</p>
        </div>
        
        <div class="flex-1">
          <div class="h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center px-3">
            <span class="text-white text-sm font-semibold">
              {{ (item.volume / 1000).toFixed(1) }}k
            </span>
          </div>
        </div>
        
        <div class="w-20 text-right">
          <p class="text-sm text-gray-600">{{ item.transactions }} txns</p>
        </div>
      </div>
    </div>
  </div>
</template>
