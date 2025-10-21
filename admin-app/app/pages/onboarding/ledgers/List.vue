<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Table, Modal, Input, Alert, Spinner, Card } from '@/components'
import { useLedgersStore } from '@/stores'
import type { Ledger } from '@/types'

const router = useRouter()
const ledgersStore = useLedgersStore()

const showCreateModal = ref(false)
const showDeleteConfirm = ref(false)
const searchQuery = ref('')
const pageSize = ref(10)
const currentPage = ref(1)
const selectedForDelete = ref<Ledger | null>(null)

const formData = ref({
  name: '',
  description: '',
  status: 'active' as const,
})

const columns = [
  { key: 'id', label: 'ID', width: '15%' },
  { key: 'name', label: 'Name', width: '25%' },
  { key: 'description', label: 'Description', width: '25%' },
  { key: 'status', label: 'Status', width: '15%' },
  { key: 'createdAt', label: 'Created', width: '15%' },
  { key: 'actions', label: 'Actions', width: '15%' },
]

const filteredItems = computed(() => {
  if (!searchQuery.value) return ledgersStore.items
  return ledgersStore.items.filter((ledger: Ledger) =>
    ledger.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    ledger.id.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / pageSize.value)
})

onMounted(() => {
  loadLedgers()
})

const loadLedgers = async () => {
  try {
    await ledgersStore.fetch({ limit: 100 })
  } catch (error) {
    console.error('Failed to load ledgers:', error)
  }
}

const openCreateModal = () => {
  formData.value = { name: '', description: '', status: 'active' }
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  formData.value = { name: '', description: '', status: 'active' }
}

const handleCreate = async () => {
  if (!formData.value.name.trim()) {
    alert('Ledger name is required')
    return
  }

  try {
    await ledgersStore.create({
      name: formData.value.name,
      description: formData.value.description,
      status: formData.value.status,
    })
    closeCreateModal()
    await loadLedgers()
  } catch (error) {
    console.error('Failed to create ledger:', error)
    alert('Failed to create ledger')
  }
}

const viewDetail = (ledger: Ledger) => {
  router.push(`/ledgers/${ledger.id}`)
}

const editLedger = (ledger: Ledger) => {
  router.push(`/ledgers/${ledger.id}?edit=true`)
}

const confirmDelete = (ledger: Ledger) => {
  selectedForDelete.value = ledger
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!selectedForDelete.value) return

  try {
    await ledgersStore.remove(selectedForDelete.value.id)
    showDeleteConfirm.value = false
    selectedForDelete.value = null
    await loadLedgers()
  } catch (error) {
    console.error('Failed to delete ledger:', error)
    alert('Failed to delete ledger')
  }
}

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}
</script>

<template>
  <main class="flex-1 overflow-auto">
    <div class="px-6 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Ledgers</h1>
          <p class="text-gray-600 mt-2">Manage your ledgers</p>
        </div>
        <Button @click="openCreateModal" variant="primary" size="md">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Ledger
        </Button>
      </div>

      <!-- Search and Filters -->
      <Card class="p-4 mb-6">
        <div class="flex gap-4">
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or ID..."
            class="flex-1"
          />
          <Button @click="loadLedgers" variant="secondary">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <!-- Loading State -->
      <div v-if="ledgersStore.loading" class="flex items-center justify-center py-12">
        <Spinner size="md" />
      </div>

      <!-- Table -->
      <Card v-else class="overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="column in columns"
                  :key="column.key"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  :style="{ width: column.width }"
                >
                  {{ column.label }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="paginatedItems.length === 0">
                <td :colspan="columns.length" class="px-6 py-8 text-center text-gray-500">
                  No ledgers found
                </td>
              </tr>
              <tr v-for="ledger in paginatedItems" :key="ledger.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ ledger.id.substring(0, 8) }}...
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ ledger.name }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 truncate">
                  {{ ledger.description || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      ledger.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{ ledger.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatDate(ledger.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex gap-2">
                    <button
                      @click="viewDetail(ledger)"
                      class="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      View
                    </button>
                    <button
                      @click="editLedger(ledger)"
                      class="text-yellow-600 hover:text-yellow-900 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      @click="confirmDelete(ledger)"
                      class="text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Showing {{ filteredItems.length ? (currentPage - 1) * pageSize + 1 : 0 }} to
            {{ Math.min(currentPage * pageSize, filteredItems.length) }} of {{ filteredItems.length }}
          </div>
          <div class="flex gap-2">
            <Button
              :disabled="currentPage === 1"
              @click="currentPage--"
              variant="secondary"
              size="sm"
            >
              Previous
            </Button>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
            </div>
            <Button
              :disabled="currentPage === totalPages"
              @click="currentPage++"
              variant="secondary"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- Create Modal -->
    <Modal v-model="showCreateModal" title="Create Ledger">
      <div class="space-y-4">
        <Input
          v-model="formData.name"
          label="Ledger Name"
          type="text"
          placeholder="Enter ledger name"
          required
        />
        <Input
          v-model="formData.description"
          label="Description"
          type="text"
          placeholder="Enter ledger description"
        />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="formData.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button @click="closeCreateModal" variant="secondary">Cancel</Button>
          <Button @click="handleCreate" variant="primary" :disabled="ledgersStore.loading">
            {{ ledgersStore.loading ? 'Creating...' : 'Create' }}
          </Button>
        </div>
      </template>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteConfirm" title="Delete Ledger">
      <div>
        <p class="text-gray-600">
          Are you sure you want to delete
          <strong>{{ selectedForDelete?.name }}</strong>
          ? This action cannot be undone.
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
