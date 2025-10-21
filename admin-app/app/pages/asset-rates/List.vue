<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Button, Card, Input, Table, Modal, Alert, Breadcrumb } from '@/components'
import { AssetRateForm, AssetRateCard, AssetRateChart } from '@/components'

const assetRates = ref<any[]>([])
const filters = ref({
  sourceAsset: '',
  destinationAsset: '',
  status: '',
  search: ''
})

const sortBy = ref('sourceAsset')
const sortOrder = ref<'asc' | 'desc'>('asc')
const isLoading = ref(false)
const error = ref<string | null>(null)
const showForm = ref(false)
const showBulkUpload = ref(false)
const selectedRate = ref<any>(null)

onMounted(async () => {
  await loadAssetRates()
})

const loadAssetRates = async () => {
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
        change24h: 0.15
      },
      {
        id: 'ARF-002',
        sourceAsset: 'USD',
        destinationAsset: 'GBP',
        rate: 0.7920,
        reverseRate: 1.2626,
        effectiveDate: '2025-10-21',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date().toISOString(),
        change24h: -0.25
      },
      {
        id: 'ARF-003',
        sourceAsset: 'EUR',
        destinationAsset: 'GBP',
        rate: 0.8651,
        reverseRate: 1.1560,
        effectiveDate: '2025-10-21',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date().toISOString(),
        change24h: 0.05
      },
      {
        id: 'ARF-004',
        sourceAsset: 'USD',
        destinationAsset: 'JPY',
        rate: 149.50,
        reverseRate: 0.0067,
        effectiveDate: '2025-10-20',
        status: 'INACTIVE',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        change24h: 0.50
      },
      {
        id: 'ARF-005',
        sourceAsset: 'GBP',
        destinationAsset: 'JPY',
        rate: 188.65,
        reverseRate: 0.0053,
        effectiveDate: '2025-10-21',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        updatedAt: new Date().toISOString(),
        change24h: 0.30
      }
    ]
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load asset rates'
  } finally {
    isLoading.value = false
  }
}

const filteredAndSortedRates = computed(() => {
  let result = assetRates.value

  if (filters.value.sourceAsset) {
    result = result.filter(r => r.sourceAsset === filters.value.sourceAsset)
  }

  if (filters.value.destinationAsset) {
    result = result.filter(r => r.destinationAsset === filters.value.destinationAsset)
  }

  if (filters.value.status) {
    result = result.filter(r => r.status === filters.value.status)
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(r => 
      r.id.toLowerCase().includes(search) || 
      r.sourceAsset.toLowerCase().includes(search) ||
      r.destinationAsset.toLowerCase().includes(search)
    )
  }

  result.sort((a, b) => {
    const aVal = a[sortBy.value]
    const bVal = b[sortBy.value]
    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    return sortOrder.value === 'asc' ? comparison : -comparison
  })

  return result
})

const uniqueSourceAssets = computed(() => [...new Set(assetRates.value.map(r => r.sourceAsset))])
const uniqueDestAssets = computed(() => [...new Set(assetRates.value.map(r => r.destinationAsset))])

const openForm = (rate?: any) => {
  selectedRate.value = rate
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  selectedRate.value = null
}

const handleSave = async () => {
  closeForm()
  await loadAssetRates()
}

const deleteRate = async (id: string) => {
  if (confirm('Are you sure you want to delete this rate?')) {
    try {
      assetRates.value = assetRates.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = 'Failed to delete rate'
    }
  }
}

