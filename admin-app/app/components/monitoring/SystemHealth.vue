<script setup lang="ts">
import { computed } from 'vue'

interface HealthMetric {
  name: string
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL'
  latency: number
  uptime: number
}

const props = withDefaults(
  defineProps<{
    metrics?: HealthMetric[]
  }>(),
  {
    metrics: () => [
      { name: 'Database', status: 'HEALTHY', latency: 45, uptime: 99.99 },
      { name: 'API Server', status: 'HEALTHY', latency: 120, uptime: 100 },
      { name: 'Cache Layer', status: 'WARNING', latency: 890, uptime: 99.5 },
      { name: 'Queue Service', status: 'HEALTHY', latency: 200, uptime: 99.95 }
    ]
  }
)

const overallHealth = computed(() => {
  const critical = props.metrics.filter(m => m.status === 'CRITICAL').length
  const warning = props.metrics.filter(m => m.status === 'WARNING').length
  
  if (critical > 0) return 'CRITICAL'
  if (warning > 0) return 'WARNING'
  return 'HEALTHY'
})

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    'HEALTHY': '✅',
    'WARNING': '⚠️',
    'CRITICAL': '🔴'
  }
  return icons[status] || '?'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'HEALTHY': 'bg-green-50 border-green-200',
    'WARNING': 'bg-yellow-50 border-yellow-200',
    'CRITICAL': 'bg-red-50 border-red-200'
  }
  return colors[status] || 'bg-gray-50 border-gray-200'
}

const getStatusTextColor = (status: string) => {
  const colors: Record<string, string> = {
    'HEALTHY': 'text-green-800',
    'WARNING': 'text-yellow-800',
    'CRITICAL': 'text-red-800'
  }
  return colors[status] || 'text-gray-800'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">System Health</h2>
      <p class="text-gray-600 mt-1">Real-time monitoring of system components</p>
    </div>

    <!-- Overall Health -->
    <div :class="['rounded-lg p-6 border', getStatusColor(overallHealth)]">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Overall Status</p>
          <p :class="['text-3xl font-bold mt-2', getStatusTextColor(overallHealth)]">
            {{ overallHealth }}
          </p>
        </div>
        <div class="text-6xl">{{ getStatusIcon(overallHealth) }}</div>
      </div>
    </div>

    <!-- Component Status -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <h3 class="font-semibold text-gray-900">Component Status</h3>
      </div>

      <div class="divide-y divide-gray-200">
        <div
          v-for="metric in metrics"
          :key="metric.name"
          :class="['p-6 flex items-center justify-between hover:bg-gray-50 transition', getStatusColor(metric.status)]"
        >
          <div class="flex items-center gap-4">
            <span class="text-2xl">{{ getStatusIcon(metric.status) }}</span>
            <div>
              <p class="font-semibold text-gray-900">{{ metric.name }}</p>
              <div class="flex gap-4 mt-1 text-sm text-gray-600">
                <span>Latency: {{ metric.latency }}ms</span>
                <span>Uptime: {{ metric.uptime }}%</span>
              </div>
            </div>
          </div>
          <span :class="['px-3 py-1 rounded-full text-sm font-medium', getStatusTextColor(metric.status)]">
            {{ metric.status }}
          </span>
        </div>
      </div>
    </div>

    <!-- Uptime Chart -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="font-semibold text-gray-900 mb-4">Uptime Trend</h3>
      <div class="h-40 bg-gray-50 rounded flex items-center justify-center text-gray-500">
        <div class="text-center">
          <div class="text-4xl mb-2">📊</div>
          <p>Uptime trend visualization would appear here</p>
        </div>
      </div>
    </div>
  </div>
</template>
