<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Table, Modal, Input, Alert, Spinner, Card } from '@/components'
import { useOrganizationsStore } from '@/stores'
import OrganizationForm from '@/components/organizations/OrganizationForm.vue'
import type { Organization, CreateOrganizationDto } from '@/types'

const router = useRouter()
const organizationsStore = useOrganizationsStore()

const showCreateModal = ref(false)
const showDeleteConfirm = ref(false)
const searchQuery = ref('')
const pageSize = ref(10)
const currentPage = ref(1)
const selectedForDelete = ref<Organization | null>(null)
const isCreating = ref(false)

const columns = [
  { key: 'id', label: 'ID', width: '15%' },
  { key: 'legalName', label: 'Legal Name', width: '25%' },
  { key: 'doingBusinessAs', label: 'DBA', width: '20%' },
  { key: 'status', label: 'Status', width: '15%' },
  { key: 'createdAt', label: 'Created', width: '15%' },
  { key: 'actions', label: 'Actions', width: '10%' },
]

const filteredItems = computed(() => {
  if (!searchQuery.value) return organizationsStore.items
  const query = searchQuery.value.toLowerCase()
  return organizationsStore.items.filter((org: Organization) =>
    org.legalName.toLowerCase().includes(query) ||
    org.doingBusinessAs?.toLowerCase().includes(query) ||
    org.id.toLowerCase().includes(query)
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
  loadOrganizations()
})

const loadOrganizations = async () => {
  try {
    await organizationsStore.fetch({ limit: 100 })
  } catch (error) {
    console.error('Failed to load organizations:', error)
  }
}

const openCreateModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const handleCreateSubmit = async (payload: CreateOrganizationDto) => {
  isCreating.value = true
  try {
    await organizationsStore.create(payload)
    closeCreateModal()
    await loadOrganizations()
  } catch (error) {
    console.error('Failed to create organization:', error)
    organizationsStore.error = 'Failed to create organization'
  } finally {
    isCreating.value = false
  }
}

const viewDetail = (org: Organization) => {
  router.push(`/organizations/${org.id}`)
}

const editOrganization = (org: Organization) => {
  router.push(`/organizations/${org.id}?edit=true`)
}

const confirmDelete = (org: Organization) => {
  selectedForDelete.value = org
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!selectedForDelete.value) return

  try {
    await organizationsStore.remove(selectedForDelete.value.id)
    showDeleteConfirm.value = false
    selectedForDelete.value = null
    await loadOrganizations()
  } catch (error) {
    console.error('Failed to delete organization:', error)
    organizationsStore.error = 'Failed to delete organization'
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
          <h1 class="text-3xl font-bold text-gray-900">Organizations</h1>
          <p class="text-gray-600 mt-2">Manage your organizations</p>
        </div>
        <Button @click="openCreateModal" variant="primary" size="md">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Organization
        </Button>
      </div>

      <!-- Search and Filters -->
      <Card class="p-4 mb-6">
        <div class="flex gap-4">
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, DBA, or ID..."
          />
          <Button @click="loadOrganizations" variant="secondary">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </Card>

      <!-- Error Alert -->
      <Alert v-if="organizationsStore.error" type="error" class="mb-6">
        {{ organizationsStore.error }}
      </Alert>

      <!-- Loading State -->
      <div v-if="organizationsStore.loading" class="flex items-center justify-center py-12">
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
                  No organizations found
                </td>
              </tr>
              <tr v-for="org in paginatedItems" :key="org.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ org.id.substring(0, 8) }}...
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ org.legalName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ org.doingBusinessAs || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      org.status?.code === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{ org.status?.code || 'UNKNOWN' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatDate(org.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex gap-2">
                    <button
                      @click="viewDetail(org)"
                      class="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      View
                    </button>
                    <button
                      @click="editOrganization(org)"
                      class="text-yellow-600 hover:text-yellow-900 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      @click="confirmDelete(org)"
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
    <Modal v-model="showCreateModal" title="Create Organization" size="lg">
      <OrganizationForm
        :is-loading="isCreating"
        @submit="handleCreateSubmit"
        @cancel="closeCreateModal"
      />
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteConfirm" title="Delete Organization">
      <div>
        <p class="text-gray-600">
          Are you sure you want to delete
          <strong>{{ selectedForDelete?.legalName }}</strong>
          ? This action cannot be undone.
        </p>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button @click="showDeleteConfirm = false" variant="secondary">Cancel</Button>
          <Button @click="handleDelete" variant="danger" :disabled="organizationsStore.loading">
            {{ organizationsStore.loading ? 'Deleting...' : 'Delete' }}
          </Button>
        </div>
      </template>
    </Modal>
  </main>
</template>
