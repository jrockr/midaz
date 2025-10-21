<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/transactionStore'
import { useUIStore } from '@/stores'
import { Button, Modal, Input, Alert, Card, Breadcrumb } from '@/components'
import { TransactionBatch, BatchStatus } from '@/components/transactions'
import type { Transaction } from '@/types'

const router = useRouter()
const transactionStore = useTransactionStore()
const uiStore = useUIStore()

const batchName = ref('')
const batchDescription = ref('')
const uploadedFile = ref<File | null>(null)
const showBatchModal = ref(false)
const selectedBatch = ref<any>(null)
const showBatchDetailsModal = ref(false)
const isProcessing = ref(false)
const batches = ref<any[]>([])

const sortBy = ref('createdAt')
const sortDir = ref<'asc' | 'desc'>('desc')
const pageSize = ref(10)
const currentPage = ref(1)

const sortedBatches = computed(() => {
  const sorted = [...batches.value]
  sorted.sort((a, b) => {
    let aVal: any = (a as any)[sortBy.value]
    let bVal: any = (b as any)[sortBy.value]
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortDir.value === 'asc' ? comparison : -comparison
  })
  return sorted
})

const paginatedBatches = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedBatches.value.slice(start, end)
})

onMounted(() => {
  loadBatches()
})

const loadBatches = async () => {
  try {
    // API call would go here
    batches.value = transactionStore.batches || []
  } catch (error) {
    console.error('Failed to load batches:', error)
    uiStore.showToast('Failed to load batches', 'error')
  }
}

const openCreateModal = () => {
  batchName.value = ''
  batchDescription.value = ''
  uploadedFile.value = null
  showBatchModal.value = true
}

const closeCreateModal = () => {
  showBatchModal.value = false
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    uploadedFile.value = target.files[0]
  }
}

const handleCreateBatch = async () => {
  if (!batchName.value.trim()) {
    uiStore.showToast('Please enter a batch name', 'error')
    return
  }

  if (!uploadedFile.value) {
    uiStore.showToast('Please upload a file', 'error')
    return
  }

  isProcessing.value = true
  try {
    const formData = new FormData()
    formData.append('name', batchName.value)
    formData.append('description', batchDescription.value)
    formData.append('file', uploadedFile.value)

    // API call would go here
    await transactionStore.createBatch(formData)
    
    uiStore.showToast('Batch created successfully', 'success')
    closeCreateModal()
    await loadBatches()
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to create batch'
    uiStore.showToast(errorMsg, 'error')
  } finally {
    isProcessing.value = false
  }
}

const viewBatchDetails = (batch: any) => {
  selectedBatch.value = batch
  showBatchDetailsModal.value = true
}

const closeBatchDetailsModal = () => {
  showBatchDetailsModal.value = false
  selectedBatch.value = null
}

const handleRetryBatch = async () => {
  if (!selectedBatch.value) return

  isProcessing.value = true
  try {
    await transactionStore.retryBatch(selectedBatch.value.id)
    uiStore.showToast('Batch retry initiated', 'success')
    closeBatchDetailsModal()
    await loadBatches()
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to retry batch'
    uiStore.showToast(errorMsg, 'error')
  } finally {
    isProcessing.value = false
  }
}

