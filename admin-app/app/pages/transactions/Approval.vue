<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/transactionStore'
import { useUIStore } from '@/stores'
import { Button, Modal, Input, Alert, Card, Breadcrumb } from '@/components'
import { TransactionApproval, TransactionPreview, TransactionEventLog } from '@/components/transactions'
import type { Transaction } from '@/types'

const router = useRouter()
const transactionStore = useTransactionStore()
const uiStore = useUIStore()

const searchQuery = ref('')
const filterStatus = ref<'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | ''>('')
const sortBy = ref('createdAt')
const sortDir = ref<'asc' | 'desc'>('desc')
const pageSize = ref(10)
const currentPage = ref(1)
const selectedForReview = ref<Transaction | null>(null)
const showReviewModal = ref(false)
const approvalComment = ref('')
const rejectionReason = ref('')
const isProcessing = ref(false)

const filteredItems = computed(() => {
  let items = [...transactionStore.transactions].filter(t => 
    t.status === 'PENDING_APPROVAL' || 
    t.status === 'APPROVED' || 
    t.status === 'REJECTED'
  )

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(transaction =>
      transaction.id.toLowerCase().includes(query) ||
      transaction.type.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    items = items.filter(t => t.status === filterStatus.value)
  }

  items.sort((a, b) => {
    let aVal: any = (a as any)[sortBy.value]
    let bVal: any = (b as any)[sortBy.value]
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortDir.value === 'asc' ? comparison : -comparison
  })

  return items
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

onMounted(() => {
  loadTransactions()
})

const loadTransactions = async () => {
  try {
    await transactionStore.fetchTransactions()
  } catch (error) {
    console.error('Failed to load transactions:', error)
    uiStore.showToast('Failed to load transactions', 'error')
  }
}

const openReviewModal = (transaction: Transaction) => {
  selectedForReview.value = transaction
  approvalComment.value = ''
  rejectionReason.value = ''
  showReviewModal.value = true
}

const closeReviewModal = () => {
  showReviewModal.value = false
  selectedForReview.value = null
  approvalComment.value = ''
  rejectionReason.value = ''
}

const handleApprove = async () => {
  if (!selectedForReview.value) return

  isProcessing.value = true
  try {
    // API call would go here
    await transactionStore.approveTransaction(selectedForReview.value.id, {
      comment: approvalComment.value
    })
    uiStore.showToast('Transaction approved successfully', 'success')
    closeReviewModal()
    await loadTransactions()
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to approve transaction'
    uiStore.showToast(errorMsg, 'error')
  } finally {
    isProcessing.value = false
  }
}

const handleReject = async () => {
  if (!selectedForReview.value || !rejectionReason.value.trim()) {
    uiStore.showToast('Please provide a rejection reason', 'error')
    return
  }

  isProcessing.value = true
  try {
    await transactionStore.rejectTransaction(selectedForReview.value.id, {
      reason: rejectionReason.value
    })
    uiStore.showToast('Transaction rejected', 'success')
    closeReviewModal()
    await loadTransactions()
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to reject transaction'
    uiStore.showToast(errorMsg, 'error')
  } finally {
    isProcessing.value = false
  }
}

const handleSort = (column: string, direction: 'asc' | 'desc') => {
  sortBy.value = column
  sortDir.value = direction
  currentPage.value = 1
}

const handlePaginate = (page: number) => {
  currentPage.value = page
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'PENDING_APPROVAL': 'bg-yellow-100 text-yellow-800',
    'APPROVED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'PROCESSING': 'bg-blue-100 text-blue-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'FAILED': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
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
          <h1 class="text-3xl font-bold text-gray-900">Transaction Approvals</h1>
          <p class="text-gray-600 mt-2">Review and approve pending transactions</p>
        </div>
        <Button @click="loadTransactions" variant="secondary" size="md">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>

      <!-- Filters -->
      <Card class="p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search by ID or type..."
          />
          <select
            v-model="filterStatus"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <div />
        </div>
      </Card>

      <!-- Status Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card class="p-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">
              {{ filteredItems.filter(t => t.status === 'PENDING_APPROVAL').length }}
            </div>
            <p class="text-gray-600 text-sm mt-1">Pending Review</p>
          </div>
        </Card>
        <Card class="p-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ filteredItems.filter(t => t.status === 'APPROVED').length }}
            </div>
            <p class="text-gray-600 text-sm mt-1">Approved</p>
          </div>
        </Card>
        <Card class="p-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">
              {{ filteredItems.filter(t => t.status === 'REJECTED').length }}
            </div>
            <p class="text-gray-600 text-sm mt-1">Rejected</p>
          </div>
        </Card>
      </div>

      <!-- Transactions Table -->
      <Card class="overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="transaction in paginatedItems" :key="transaction.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ transaction.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ transaction.type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ transaction.amount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(transaction.status)}`">
                    {{ transaction.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ new Date(transaction.createdAt).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="openReviewModal(transaction)"
                    class="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Review
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- Pagination -->
      <div v-if="filteredItems.length > pageSize" class="mt-4 flex justify-center">
        <button
          v-for="page in Math.ceil(filteredItems.length / pageSize)"
          :key="page"
          @click="handlePaginate(page)"
          :class="page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'"
          class="px-3 py-1 mx-1 rounded"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- Review Modal -->
    <Modal v-model="showReviewModal" title="Review Transaction">
      <div v-if="selectedForReview" class="space-y-6">
        <!-- Transaction Preview -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
          <TransactionPreview :transaction="selectedForReview" />
        </div>

        <!-- Event Log -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Event Log</h3>
          <TransactionEventLog :transaction-id="selectedForReview.id" />
        </div>

        <!-- Approval/Rejection Form -->
        <div v-if="selectedForReview.status === 'PENDING_APPROVAL'" class="space-y-4 border-t pt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Approval Comment (Optional)
            </label>
            <textarea
              v-model="approvalComment"
              rows="3"
              placeholder="Add any notes about this approval..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason (if rejecting)
            </label>
            <textarea
              v-model="rejectionReason"
              rows="3"
              placeholder="Explain why you're rejecting this transaction..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button @click="closeReviewModal" variant="secondary">Cancel</Button>
          <Button
            v-if="selectedForReview?.status === 'PENDING_APPROVAL'"
            @click="handleReject"
            variant="danger"
            :disabled="isProcessing"
          >
            {{ isProcessing ? 'Processing...' : 'Reject' }}
          </Button>
          <Button
            v-if="selectedForReview?.status === 'PENDING_APPROVAL'"
            @click="handleApprove"
            variant="primary"
            :disabled="isProcessing"
          >
            {{ isProcessing ? 'Processing...' : 'Approve' }}
          </Button>
        </div>
      </template>
    </Modal>
  </main>
</template>
