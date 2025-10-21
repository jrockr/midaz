<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Modal, Input, Alert, Card, Breadcrumb } from '@/components'
import { LedgerForm, LedgersTable } from '@/components/ledgers'
import { useLedgersStore, useUIStore, useOrganizationsStore } from '@/stores'
import type { Ledger, CreateLedgerDto } from '@/types'

const router = useRouter()
const ledgersStore = useLedgersStore()
const uiStore = useUIStore()
const organizationsStore = useOrganizationsStore()

const showCreateModal = ref(false)
const showDeleteConfirm = ref(false)
const searchQuery = ref('')
const orgSearchQuery = ref('')
const selectedOrgId = ref('')
const filterStatus = ref<'ACTIVE' | 'INACTIVE' | ''>('')
const sortBy = ref('createdAt')
const sortDir = ref<'asc' | 'desc'>('desc')
const pageSize = ref(10)
const currentPage = ref(1)
const selectedForDelete = ref<Ledger | null>(null)
const selectedForEdit = ref<Ledger | null>(null)
const isEditMode = ref(false)

const filteredItems = computed(() => {
  let items = [...ledgersStore.items]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(
      ledger =>
        ledger.name.toLowerCase().includes(query) ||
        ledger.id.toLowerCase().includes(query) ||
        (ledger.code && ledger.code.toLowerCase().includes(query))
    )
  }

  if (filterStatus.value) {
    items = items.filter(ledger => ledger.status === filterStatus.value)
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
    org.name.toLowerCase().includes(query) || 
    org.id.toLowerCase().includes(query)
  )
})

onMounted(() => {
  organizationsStore.fetch({ limit: 100 })
})

watch(selectedOrgId, (newOrgId) => {
  if (newOrgId) {
    loadLedgers()
  }
})

const loadLedgers = async () => {
  if (!selectedOrgId.value) {
    uiStore.showToast('Please select an organization first', 'warning')
    return
  }
  try {
    await ledgersStore.fetch({ organizationId: selectedOrgId.value, limit: 100 })
  } catch (error) {
    console.error('Failed to load ledgers:', error)
    uiStore.showToast('Failed to load ledgers', 'error')
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  selectedForEdit.value = null
  isEditMode.value = false
}

const handleFormSubmit = async (payload: CreateLedgerDto) => {
  try {
    if (isEditMode.value && selectedForEdit.value) {
      await ledgersStore.update(selectedForEdit.value.id, payload)
      uiStore.showToast('Ledger updated successfully', 'success')
    } else {
      await ledgersStore.create(payload)
      uiStore.showToast('Ledger created successfully', 'success')
    }
    closeCreateModal()
    await loadLedgers()
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Operation failed'
    uiStore.showToast(errorMsg, 'error')
    console.error('Error:', error)
  }
}

const viewDetail = (ledger: Ledger) => {
  router.push(`/onboarding/ledgers/${ledger.id}`)
}

const editLedger = (ledger: Ledger) => {
  selectedForEdit.value = ledger
  isEditMode.value = true
  showCreateModal.value = true
}

const confirmDelete = (ledger: Ledger) => {
  selectedForDelete.value = ledger
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!selectedForDelete.value) return

  try {
    await ledgersStore.delete(selectedForDelete.value.id)
    showDeleteConfirm.value = false
    selectedForDelete.value = null
    await loadLedgers()
    uiStore.showToast('Ledger deleted successfully', 'success')
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to delete ledger'
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
          <h1 class="text-3xl font-bold text-gray-900">Ledgers</h1>
          <p class="text-gray-600 mt-2">Manage financial ledgers and accounts</p>
        </div>
        <Button @click="router.push('/ledgers/create')" variant="primary" size="md">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Ledger
        </Button>
      </div>

      <!-- Organization Selector -->
      <Card class="p-4 mb-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Organization <span class="text-red-500">*</span>
            </label>
            <div class="relative">
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
                  {{ org.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <!-- Search and Filters -->
      <Card v-if="selectedOrgId" class="p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, ID, or code..."
          />
          <select
            v-model="filterStatus"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <Button @click="loadLedgers" variant="secondary" class="w-full">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </Card>

      <!-- Error Alert -->
      <Alert v-if="ledgersStore.error" type="error" class="mb-6">
        {{ ledgersStore.error }}
      </Alert>

      <!-- Table -->
      <Card v-if="selectedOrgId" class="overflow-hidden">
        <LedgersTable
          :items="paginatedItems"
          :loading="ledgersStore.loading"
          :sortBy="sortBy"
          :sortDir="sortDir"
          :page="currentPage"
          :pageSize="pageSize"
          :total="filteredItems.length"
          @sort="handleSort"
          @paginate="handlePaginate"
          @view="viewDetail"
          @edit="editLedger"
          @delete="confirmDelete"
        />
      </Card>
      <Card v-else class="p-8 text-center text-gray-500">
        <p>Please select an organization to view ledgers</p>
      </Card>
    </div>

    <!-- Create/Edit Modal -->
    <Modal v-model="showCreateModal" :title="isEditMode ? 'Edit Ledger' : 'Create New Ledger'">
      <LedgerForm
        :ledger="selectedForEdit"
        :isLoading="ledgersStore.loading"
        :isEditing="isEditMode"
        @submit="handleFormSubmit"
        @cancel="closeCreateModal"
      />
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteConfirm" title="Delete Ledger">
      <div class="space-y-4">
        <p class="text-gray-600">
          Are you sure you want to delete <strong>{{ selectedForDelete?.name }}</strong>?
        </p>
        <p class="text-sm text-gray-500">
          This action cannot be undone. All accounts in this ledger may also be affected.
        </p>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button @click="showDeleteConfirm = false" variant="secondary">Cancel</Button>
          <Button @click="handleDelete" variant="danger" :disabled="ledgersStore.loading">
            {{ ledgersStore.loading ? 'Deleting...' : 'Delete' }}
          </Button>
        </div>
      </template>
    </Modal>
  </main>
</template>
