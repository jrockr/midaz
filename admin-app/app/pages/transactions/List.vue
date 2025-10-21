<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useTransactionStore()
const searchQuery = ref('')
const filterStatus = ref('')

onMounted(async () => {
  await store.fetchTransactions()
})

const filteredTransactions = computed(() => {
  let result = store.transactions

  if (searchQuery.value) {
    result = result.filter(t => 
      t.id.includes(searchQuery.value) || 
      t.type.includes(searchQuery.value)
    )
  }

  if (filterStatus.value) {
    result = result.filter(t => t.status === filterStatus.value)
  }

  return result
})

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'DRAFT': 'bg-gray-100 text-gray-800',
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'PROCESSING': 'bg-blue-100 text-blue-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'FAILED': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    'SIMPLE': '→',
    'COMPLEX': '⇄',
    'DSL': '{}',
    'TEMPLATE': '⚙'
  }
  return icons[type] || '?'
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatAmount = (sources: any[]) => {
  const total = sources.reduce((sum, s) => sum + (s.amount || 0), 0)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(total)
}
</script>

<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Transactions</h1>
          <p class="text-gray-600 mt-1">Manage and monitor all financial transactions</p>
        </div>
        <button
          @click="router.push('/transactions/create')"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + New Transaction
        </button>
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by ID or type..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <select
            v-model="filterStatus"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div v-if="filteredTransactions.length === 0" class="p-12 text-center">
          <div class="text-gray-500 text-lg mb-4">No transactions found</div>
          <button
            @click="router.push('/transactions/create')"
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first transaction →
          </button>
        </div>

        <table v-else class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="transaction in filteredTransactions"
              :key="transaction.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 text-sm font-mono text-gray-900">
                {{ transaction.id }}
              </td>
              <td class="px-6 py-4 text-sm">
                <span class="flex items-center gap-2">
                  <span class="text-lg">{{ getTypeIcon(transaction.type) }}</span>
                  {{ transaction.type }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-semibold text-gray-900">
                {{ formatAmount(transaction.sources) }}
              </td>
              <td class="px-6 py-4 text-sm">
                <span :class="['inline-block px-3 py-1 rounded-full text-xs font-medium', getStatusColor(transaction.status)]">
                  {{ transaction.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDate(transaction.createdAt) }}
              </td>
              <td class="px-6 py-4 text-sm">
                <button
                  @click="router.push(`/transactions/${transaction.id}`)"
                  class="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <p class="text-sm text-gray-600 mb-2">Total Transactions</p>
          <p class="text-3xl font-bold text-gray-900">{{ store.transactionCount }}</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <p class="text-sm text-gray-600 mb-2">Pending</p>
          <p class="text-3xl font-bold text-yellow-600">{{ store.pendingTransactions.length }}</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <p class="text-sm text-gray-600 mb-2">Completed</p>
          <p class="text-3xl font-bold text-green-600">{{ store.completedTransactions.length }}</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <p class="text-sm text-gray-600 mb-2">Filters Applied</p>
          <p class="text-3xl font-bold text-blue-600">{{ (searchQuery || filterStatus) ? 1 : 0 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
