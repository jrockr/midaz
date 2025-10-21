<script setup lang="ts">
interface Props {
  sourceAsset: string
  destinationAsset: string
  rate: number
  reverseRate?: number
  effectiveDate: string
  status: string
  change?: number
}

withDefaults(defineProps<Props>(), {
  change: 0
})

const formatRate = (value: number) => {
  return value.toFixed(8)
}

const getChangeColor = (change: number) => {
  return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span class="text-blue-700 font-bold text-sm">{{ sourceAsset[0] }}</span>
        </div>
        <div>
          <p class="text-sm font-bold text-gray-900">{{ sourceAsset }} → {{ destinationAsset }}</p>
          <p class="text-xs text-gray-600">{{ formatDate(effectiveDate) }}</p>
        </div>
      </div>
      <div :class="`px-2 py-1 rounded-full text-xs font-semibold ${status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`">
        {{ status }}
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-gray-600 text-sm">Rate:</span>
        <span class="font-bold text-lg text-gray-900">{{ formatRate(rate) }}</span>
      </div>
      <div v-if="reverseRate" class="flex justify-between items-center">
        <span class="text-gray-600 text-sm">Reverse Rate:</span>
        <span class="text-sm text-gray-700">{{ formatRate(reverseRate) }}</span>
      </div>
      <div class="flex justify-between items-center pt-2 border-t">
        <span class="text-gray-600 text-sm">Change (24h):</span>
        <span :class="`font-semibold ${getChangeColor(change)}`">{{ change > 0 ? '+' : '' }}{{ change.toFixed(2) }}%</span>
      </div>
    </div>
  </div>
</template>
