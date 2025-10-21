<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Button, Modal, Card, Breadcrumb } from '@/components'
import type { Account } from '@/types'

const accounts = ref<any[]>([])
const isLoading = ref(false)
const selectedAccount = ref<any | null>(null)
const showReconcileModal = ref(false)
const reconciliationData = ref({
  systemBalance: 0,
  actualBalance: 0,
  difference: 0,
  notes: ''
})

const onHoldBalance = ref(0)
const availableBalance = ref(0)
const totalBalance = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

const filteredAccounts = computed(() => {
  return accounts.value.filter(account => 
    account.status !== 'DELETED' && account.status !== 'ARCHIVED'
  )
})

const paginatedAccounts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAccounts.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredAccounts.value.length / pageSize.value))

onMounted(() => {
  loadAccounts()
})

const loadAccounts = async () => {
  isLoading.value = true
  try {
    // API call would go here
    accounts.value = []
  } catch (error) {
    console.error('Failed to load accounts:', error)
  } finally {
    isLoading.value = false
  }
}

const openReconcile = (account: any) => {
  selectedAccount.value = account
  reconciliationData.value = {
    systemBalance: account.balance || 0,
    actualBalance: 0,
    difference: 0,
    notes: ''
  }
  showReconcileModal.value = true
}

const closeReconcile = () => {
  showReconcileModal.value = false
  selectedAccount.value = null
}

const handleReconcile = async () => {
  if (!selectedAccount.value) return

  try {
    reconciliationData.value.difference = 
      reconciliationData.value.actualBalance - reconciliationData.value.systemBalance

    // API call would go here
    closeReconcile()
    await loadAccounts()
  } catch (error) {
    console.error('Failed to reconcile:', error)
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'ACTIVE': 'bg-green-100 text-green-800',
    'INACTIVE': 'bg-gray-100 text-gray-800',
    'RECONCILING': 'bg-yellow-100 text-yellow-800',
    'RECONCILED': 'bg-blue-100 text-blue-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
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
          <h1 class="text-3xl font-bold text-gray-900">Balance Reconciliation</h1>
          <p class="text-gray-600 mt-2">Reconcile account balances and manage discrepancies</p>
        </div>
        <Button @click="loadAccounts" variant="secondary" size="md">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card class="p-6">
          <div class="text-center">
            <label class="text-xs text-gray-500 uppercase font-semibold">Total Balances</label>
            <div class="text-3xl font-bold text-gray-900 mt-2">{{ totalBalance.toLocaleString() }}</div>
            <p class="text-sm text-gray-600 mt-2">Across {{ filteredAccounts.length }} accounts</p>
          </div>
        </Card>
        <Card class="p-6">
          <div class="text-center">
            <label class="text-xs text-gray-500 uppercase font-semibold">On-Hold Amount</label>
            <div class="text-3xl font-bold text-orange-600 mt-2">{{ onHoldBalance.toLocaleString() }}</div>
            <p class="text-sm text-gray-600 mt-2">Frozen for pending transactions</p>
          </div>
        </Card>
        <Card class="p-6">
          <div class="text-center">
            <label class="text-xs text-gray-500 uppercase font-semibold">Available Balance</label>
            <div class="text-3xl font-bold text-green-600 mt-2">{{ availableBalance.toLocaleString() }}</div>
            <p class="text-sm text-gray-600 mt-2">Ready for transactions</p>
          </div>
        </Card>
      </div>

      <!-- Accounts Table -->
      <Card class="overflow-hidden">
        <div v-if="isLoading" class="p-6 text-center">
          <p class="text-gray-600">Loading accounts...</p>
        </div>
        <div v-else-if="paginatedAccounts.length === 0" class="p-6 text-center">
          <p class="text-gray-600">No accounts found</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Hold</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="account in paginatedAccounts" :key="account.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p class="font-medium text-gray-900">{{ account.alias || account.id }}</p>
                    <p class="text-sm text-gray-600">{{ account.accountName }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ account.type || 'ASSET' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ (account.balance || 0).toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                  {{ (account.onHold || 0).toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                  {{ ((account.balance || 0) - (account.onHold || 0)).toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.reconciliationStatus || 'ACTIVE')}`">
                    {{ account.reconciliationStatus || 'ACTIVE' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="openReconcile(account)"
                    class="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Reconcile
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-4 flex justify-center">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="handlePageChange(page)"
          :class="page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'"
          class="px-3 py-1 mx-1 rounded"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- Reconciliation Modal -->
    <Modal v-model="showReconcileModal" title="Reconcile Account Balance" size="lg">
      <div v-if="selectedAccount" class="space-y-6">
        <!-- Account Info -->
        <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Account</label>
            <p class="text-lg font-semibold text-gray-900">{{ selectedAccount.alias || selectedAccount.id }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Type</label>
            <p class="text-lg font-semibold text-gray-900">{{ selectedAccount.type }}</p>
          </div>
        </div>

        <!-- Reconciliation Form -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              System Balance
            </label>
            <input
              :value="reconciliationData.systemBalance"
              disabled
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
            <p class="text-xs text-gray-500 mt-1">Current balance in system</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Actual Balance <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="reconciliationData.actualBalance"
              type="number"
              placeholder="Enter the actual balance"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">Balance verified from external source</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Difference
            </label>
            <div :class="`px-3 py-2 border rounded-lg text-center font-semibold ${
              reconciliationData.difference === 0 ? 'bg-green-50 text-green-700 border-green-300' :
              reconciliationData.difference > 0 ? 'bg-blue-50 text-blue-700 border-blue-300' :
              'bg-red-50 text-red-700 border-red-300'
            }`">
              {{ reconciliationData.difference > 0 ? '+' : '' }}{{ reconciliationData.difference.toLocaleString() }}
            </div>
            <p class="text-xs text-gray-500 mt-1">Difference between actual and system</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Reconciliation Notes
            </label>
            <textarea
              v-model="reconciliationData.notes"
              rows="4"
              placeholder="Add notes about this reconciliation..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Reconciliation Summary -->
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-gray-700">
            <strong>Reconciliation Status:</strong>
            <span v-if="reconciliationData.difference === 0" class="text-green-600 font-semibold">✓ Balanced</span>
            <span v-else class="text-orange-600 font-semibold">⚠ Discrepancy Detected</span>
          </p>
          <p v-if="reconciliationData.difference !== 0" class="text-sm text-gray-600 mt-2">
            A discrepancy of {{ Math.abs(reconciliationData.difference) }} has been detected and will require attention.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button @click="closeReconcile" variant="secondary">Cancel</Button>
          <Button @click="handleReconcile" variant="primary">
            Submit Reconciliation
          </Button>
        </div>
      </template>
    </Modal>
  </main>
</template>
