<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Modal, Input, Alert, Card, Breadcrumb } from '@/components'
import { AccountForm, AccountsTable } from '@/components/accounts'
import { useAccountsStore, useLedgersStore, useUIStore, useOrganizationsStore } from '@/stores'
import type { Account, CreateAccountDto } from '@/types'

const router = useRouter()
const accountsStore = useAccountsStore()
const ledgersStore = useLedgersStore()
const uiStore = useUIStore()
const organizationsStore = useOrganizationsStore()

const showCreateModal = ref(false)
const showDeleteConfirm = ref(false)
const searchQuery = ref('')
const orgSearchQuery = ref('')
const ledgerSearchQuery = ref('')
const selectedOrgId = ref('')
const selectedLedgerId = ref('')
const filterStatus = ref<'ACTIVE' | 'INACTIVE' | ''>('')
const filterType = ref<string>('')
const sortBy = ref('createdAt')
const sortDir = ref<'asc' | 'desc'>('desc')
const pageSize = ref(10)
const currentPage = ref(1)
const selectedForDelete = ref<Account | null>(null)
const selectedForEdit = ref<Account | null>(null)
const isEditMode = ref(false)

const accountTypes = ['ASSET', 'LIABILITY', 'EQUITY']

const filteredItems = computed(() => {
  let items = [...accountsStore.items]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(
      account =>
        account.alias.toLowerCase().includes(query) ||
        account.accountName.toLowerCase().includes(query) ||
        account.id.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    items = items.filter(account => account.status === filterStatus.value)
  }

  if (filterLedger.value) {
    items = items.filter(account => account.ledgerId === filterLedger.value)
  }

  if (filterType.value) {
    items = items.filter(account => account.type === filterType.value)
  }

  // Sort
  items.sort((a, b) => {
    let aVal: any = (a as any)[sortBy.value]
    let bVal: any = (b as any)[sortBy.value]

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = (bVal as string).toLowerCase()
    }

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

const filteredOrganizations = computed(() => {
  if (!orgSearchQuery.value) return organizationsStore.items
  const query = orgSearchQuery.value.toLowerCase()
  return organizationsStore.items.filter(org => 
    org.legalName.toLowerCase().includes(query) || org.id.toLowerCase().includes(query)
  )
})

const filteredLedgers = computed(() => {
  if (!ledgerSearchQuery.value) return ledgersStore.items
  const query = ledgerSearchQuery.value.toLowerCase()
  return ledgersStore.items.filter(ledger => 
    ledger.name.toLowerCase().includes(query) || ledger.id.toLowerCase().includes(query)
  )
})

onMounted(() => {
  organizationsStore.fetch({ limit: 100 })
})

watch(selectedOrgId, async (newOrgId) => {
  if (newOrgId) {
    selectedLedgerId.value = ''
    await ledgersStore.fetch({ organizationId: newOrgId, limit: 100 })
  }
})

watch(selectedLedgerId, (newLedgerId) => {
  if (newLedgerId && selectedOrgId.value) {
    loadAccounts()
  }
})

const loadAccounts = async () => {
  if (!selectedOrgId.value || !selectedLedgerId.value) {
    uiStore.showToast('Please select organization and ledger first', 'warning')
    return
  }
  try {
    await accountsStore.fetch({ 
      organizationId: selectedOrgId.value, 
      ledgerId: selectedLedgerId.value, 
      limit: 100 
    })
  } catch (error) {
    console.error('Failed to load accounts:', error)
    uiStore.showToast('Failed to load accounts', 'error')
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  selectedForEdit.value = null
  isEditMode.value = false
}

const handleFormSubmit = async (payload: CreateAccountDto) => {
  try {
    if (isEditMode.value && selectedForEdit.value) {
      await accountsStore.update(selectedForEdit.value.id, payload)
      uiStore.showToast('Account updated successfully', 'success')
    } else {
      await accountsStore.create(payload)
      uiStore.showToast('Account created successfully', 'success')
    }
    closeCreateModal()
    await loadAccounts()
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Operation failed'
    uiStore.showToast(errorMsg, 'error')
    console.error('Error:', error)
  }
}

const viewDetail = (account: Account) => {
  router.push(`/onboarding/accounts/${account.id}`)
}

const editAccount = (account: Account) => {
  selectedForEdit.value = account
  isEditMode.value = true
  showCreateModal.value = true
}

const confirmDelete = (account: Account) => {
  selectedForDelete.value = account
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!selectedForDelete.value) return

  try {
    await accountsStore.delete(selectedForDelete.value.id)
    showDeleteConfirm.value = false
    selectedForDelete.value = null
    await loadAccounts()
    uiStore.showToast('Account deleted successfully', 'success')
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to delete account'
    uiStore.showToast(errorMsg, 'error')
    console.error('Error:', error)
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
          <h1 class="text-3xl font-bold text-gray-900">Accounts</h1>
          <p class="text-gray-600 mt-2">Manage financial accounts and track balances</p>
        </div>
        <Button @click="router.push('/accounts/create')" variant="primary" size="md">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Account
        </Button>
      </div>

      <!-- Organization & Ledger Selectors -->
      <Card class="p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Organization <span class="text-red-500">*</span>
            </label>
            <Input
              v-model="orgSearchQuery"
              type="text"
              placeholder="Search organizations..."
              class="mb-2"
            />
            <select
              v-model="selectedOrgId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an organization</option>
              <option v-for="org in filteredOrganizations" :key="org.id" :value="org.id">
                {{ org.legalName }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ledger <span class="text-red-500">*</span>
            </label>
            <Input
              v-model="ledgerSearchQuery"
              type="text"
              placeholder="Search ledgers..."
              class="mb-2"
              :disabled="!selectedOrgId"
            />
            <select
              v-model="selectedLedgerId"
              :disabled="!selectedOrgId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select a ledger</option>
              <option v-for="ledger in filteredLedgers" :key="ledger.id" :value="ledger.id">
                {{ ledger.name }}
              </option>
            </select>
          </div>
        </div>
      </Card>

      <!-- Search and Filters -->
      <Card v-if="selectedOrgId && selectedLedgerId" class="p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search by code, name, ID..."
          />
          <select
            v-model="filterStatus"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <select
            v-model="filterType"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option v-for="type in accountTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
          <Button @click="loadAccounts" variant="secondary" class="w-full">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </Card>

      <!-- Error Alert -->
      <Alert v-if="accountsStore.error" type="error" class="mb-6">
        {{ accountsStore.error }}
      </Alert>

      <!-- Table -->
      <Card v-if="selectedOrgId && selectedLedgerId" class="overflow-hidden">
        <AccountsTable
          :items="paginatedItems"
          :loading="accountsStore.loading"
          :sortBy="sortBy"
          :sortDir="sortDir"
          :page="currentPage"
          :pageSize="pageSize"
          :total="filteredItems.length"
          @sort="handleSort"
          @paginate="handlePaginate"
          @view="viewDetail"
          @edit="editAccount"
          @delete="confirmDelete"
        />
      </Card>
      <Card v-else class="p-8 text-center text-gray-500">
        <p>Please select an organization and ledger to view accounts</p>
      </Card>
    </div>

    <!-- Create/Edit Modal -->
    <Modal v-model="showCreateModal" :title="isEditMode ? 'Edit Account' : 'Create New Account'">
      <AccountForm
        :account="selectedForEdit"
        :isLoading="accountsStore.loading"
        :isEditing="isEditMode"
        @submit="handleFormSubmit"
        @cancel="closeCreateModal"
      />
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteConfirm" title="Delete Account">
      <div class="space-y-4">
        <p class="text-gray-600">
          Are you sure you want to delete <strong>{{ selectedForDelete?.alias }}</strong> ({{ selectedForDelete?.accountName }})?
        </p>
        <p class="text-sm text-gray-500">
          This action cannot be undone. All transaction history will be preserved but this account will no longer accept new transactions.
        </p>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button @click="showDeleteConfirm = false" variant="secondary">Cancel</Button>
          <Button @click="handleDelete" variant="danger" :disabled="accountsStore.loading">
            {{ accountsStore.loading ? 'Deleting...' : 'Delete' }}
          </Button>
        </div>
      </template>
    </Modal>
  </main>
</template>