const exportRates = () => {
  const csv = [
    ['ID', 'Source Asset', 'Destination Asset', 'Rate', 'Reverse Rate', 'Effective Date', 'Status', 'Created', 'Updated'],
    ...filteredAndSortedRates.value.map(r => [
      r.id, r.sourceAsset, r.destinationAsset, r.rate.toFixed(8), r.reverseRate.toFixed(8),
      r.effectiveDate, r.status, new Date(r.createdAt).toLocaleDateString(), new Date(r.updatedAt).toLocaleDateString()
    ])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `asset-rates-${new Date().toISOString()}.csv`
  link.click()
}

const getStatusColor = (status: string) => {
  return status === 'ACTIVE' ? 'text-green-600' : 'text-yellow-600'
}
</script>

<template>
  <div class="p-6">
    <Breadcrumb :items="[
      { label: 'Transactions', route: '/transactions' },
      { label: 'Asset Rates' }
    ]" />

    <div class="mt-6 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Asset Rates</h1>
      <div class="flex gap-2">
        <Button @click="showBulkUpload = true" variant="secondary">📤 Bulk Upload</Button>
        <Button @click="openForm" variant="primary">+ Add Rate</Button>
      </div>
    </div>

    <Alert v-if="error" type="error" class="mt-4">{{ error }}</Alert>

    <Card class="mt-6 p-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label class="text-sm font-medium text-gray-700">Search</label>
          <Input v-model="filters.search" placeholder="Search by ID or asset..." class="mt-1" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Source Asset</label>
          <select v-model="filters.sourceAsset" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Assets</option>
            <option v-for="asset in uniqueSourceAssets" :key="asset" :value="asset">{{ asset }}</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Destination Asset</label>
          <select v-model="filters.destinationAsset" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Assets</option>
            <option v-for="asset in uniqueDestAssets" :key="asset" :value="asset">{{ asset }}</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Status</label>
          <select v-model="filters.status" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div class="flex items-end">
          <Button @click="exportRates" variant="secondary" class="w-full">
            📥 Export
          </Button>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-8">
        <p class="text-gray-600">Loading rates...</p>
      </div>
      <div v-else-if="filteredAndSortedRates.length === 0" class="text-center py-8">
        <p class="text-gray-600">No rates found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-gray-900 cursor-pointer" @click="sortBy = 'id'; sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'">
                ID {{ sortBy === 'id' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
              </th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900 cursor-pointer" @click="sortBy = 'sourceAsset'; sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'">
                Source {{ sortBy === 'sourceAsset' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
              </th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900 cursor-pointer" @click="sortBy = 'destinationAsset'; sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'">
                Destination {{ sortBy === 'destinationAsset' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
              </th>
              <th class="px-4 py-3 text-right font-semibold text-gray-900 cursor-pointer" @click="sortBy = 'rate'; sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'">
                Rate {{ sortBy === 'rate' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
              </th>
              <th class="px-4 py-3 text-right font-semibold text-gray-900">Reverse Rate</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900">Effective Date</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
              <th class="px-4 py-3 text-right font-semibold text-gray-900">24h Change</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="rate in filteredAndSortedRates" :key="rate.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-900 font-medium">{{ rate.id }}</td>
              <td class="px-4 py-3 text-gray-900 font-semibold">{{ rate.sourceAsset }}</td>
              <td class="px-4 py-3 text-gray-900 font-semibold">{{ rate.destinationAsset }}</td>
              <td class="px-4 py-3 text-right text-gray-900 font-bold">{{ rate.rate.toFixed(8) }}</td>
              <td class="px-4 py-3 text-right text-gray-600">{{ rate.reverseRate.toFixed(8) }}</td>
              <td class="px-4 py-3 text-gray-600">{{ new Date(rate.effectiveDate).toLocaleDateString() }}</td>
              <td class="px-4 py-3">
                <span :class="`font-semibold ${getStatusColor(rate.status)}`">{{ rate.status }}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <span :class="`font-semibold ${rate.change24h > 0 ? 'text-green-600' : rate.change24h < 0 ? 'text-red-600' : 'text-gray-600'}`">
                  {{ rate.change24h > 0 ? '+' : '' }}{{ rate.change24h.toFixed(2) }}%
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <Button @click="openForm(rate)" variant="ghost" size="sm">Edit</Button>
                  <Button @click="deleteRate(rate.id)" variant="ghost" size="sm" class="text-red-600">Delete</Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <Modal v-if="showForm" :model-value="true" @update:model-value="closeForm" title="Asset Rate">
      <AssetRateForm :asset-rate="selectedRate" @save="handleSave" @close="closeForm" />
    </Modal>

    <Modal v-if="showBulkUpload" :model-value="true" @update:model-value="showBulkUpload = false" title="Bulk Upload Asset Rates">
      <!-- Bulk upload component will be used here -->
    </Modal>
  </div>
</template>
