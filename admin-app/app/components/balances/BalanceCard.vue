<script setup lang="ts">
interface Props {
  balance: number
  available: number
  onHold: number
  asset: string
  accountName?: string
}

withDefaults(defineProps<Props>(), {
  accountName: 'Account'
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const usagePercent = (available: number, balance: number) => {
  return Math.round((available / balance) * 100)
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
    <div class="mb-3">
      <p class="text-sm text-gray-600">{{ accountName }}</p>
      <h3 class="text-lg font-bold text-gray-900">{{ asset }}</h3>
    </div>

    <div class="space-y-2 mb-4">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Total:</span>
        <span class="font-semibold text-gray-900">{{ formatCurrency(balance) }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Available:</span>
        <span class="font-semibold text-green-600">{{ formatCurrency(available) }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">On Hold:</span>
        <span class="font-semibold text-orange-600">{{ formatCurrency(onHold) }}</span>
      </div>
    </div>

    <div class="bg-gray-200 rounded-full h-2 overflow-hidden">
      <div 
        class="h-full bg-green-500 transition-all"
        :style="{ width: usagePercent(available, balance) + '%' }"
      ></div>
    </div>
    <p class="text-xs text-gray-600 mt-2 text-right">{{ usagePercent(available, balance) }}% available</p>
  </div>
</template>
