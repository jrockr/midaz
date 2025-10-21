<script setup lang="ts">
import { computed } from 'vue'

interface Balance {
  accountId: string
  total: number
  available: number
  onHold: number
  asset: string
}

const props = withDefaults(
  defineProps<{
    balances?: Balance[]
  }>(),
  {
    balances: () => [
      { accountId: 'ACC-001', total: 50000, available: 45000, onHold: 5000, asset: 'USD' },
      { accountId: 'ACC-002', total: 30000, available: 30000, onHold: 0, asset: 'USD' },
      { accountId: 'ACC-003', total: 75000, available: 60000, onHold: 15000, asset: 'EUR' }
    ]
  }
)

const totalBalance = computed(() => {
  return props.balances.reduce((sum, b) => sum + b.total, 0)
})

const totalAvailable = computed(() => {
  return props.balances.reduce((sum, b) => sum + b.available, 0)
})

const totalOnHold = computed(() => {
  return props.balances.reduce((sum, b) => sum + b.onHold, 0)
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const getAvailabilityPercent = computed(() => {
  if (totalBalance.value === 0) return 0
  return Math.round((totalAvailable.value / totalBalance.value) * 100)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Total Balance -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
        <p class="text-sm opacity-90">Total Balance</p>
        <p class="text-3xl font-bold mt-2">{{ formatCurrency(totalBalance) }}</p>
        <p class="text-xs opacity-75 mt-2">Across {{ balances.length }} accounts</p>
      </div>

      <!-- Available Balance -->
      <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
        <p class="text-sm opacity-90">Available Balance</p>
        <p class="text-3xl font-bold mt-2">{{ formatCurrency(totalAvailable) }}</p>
        <p class="text-xs opacity-75 mt-2">{{ getAvailabilityPercent }}% available</p>
      </div>

      <!-- On Hold -->
      <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-6">
        <p class="text-sm opacity-90">On Hold</p>
        <p class="text-3xl font-bold mt-2">{{ formatCurrency(totalOnHold) }}</p>
        <p class="text-xs opacity-75 mt-2">Pending transactions</p>
      </div>
    </div>

    <!-- Balance by Account -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Balance by Account</h2>
      </div>

      <div class="divide-y divide-gray-200">
        <div
          v-for="balance in balances"
          :key="balance.accountId"
          class="p-6 hover:bg-gray-50 transition"
        >
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="font-mono text-sm font-semibold text-gray-900">{{ balance.accountId }}</p>
              <p class="text-sm text-gray-600">{{ balance.asset }}</p>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(balance.total) }}</p>
          </div>

          <!-- Progress Bar -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs text-gray-600">
              <span>Available</span>
              <span>{{ Math.round((balance.available / balance.total) * 100) }}%</span>
            </div>
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-green-600"
                :style="{ width: `${(balance.available / balance.total) * 100}%` }"
              />
            </div>
          </div>

          <!-- Details -->
          <div class="mt-3 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span class="text-gray-600">Available: </span>
              <span class="font-semibold text-gray-900">{{ formatCurrency(balance.available) }}</span>
            </div>
            <div>
              <span class="text-gray-600">On Hold: </span>
              <span class="font-semibold text-yellow-600">{{ formatCurrency(balance.onHold) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
