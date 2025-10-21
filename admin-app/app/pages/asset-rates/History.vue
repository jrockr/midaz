<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button, Card, Input, Modal, Alert } from '@/components'
import { AssetRateChart, AssetRateComparison } from '@/components'

const assetRates = ref<any[]>([])
const selectedPair = ref<any>(null)
const dateRange = ref({
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  to: new Date().toISOString().split('T')[0]
})

const isLoading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  await loadHistory()
})

const loadHistory = async () => {
  isLoading.value = true
  error.value = null
  try {
    assetRates.value = [
      {
        id: 'ARF-001',
        sourceAsset: 'USD',
        destinationAsset: 'EUR',
        rate: 0.9158,
        reverseRate: 1.0920,
        effectiveDate: '2025-10-21',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        history: [
          { date: '2025-10-15', rate: 0.9085, change: -0.15 },
          { date: '2025-10-16', rate: 0.9110, change: 0.28 },
          { date: '2025-10-17', rate: 0.9095, change: -0.17 },
          { date: '2025-10-18', rate: 0.9135, change: 0.44 },
          { date: '2025-10-19', rate: 0.9120, change: -0.16 },
          { date: '2025-10-20', rate: 0.9140, change: 0.22 },
          { date: '2025-10-21', rate: 0.9158, change: 0.20 }
        ]
      },
      {
        id: 'ARF-002',
        sourceAsset: 'USD',
        destinationAsset: 'GBP',
        rate: 0.7920,
        reverseRate: 1.2626,
        effectiveDate: '2025-10-21',
        status: 'ACTIVE',
        history: [
          { date: '2025-10-15', rate: 0.7965, change: 0.12 },
          { date: '2025-10-16', rate: 0.7948, change: -0.21 },
          { date: '2025-10-17', rate: 0.7932, change: -0.20 },
          { date: '2025-10-18', rate: 0.7910, change: -0.28 },
          { date: '2025-10-19', rate: 0.7895, change: -0.19 },
          { date: '2025-10-20', rate: 0.7908, change: 0.16 },
          { date: '2025-10-21', rate: 0.7920, change: 0.15 }
        ]
      },
      {
        id: 'ARF-003',
        sourceAsset: 'EUR',
        destinationAsset: 'GBP',
        rate: 0.8651,
        reverseRate: 1.1560,
        effectiveDate: '2025-10-21',
        status: 'ACTIVE',
        history: [
          { date: '2025-10-15', rate: 0.8628, change: -0.08 },
          { date: '2025-10-16', rate: 0.8642, change: 0.16 },
          { date: '2025-10-17', rate: 0.8635, change: -0.08 },
          { date: '2025-10-18', rate: 0.8648, change: 0.15 },
          { date: '2025-10-19', rate: 0.8641, change: -0.08 },
          { date: '2025-10-20', rate: 0.8648, change: 0.08 },
          { date: '2025-10-21', rate: 0.8651, change: 0.03 }
        ]
      }
    ]
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load history'
  } finally {
    isLoading.value = false
  }
}

const uniquePairs = computed(() => {
  return assetRates.value.map(r => ({
    id: r.id,
    label: `${r.sourceAsset}/${r.destinationAsset}`,
    sourceAsset: r.sourceAsset,
    destinationAsset: r.destinationAsset,
    rate: r.rate
  }))
})

const handleSelectPair = (pair: any) => {
  selectedPair.value = pair
}

const exportHistory = () => {
  if (!selectedPair.value) return
  
  const rate = assetRates.value.find(r => r.id === selectedPair.value.id)
  if (!rate) return

  const csv = [
    [`Rate History: ${rate.sourceAsset}/${rate.destinationAsset}`],
    ['Date', 'Rate', '24h Change %'],
    ...rate.history.map(h => [h.date, h.rate.toFixed(8), h.change.toFixed(2)])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `rate-history-${selectedPair.value.label}-${new Date().toISOString()}.csv`
  link.click()
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Rate History & Analysis</h1>

    <Alert v-if="error" type="error" class="mb-4">{{ error }}</Alert>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Card class="p-4 lg:col-span-1">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Asset Pairs</h2>
        <div class="space-y-2">
          <button
            v-for="pair in uniquePairs"
            :key="pair.id"
            @click="handleSelectPair(pair)"
            :class="selectedPair?.id === pair.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'"
            class="px-4 py-2 rounded-lg font-medium transition-all text-left w-full"
          >
            {{ pair.label }}
          </button>
        </div>
      </Card>

      <div class="lg:col-span-3 space-y-6">
        <Card v-if="!selectedPair" class="p-8 text-center">
          <p class="text-gray-600">Select an asset pair to view history</p>
        </Card>

        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card class="p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">{{ selectedPair.label }} Stats</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Current Rate:</span>
                  <span class="font-bold text-gray-900">{{ selectedPair.rate.toFixed(8) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Reverse Rate:</span>
                  <span class="font-bold text-gray-900">{{ (1 / selectedPair.rate).toFixed(8) }}</span>
                </div>
                <div class="flex justify-between pt-3 border-t">
                  <span class="text-gray-600">Period:</span>
                  <span class="font-medium text-gray-900">Last 30 Days</span>
                </div>
              </div>
            </Card>

            <Card class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-gray-900">Actions</h3>
              </div>
              <Button @click="exportHistory" variant="secondary" class="w-full">
                📥 Export History
              </Button>
            </Card>
          </div>

          <AssetRateChart
            :data="assetRates.find(r => r.id === selectedPair.id)?.history || []"
            :title="`${selectedPair.label} Trend`"
            :source-asset="selectedPair.sourceAsset"
            :destination-asset="selectedPair.destinationAsset"
          />
        </template>
      </div>
    </div>
  </div>
</template>
