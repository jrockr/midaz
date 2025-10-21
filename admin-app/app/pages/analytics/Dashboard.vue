<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button, Card, Breadcrumb } from '@/components'
import { useAnalyticsStore } from '@/stores'

const analyticsStore = useAnalyticsStore()

const dateRange = ref({
  startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0]
})

onMounted(async () => {
  await analyticsStore.fetchAnalytics(dateRange.value.startDate, dateRange.value.endDate)
})

const handleExport = () => {
  analyticsStore.exportData('csv')
}

const handleGenerateReport = () => {
  analyticsStore.generateReport({ startDate: dateRange.value.startDate, endDate: dateRange.value.endDate })
}

const loadAnalytics = async () => {
  await analyticsStore.fetchAnalytics(dateRange.value.startDate, dateRange.value.endDate)
}
</script>

<template>
  <main class="flex-1 overflow-auto">
    <div class="px-6 py-8">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <Breadcrumb />
      </div>

      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Financial Analytics</h1>
          <p class="text-gray-600 mt-2">Comprehensive financial insights and performance metrics</p>
        </div>
        <div class="flex gap-2">
          <Button @click="handleExport" variant="secondary" size="md">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </Button>
          <Button @click="handleGenerateReport" variant="primary" size="md">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Report
          </Button>
        </div>
      </div>

      <!-- Date Range Filter -->
      <Card class="p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              v-model="dateRange.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              v-model="dateRange.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex items-end">
            <Button @click="loadAnalytics" variant="primary" class="w-full">
              <span v-if="!isLoading">🔍 Analyze</span>
              <span v-else>Analyzing...</span>
            </Button>
          </div>
        </div>
      </Card>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card class="p-6">
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Total Volume</label>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ (financialMetrics.totalVolume / 1000000).toFixed(2) }}M</p>
            <p class="text-xs text-gray-600 mt-2">Transaction volume</p>
          </div>
        </Card>
        <Card class="p-6">
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Total Transactions</label>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ financialMetrics.totalTransactions.toLocaleString() }}</p>
            <p class="text-xs text-gray-600 mt-2">All transactions</p>
          </div>
        </Card>
        <Card class="p-6">
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Avg Transaction</label>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ financialMetrics.averageTransaction }}</p>
            <p class="text-xs text-gray-600 mt-2">Average size</p>
          </div>
        </Card>
        <Card class="p-6">
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Success Rate</label>
            <p class="text-2xl font-bold text-green-600 mt-2">{{ financialMetrics.successRate }}%</p>
            <p class="text-xs text-gray-600 mt-2">Transaction success</p>
          </div>
        </Card>
      </div>

      <!-- Top Assets Distribution -->
      <Card class="p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Asset Distribution</h3>
        <div class="space-y-4">
          <div v-for="asset in topAssets" :key="asset.name">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">{{ asset.name }}</span>
              <span class="text-sm text-gray-600">{{ (asset.volume / 1000000).toFixed(2) }}M ({{ asset.percentage }}%)</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                :style="{ width: asset.percentage + '%' }"
                class="h-3 rounded-full bg-blue-600 transition-all"
              ></div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Transaction Trends -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Volume Trend</h3>
          <div class="space-y-2">
            <div v-for="(label, index) in trendData.labels" :key="label" class="flex items-center gap-4">
              <span class="text-sm text-gray-600 w-12">{{ label }}</span>
              <div class="flex-1 bg-gray-200 h-8 rounded relative overflow-hidden">
                <div
                  :style="{ width: (trendData.volume[index] / 700000) * 100 + '%' }"
                  class="h-full bg-green-500 transition-all"
                ></div>
              </div>
              <span class="text-sm font-medium text-gray-900 w-16 text-right">{{ (trendData.volume[index] / 1000000).toFixed(2) }}M</span>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Transaction Count Trend</h3>
          <div class="space-y-2">
            <div v-for="(label, index) in trendData.labels" :key="label" class="flex items-center gap-4">
              <span class="text-sm text-gray-600 w-12">{{ label }}</span>
              <div class="flex-1 bg-gray-200 h-8 rounded relative overflow-hidden">
                <div
                  :style="{ width: (trendData.transactions[index] / 4200) * 100 + '%' }"
                  class="h-full bg-purple-500 transition-all"
                ></div>
              </div>
              <span class="text-sm font-medium text-gray-900 w-16 text-right">{{ trendData.transactions[index].toLocaleString() }}</span>
            </div>
          </div>
        </Card>
      </div>

      <!-- Performance Summary -->
      <Card class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <p class="text-3xl font-bold text-blue-600">📈</p>
            <p class="text-sm text-gray-700 mt-2"><strong>Growth Rate:</strong> +12.5%</p>
            <p class="text-xs text-gray-600">Compared to last period</p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-3xl font-bold text-green-600">✓</p>
            <p class="text-sm text-gray-700 mt-2"><strong>Compliance:</strong> 100%</p>
            <p class="text-xs text-gray-600">All requirements met</p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <p class="text-3xl font-bold text-purple-600">⚡</p>
            <p class="text-sm text-gray-700 mt-2"><strong>Performance:</strong> Excellent</p>
            <p class="text-xs text-gray-600">All metrics within targets</p>
          </div>
        </div>
      </Card>
    </div>
  </main>
</template>
