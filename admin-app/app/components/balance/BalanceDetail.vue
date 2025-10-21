<script setup lang="ts">
interface BalanceDetail {
  id: string
  accountId: string
  total: number
  available: number
  onHold: number
  reserved: number
  asset: string
  lastUpdated: string
}

const props = withDefaults(
  defineProps<{
    balance?: BalanceDetail
  }>(),
  {
    balance: () => ({
      id: '1',
      accountId: 'ACC-001',
      total: 100000,
      available: 80000,
      onHold: 15000,
      reserved: 5000,
      asset: 'USD',
      lastUpdated: new Date().toISOString()
    })
  }
)

const formatCurrency = (amt: number) => '$' + amt.toLocaleString()
const getPercent = (part: number, total: number) => Math.round((part / total) * 100)
</script>

<template>
  <div v-if="balance" class="space-y-6">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-xs text-blue-600 font-medium">Total Balance</p>
        <p class="text-2xl font-bold text-blue-900 mt-2">{{ formatCurrency(balance.total) }}</p>
      </div>
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <p class="text-xs text-green-600 font-medium">Available</p>
        <p class="text-2xl font-bold text-green-900 mt-2">{{ formatCurrency(balance.available) }}</p>
        <p class="text-xs text-green-700 mt-1">{{ getPercent(balance.available, balance.total) }}%</p>
      </div>
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p class="text-xs text-yellow-600 font-medium">On Hold</p>
        <p class="text-2xl font-bold text-yellow-900 mt-2">{{ formatCurrency(balance.onHold) }}</p>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p class="text-xs text-gray-600 font-medium">Reserved</p>
        <p class="text-2xl font-bold text-gray-900 mt-2">{{ formatCurrency(balance.reserved) }}</p>
      </div>
    </div>
  </div>
</template>
