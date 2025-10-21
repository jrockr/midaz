<script setup lang="ts">
interface Metric {
  name: string
  value: number
  unit: string
  status: 'GOOD' | 'WARNING' | 'CRITICAL'
}

const props = withDefaults(
  defineProps<{
    metrics?: Metric[]
  }>(),
  {
    metrics: () => [
      { name: 'Response Time', value: 250, unit: 'ms', status: 'GOOD' },
      { name: 'CPU Usage', value: 65, unit: '%', status: 'WARNING' },
      { name: 'Memory Usage', value: 78, unit: '%', status: 'WARNING' },
      { name: 'Database Connections', value: 45, unit: 'active', status: 'GOOD' }
    ]
  }
)

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'GOOD': 'text-green-600',
    'WARNING': 'text-yellow-600',
    'CRITICAL': 'text-red-600'
  }
  return colors[status] || 'text-gray-600'
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-gray-900">Performance Metrics</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div v-for="metric in metrics" :key="metric.name" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div class="flex justify-between items-start">
          <p class="text-sm text-gray-600">{{ metric.name }}</p>
          <span :class="['text-sm font-bold', getStatusColor(metric.status)]">{{ metric.status }}</span>
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-2">
          {{ metric.value }}<span class="text-lg text-gray-600 ml-1">{{ metric.unit }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
