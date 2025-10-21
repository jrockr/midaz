<script setup lang="ts">
const flows = [
  { name: 'Operating', value: 250000, type: 'positive' },
  { name: 'Investing', value: -75000, type: 'negative' },
  { name: 'Financing', value: 50000, type: 'positive' }
]

const netCashFlow = flows.reduce((s, f) => s + f.value, 0)
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
    <h3 class="font-semibold text-gray-900">Cash Flow</h3>
    <div class="space-y-2">
      <div v-for="flow in flows" :key="flow.name" class="flex items-center justify-between text-sm">
        <span>{{ flow.name }}</span>
        <span :class="flow.type === 'positive' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
          {{ flow.type === 'positive' ? '+' : '' }}${{ Math.abs(flow.value).toLocaleString() }}
        </span>
      </div>
      <div class="border-t pt-2 flex justify-between font-bold">
        <span>Net Cash Flow</span>
        <span :class="netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'">
          ${{ netCashFlow.toLocaleString() }}
        </span>
      </div>
    </div>
  </div>
</template>
