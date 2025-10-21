<script setup lang="ts">
interface Asset {
  name: string
  percentage: number
  amount: number
}

const assets: Asset[] = [
  { name: 'USD', percentage: 60, amount: 600000 },
  { name: 'EUR', percentage: 25, amount: 250000 },
  { name: 'GBP', percentage: 10, amount: 100000 },
  { name: 'BTC', percentage: 5, amount: 50000 }
]

const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-6">Asset Distribution</h3>
    <div class="space-y-4">
      <div v-for="(asset, idx) in assets" :key="asset.name" class="flex items-center gap-4">
        <div class="flex-1">
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-900">{{ asset.name }}</span>
            <span class="text-sm font-semibold text-gray-900">{{ asset.percentage }}%</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full" :style="{ width: asset.percentage + '%', backgroundColor: colors[idx] }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
