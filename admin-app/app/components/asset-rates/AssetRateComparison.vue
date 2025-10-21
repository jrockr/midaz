<script setup lang="ts">
interface Props {
  rateA: number
  rateB: number
  pairA: string
  pairB: string
}

defineProps<Props>()

const getDifference = (a: number, b: number) => {
  return ((b - a) / a * 100).toFixed(2)
}

const getArbitrage = (a: number, b: number) => {
  return (Math.abs(1 - (1 / a * b)) * 100).toFixed(2)
}

const formatRate = (value: number) => {
  return value.toFixed(8)
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-6">Rate Comparison</h3>

    <div class="grid grid-cols-2 gap-6">
      <div class="border-r pr-6">
        <p class="text-sm text-gray-600 mb-2">Pair A</p>
        <p class="text-2xl font-bold text-gray-900 mb-1">{{ formatRate(rateA) }}</p>
        <p class="text-xs text-gray-600">{{ pairA }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600 mb-2">Pair B</p>
        <p class="text-2xl font-bold text-gray-900 mb-1">{{ formatRate(rateB) }}</p>
        <p class="text-xs text-gray-600">{{ pairB }}</p>
      </div>
    </div>

    <div class="mt-6 space-y-4">
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex justify-between items-center mb-2">
          <p class="text-sm font-medium text-gray-700">Difference</p>
          <span :class="`font-bold ${getDifference(rateA, rateB) > 0 ? 'text-green-600' : 'text-red-600'}`">
            {{ getDifference(rateA, rateB) > 0 ? '+' : '' }}{{ getDifference(rateA, rateB) }}%
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="h-2 bg-blue-500 rounded-full transition-all"
            :style="{ width: Math.min(100, Math.max(0, parseFloat(getDifference(rateA, rateB)) + 50)) + '%' }"
          ></div>
        </div>
      </div>

      <div class="bg-purple-50 rounded-lg p-4">
        <p class="text-sm font-medium text-gray-700 mb-2">Arbitrage Opportunity</p>
        <p class="text-lg font-bold text-purple-600">{{ getArbitrage(rateA, rateB) }}%</p>
        <p class="text-xs text-gray-600 mt-1">Circular exchange discrepancy</p>
      </div>
    </div>
  </div>
</template>
