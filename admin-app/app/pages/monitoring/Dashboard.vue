<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, Breadcrumb } from '@/components'

const systemStats = ref({
  uptime: 99.95,
  responseTime: 145,
  errorRate: 0.02,
  activeUsers: 24,
  totalTransactions: 15420,
  failedTransactions: 8
})

const alerts = ref<any[]>([])
const performanceMetrics = ref({
  cpuUsage: 45,
  memoryUsage: 62,
  diskUsage: 38,
  networkLatency: 12
})

const isLoading = ref(false)

onMounted(() => {
  loadMonitoringData()
})

const loadMonitoringData = async () => {
  isLoading.value = true
  try {
    // API call would go here
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    isLoading.value = false
  }
}

const getHealthStatus = (value: number) => {
  if (value >= 80) return { color: 'text-red-600', label: 'Critical', bg: 'bg-red-50' }
  if (value >= 70) return { color: 'text-orange-600', label: 'Warning', bg: 'bg-orange-50' }
  return { color: 'text-green-600', label: 'Healthy', bg: 'bg-green-50' }
}

const getMetricBg = (name: string) => {
  const status = getHealthStatus(performanceMetrics.value[name as keyof typeof performanceMetrics.value] as number)
  return status.bg
}

const getMetricColor = (name: string) => {
  const status = getHealthStatus(performanceMetrics.value[name as keyof typeof performanceMetrics.value] as number)
  return status.color
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
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">System Monitoring</h1>
        <p class="text-gray-600 mt-2">Real-time system health and performance metrics</p>
      </div>

      <!-- System Status Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card class="p-6 border-l-4 border-green-500">
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">System Uptime</label>
            <p class="text-3xl font-bold text-green-600 mt-2">{{ systemStats.uptime }}%</p>
            <p class="text-sm text-gray-600 mt-1">Last 30 days</p>
          </div>
        </Card>
        <Card class="p-6 border-l-4 border-blue-500">
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Avg Response Time</label>
            <p class="text-3xl font-bold text-blue-600 mt-2">{{ systemStats.responseTime }}ms</p>
            <p class="text-sm text-gray-600 mt-1">All requests</p>
          </div>
        </Card>
        <Card class="p-6 border-l-4 border-orange-500">
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Error Rate</label>
            <p class="text-3xl font-bold text-orange-600 mt-2">{{ (systemStats.errorRate * 100).toFixed(2) }}%</p>
            <p class="text-sm text-gray-600 mt-1">Failed requests</p>
          </div>
        </Card>
      </div>

      <!-- Activity Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card class="p-6">
          <div class="text-center">
            <label class="text-xs text-gray-500 uppercase font-semibold">Active Users</label>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ systemStats.activeUsers }}</p>
          </div>
        </Card>
        <Card class="p-6">
          <div class="text-center">
            <label class="text-xs text-gray-500 uppercase font-semibold">Total Transactions</label>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ systemStats.totalTransactions.toLocaleString() }}</p>
          </div>
        </Card>
        <Card class="p-6">
          <div class="text-center">
            <label class="text-xs text-gray-500 uppercase font-semibold">Failed Transactions</label>
            <p class="text-2xl font-bold text-red-600 mt-2">{{ systemStats.failedTransactions }}</p>
          </div>
        </Card>
      </div>

      <!-- Performance Metrics -->
      <Card class="p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Resource Utilization</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="(value, key) in performanceMetrics" :key="key" :class="`p-4 rounded-lg border-2 ${getMetricBg(key)}`">
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700 capitalize">{{ key.replace(/([A-Z])/g, ' $1').trim() }}</label>
              <span :class="`text-sm font-bold ${getMetricColor(key)}`">{{ value }}%</span>
            </div>
            <div class="w-full bg-gray-300 rounded-full h-2">
              <div
                :style="{ width: value + '%' }"
                :class="`h-2 rounded-full transition-all ${
                  value >= 80 ? 'bg-red-500' :
                  value >= 70 ? 'bg-orange-500' :
                  'bg-green-500'
                }`"
              ></div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Recent Alerts -->
      <Card class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Recent Alerts</h3>
        <div v-if="isLoading" class="text-center py-6">
          <p class="text-gray-600">Loading alerts...</p>
        </div>
        <div v-else-if="alerts.length === 0" class="text-center py-6">
          <p class="text-gray-600">No recent alerts</p>
          <p class="text-sm text-gray-500 mt-1">All systems operating normally</p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="alert in alerts"
            :key="alert.id"
            class="p-4 border-l-4 border-orange-500 bg-orange-50 rounded"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ alert.title }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ alert.message }}</p>
              </div>
              <span class="text-xs text-gray-500">{{ alert.time }}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </main>
</template>
