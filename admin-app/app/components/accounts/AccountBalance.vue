<template>
  <div class="space-y-4">
    <!-- Balance Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Total Balance -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="text-sm font-medium text-gray-600 mb-2">Total Balance</div>
        <div class="text-3xl font-bold text-gray-900">
          {{ formatBalance(totalBalance) }}
        </div>
        <div class="text-xs text-gray-500 mt-2">{{ assetCode }}</div>
      </div>

      <!-- Available Balance -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="text-sm font-medium text-gray-600 mb-2">Available</div>
        <div
          :class="{
            'text-3xl font-bold': true,
            'text-green-600': availableBalance >= 0,
            'text-red-600': availableBalance < 0
          }"
        >
          {{ formatBalance(availableBalance) }}
        </div>
        <div class="text-xs text-gray-500 mt-2">Ready to use</div>
      </div>

      <!-- On-Hold Balance -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="text-sm font-medium text-gray-600 mb-2">On-Hold</div>
        <div
          :class="{
            'text-3xl font-bold': true,
            'text-yellow-600': onHoldBalance > 0,
            'text-gray-600': onHoldBalance === 0
          }"
        >
          {{ formatBalance(onHoldBalance) }}
        </div>
        <div class="text-xs text-gray-500 mt-2">Temporarily held</div>
      </div>
    </div>

    <!-- Last Updated -->
    <div class="text-xs text-gray-500 text-right">
      Last updated: {{ lastUpdated }}
      <button
        @click="refresh"
        :disabled="isLoading"
        class="ml-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
      >
        <span v-if="isLoading">Refreshing...</span>
        <span v-else>Refresh</span>
      </button>
    </div>

    <!-- Info Message -->
    <div v-if="availableBalance < 0" class="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
      ⚠️ Negative available balance detected. Please review transactions.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useBalancesStore } from '@/stores'
import type { Balance } from '@/types'

interface Props {
  accountId: string
  assetCode?: string
  autoRefresh?: number // milliseconds, 0 to disable
}

const props = withDefaults(defineProps<Props>(), {
  assetCode: 'USD',
  autoRefresh: 0
})

const balancesStore = useBalancesStore()
const isLoading = ref(false)
const balance = ref<Balance | null>(null)
const lastUpdated = ref(new Date().toLocaleTimeString())
let refreshInterval: number | null = null

const totalBalance = computed(() => {
  if (!balance.value) return 0
  return parseFloat(balance.value.balance || '0')
})

const availableBalance = computed(() => {
  if (!balance.value) return 0
  return parseFloat(balance.value.available || '0')
})

const onHoldBalance = computed(() => {
  if (!balance.value) return 0
  return parseFloat(balance.value.onHold || '0')
})

const formatBalance = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0.00'
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8
  })
}

const refresh = async () => {
  isLoading.value = true
  try {
    // In a real app, fetch the balance from the API
    // const response = await balancesStore.getByAccountId(props.accountId)
    // balance.value = response
    lastUpdated.value = new Date().toLocaleTimeString()
  } catch (error) {
    console.error('Failed to refresh balance:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  refresh()

  // Setup auto-refresh if enabled
  if (props.autoRefresh > 0) {
    refreshInterval = window.setInterval(() => {
      refresh()
    }, props.autoRefresh)
  }
})

watch(() => props.accountId, () => {
  refresh()
})

onBeforeUnmount(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

import { onBeforeUnmount } from 'vue'
</script>
