<script setup lang="ts">
interface Balance {
  id: string
  accountId: string
  total: number
  available: number
  asset: string
}

const props = withDefaults(
  defineProps<{
    balances?: Balance[]
  }>(),
  {
    balances: () => [
      { id: '1', accountId: 'ACC-001', total: 50000, available: 45000, asset: 'USD' },
      { id: '2', accountId: 'ACC-002', total: 30000, available: 30000, asset: 'USD' },
      { id: '3', accountId: 'ACC-003', total: 75000, available: 60000, asset: 'EUR' }
    ]
  }
)

const formatCurrency = (amount: number) => '$' + amount.toLocaleString()
const getAvailPercent = (available: number, total: number) => Math.round((available / total) * 100)
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold text-gray-900">Account Balances</h2>

    <div class="space-y-3">
      <div v-for="balance in balances" :key="balance.id" class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="font-mono text-sm font-semibold text-gray-900">{{ balance.accountId }}</p>
            <p class="text-xs text-gray-600">{{ balance.asset }}</p>
          </div>
          <p class="text-xl font-bold text-gray-900">{{ formatCurrency(balance.total) }}</p>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-xs text-gray-600">
            <span>Available</span>
            <span>{{ getAvailPercent(balance.available, balance.total) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-green-600 h-2 rounded-full" :style="{ width: getAvailPercent(balance.available, balance.total) + '%' }" />
          </div>
          <p class="text-xs text-gray-600">{{ formatCurrency(balance.available) }} available</p>
        </div>
      </div>
    </div>
  </div>
</template>
