<script setup lang="ts">
import { computed } from 'vue'

interface AnalyticsData {
  totalTransactions: number
  totalVolume: number
  averageTransactionSize: number
  successRate: number
  failureRate: number
  completionRate: number
}

const props = withDefaults(
  defineProps<{
    data?: AnalyticsData
  }>(),
  {
    data: () => ({
      totalTransactions: 1250,
      totalVolume: 5250000,
      averageTransactionSize: 4200,
      successRate: 98.5,
      failureRate: 1.2,
      completionRate: 99.8
    })
  }
)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}

const getMetrics = computed(() => [
  {
    label: 'Total Transactions',
    value: props.data.totalTransactions,
    unit: 'txns',
    icon: '📊',
    color: 'blue'
  },
  {
    label: 'Total Volume',
    value: formatCurrency(props.data.totalVolume),
    unit: 'USD',
    icon: '💰',
    color: 'green'
  },
  {
    label: 'Average Size',
    value: formatCurrency(props.data.averageTransactionSize),
    unit: 'per txn',
    icon: '📈',
    color: 'purple'
  },
  {
    label: 'Success Rate',
    value: props.data.successRate,
    unit: '%',
    icon: '✅',
    color: 'green'
  },
  {
    label: 'Failure Rate',
    value: props.data.failureRate,
    unit: '%',
    icon: '❌',
    color: 'red'
  },
  {
    label: 'Completion Rate',
    value: props.data.completionRate,
    unit: '%',
    icon: '🎯',
    color: 'blue'
  }
])

const getColorClass = (color: string) => {
  const colors: Record<string, string> = {
    'blue': 'from-blue-500 to-blue-600',
    'green': 'from-green-500 to-green-600',
    'purple': 'from-purple-500 to-purple-600',
    'red': 'from-red-500 to-red-600'
  }
  return colors[color] || colors.blue
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
      <p class="text-gray-600 mt-1">Key financial metrics and transaction insights</p>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="metric in getMetrics"
        :key="metric.label"
        :class="['bg-gradient-to-br text-white rounded-lg p-6', getColorClass(metric.color)]"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm opacity-90 font-medium">{{ metric.label }}</p>
            <p class="text-3xl font-bold mt-2">{{ metric.value }}</p>
            <p class="text-xs opacity-75 mt-1">{{ metric.unit }}</p>
          </div>
          <div class="text-3xl opacity-75">{{ metric.icon }}</div>
        </div>
      </div>
    </div>

    <!-- Charts Placeholder -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Transactions Over Time -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Transactions Over Time</h3>
        <div class="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-500">
          <div class="text-center">
            <div class="text-4xl mb-2">📈</div>
            <p>Chart visualization would appear here</p>
          </div>
        </div>
      </div>

      <!-- Transaction Types Distribution -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Transaction Types Distribution</h3>
        <div class="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-500">
          <div class="text-center">
            <div class="text-4xl mb-2">🥧</div>
            <p>Chart visualization would appear here</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="font-semibold text-gray-900 mb-4">Performance Summary</h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-gray-600">Transaction Success</span>
          <div class="flex-1 mx-4 bg-gray-200 rounded-full h-2">
            <div class="bg-green-600 h-2 rounded-full" :style="{ width: `${data.successRate}%` }" />
          </div>
          <span class="font-semibold text-gray-900">{{ data.successRate }}%</span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-gray-600">Completion Rate</span>
          <div class="flex-1 mx-4 bg-gray-200 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full" :style="{ width: `${data.completionRate}%` }" />
          </div>
          <span class="font-semibold text-gray-900">{{ data.completionRate }}%</span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-gray-600">Failure Rate</span>
          <div class="flex-1 mx-4 bg-gray-200 rounded-full h-2">
            <div class="bg-red-600 h-2 rounded-full" :style="{ width: `${data.failureRate}%` }" />
          </div>
          <span class="font-semibold text-gray-900">{{ data.failureRate }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
