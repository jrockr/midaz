<script setup lang="ts">
interface Props {
  data: Array<{
    date: string
    rate: number
    change: number
  }>
  title?: string
  sourceAsset?: string
  destinationAsset?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Rate Trend'
})

const maxRate = (data: any[]) => Math.max(...data.map(d => d.rate))
const minRate = (data: any[]) => Math.min(...data.map(d => d.rate))
const avgRate = (data: any[]) => (data.reduce((sum, d) => sum + d.rate, 0) / data.length).toFixed(8)

const formatRate = (value: number) => value.toFixed(8)
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
      <p v-if="sourceAsset && destinationAsset" class="text-sm text-gray-600">{{ sourceAsset }}/{{ destinationAsset }}</p>
    </div>

    <div class="grid grid-cols-4 gap-4 mb-8">
      <div class="bg-blue-50 rounded-lg p-4">
        <p class="text-xs text-gray-600 mb-1">Highest</p>
        <p class="text-lg font-bold text-blue-600">{{ formatRate(maxRate(data)) }}</p>
      </div>
      <div class="bg-green-50 rounded-lg p-4">
        <p class="text-xs text-gray-600 mb-1">Lowest</p>
        <p class="text-lg font-bold text-green-600">{{ formatRate(minRate(data)) }}</p>
      </div>
      <div class="bg-purple-50 rounded-lg p-4">
        <p class="text-xs text-gray-600 mb-1">Average</p>
        <p class="text-lg font-bold text-purple-600">{{ avgRate(data) }}</p>
      </div>
      <div class="bg-orange-50 rounded-lg p-4">
        <p class="text-xs text-gray-600 mb-1">Latest</p>
        <p class="text-lg font-bold text-orange-600">{{ formatRate(data[data.length - 1]?.rate || 0) }}</p>
      </div>
    </div>

    <div class="space-y-4 max-h-96 overflow-y-auto">
      <div v-for="(point, idx) in data.slice().reverse()" :key="idx" class="flex items-center justify-between py-2 border-b last:border-b-0">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900">{{ point.date }}</p>
        </div>
        <div class="w-48 h-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center px-2">
          <div class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded" :style="{ width: ((point.rate - minRate(data)) / (maxRate(data) - minRate(data)) * 100) + '%' }"></div>
        </div>
        <div class="w-24 text-right">
          <p class="text-sm font-semibold text-gray-900">{{ formatRate(point.rate) }}</p>
          <p :class="`text-xs ${point.change > 0 ? 'text-green-600' : point.change < 0 ? 'text-red-600' : 'text-gray-600'}`">
            {{ point.change > 0 ? '+' : '' }}{{ point.change.toFixed(2) }}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
