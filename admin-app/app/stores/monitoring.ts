import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMonitoringStore = defineStore('monitoring', () => {
  const metrics = ref({
    uptime: 99.95,
    responseTime: 145,
    errorRate: 0.02,
    activeUsers: 24,
    totalTransactions: 15420,
    failedTransactions: 8,
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 38,
    networkLatency: 12
  })

  const alerts = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchMetrics = async () => {
    try {
      isLoading.value = true
      error.value = null
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      // Return existing metrics (in real app, would fetch from API)
      return metrics.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch metrics'
      console.error('Fetch metrics error:', e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const fetchAlerts = async () => {
    try {
      isLoading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 500))
      return alerts.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch alerts'
      console.error('Fetch alerts error:', e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const systemHealthy = computed(() => {
    const { cpuUsage, memoryUsage, diskUsage, errorRate } = metrics.value
    return cpuUsage < 80 && memoryUsage < 80 && diskUsage < 80 && errorRate < 0.05
  })

  return {
    metrics,
    alerts,
    isLoading,
    error,
    systemHealthy,
    fetchMetrics,
    fetchAlerts
  }
})