const handleCancelBatch = async () => {
  if (!selectedBatch.value) return

  isProcessing.value = true
  try {
    await transactionStore.cancelBatch(selectedBatch.value.id)
    uiStore.showToast('Batch cancelled', 'success')
    closeBatchDetailsModal()
    await loadBatches()
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to cancel batch'
    uiStore.showToast(errorMsg, 'error')
  } finally {
    isProcessing.value = false
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'DRAFT': 'bg-gray-100 text-gray-800',
    'UPLOADING': 'bg-blue-100 text-blue-800',
    'VALIDATING': 'bg-purple-100 text-purple-800',
    'PROCESSING': 'bg-yellow-100 text-yellow-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'FAILED': 'bg-red-100 text-red-800',
    'PARTIAL': 'bg-orange-100 text-orange-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const handleSort = (column: string, direction: 'asc' | 'desc') => {
  sortBy.value = column
  sortDir.value = direction
  currentPage.value = 1
}

const handlePaginate = (page: number) => {
  currentPage.value = page
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
          <h1 class="text-3xl font-bold text-gray-900">Batch Processing</h1>
          <p class="text-gray-600 mt-2">Upload and process multiple transactions</p>
        </div>
        <Button @click="openCreateModal" variant="primary" size="md">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Batch
        </Button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card class="p-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ batches.length }}</div>
            <p class="text-gray-600 text-sm mt-1">Total Batches</p>
          </div>
        </Card>
        <Card class="p-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ batches.filter(b => b.status === 'COMPLETED').length }}
            </div>
            <p class="text-gray-600 text-sm mt-1">Completed</p>
          </div>
        </Card>
        <Card class="p-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">
              {{ batches.filter(b => b.status === 'PROCESSING').length }}
            </div>
            <p class="text-gray-600 text-sm mt-1">Processing</p>
          </div>
        </Card>
        <Card class="p-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">
              {{ batches.filter(b => b.status === 'FAILED').length }}
            </div>
            <p class="text-gray-600 text-sm mt-1">Failed</p>
          </div>
        </Card>
      </div>

      <!-- Batches Table -->
      <Card class="overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failed</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="batch in paginatedBatches" :key="batch.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ batch.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`">
                    {{ batch.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ batch.totalCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                  {{ batch.successCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                  {{ batch.failureCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ new Date(batch.createdAt).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="viewBatchDetails(batch)"
                    class="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- Pagination -->
      <div v-if="batches.length > pageSize" class="mt-4 flex justify-center">
        <button
          v-for="page in Math.ceil(batches.length / pageSize)"
          :key="page"
          @click="handlePaginate(page)"
          :class="page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'"
          class="px-3 py-1 mx-1 rounded"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- Create Batch Modal -->
    <Modal v-model="showBatchModal" title="Create New Batch">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Batch Name <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="batchName"
            type="text"
            placeholder="e.g., Daily Transactions Batch"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            v-model="batchDescription"
            rows="3"
            placeholder="Add notes about this batch..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Upload File <span class="text-red-500">*</span>
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              @change="handleFileUpload"
              accept=".csv,.xlsx,.json"
              class="hidden"
              id="batch-file"
            />
            <label
              for="batch-file"
              class="cursor-pointer flex flex-col items-center"
            >
              <svg class="h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span class="text-sm text-gray-600">
                {{ uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop' }}
              </span>
              <span class="text-xs text-gray-500 mt-1">CSV, XLSX, or JSON</span>
            </label>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button @click="closeCreateModal" variant="secondary">Cancel</Button>
          <Button
            @click="handleCreateBatch"
            variant="primary"
            :disabled="isProcessing"
          >
            {{ isProcessing ? 'Creating...' : 'Create Batch' }}
          </Button>
        </div>
      </template>
    </Modal>

    <!-- Batch Details Modal -->
    <Modal v-model="showBatchDetailsModal" title="Batch Details" size="lg">
      <div v-if="selectedBatch" class="space-y-6">
        <BatchStatus :batch="selectedBatch" />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Total Transactions</label>
            <p class="text-2xl font-bold text-gray-900">{{ selectedBatch.totalCount }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Successful</label>
            <p class="text-2xl font-bold text-green-600">{{ selectedBatch.successCount }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Failed</label>
            <p class="text-2xl font-bold text-red-600">{{ selectedBatch.failureCount }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Success Rate</label>
            <p class="text-2xl font-bold text-blue-600">
              {{ selectedBatch.totalCount > 0 ? Math.round((selectedBatch.successCount / selectedBatch.totalCount) * 100) : 0 }}%
            </p>
          </div>
        </div>

        <TransactionBatch :batch-id="selectedBatch.id" />
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button @click="closeBatchDetailsModal" variant="secondary">Close</Button>
          <Button
            v-if="selectedBatch?.status === 'FAILED' || selectedBatch?.status === 'PARTIAL'"
            @click="handleRetryBatch"
            variant="primary"
            :disabled="isProcessing"
          >
            {{ isProcessing ? 'Retrying...' : 'Retry Failed' }}
          </Button>
          <Button
            v-if="selectedBatch?.status === 'PROCESSING'"
            @click="handleCancelBatch"
            variant="danger"
            :disabled="isProcessing"
          >
            {{ isProcessing ? 'Cancelling...' : 'Cancel Batch' }}
          </Button>
        </div>
      </template>
    </Modal>
  </main>
</template>
