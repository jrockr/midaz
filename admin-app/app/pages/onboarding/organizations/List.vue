<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Modal, Input, Alert, Card, Breadcrumb } from '@/components'
import { OrganizationForm, OrganizationsTable } from '@/components/organizations'
import { useOrganizationsStore, useUIStore } from '@/stores'
import type { Organization, CreateOrganizationDto } from '@/types'

const router = useRouter()
const organizationsStore = useOrganizationsStore()
const uiStore = useUIStore()

const showCreateModal = ref(false)
const showDeleteConfirm = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const sortBy = ref('createdAt')
const sortDir = ref<'asc' | 'desc'>('desc')
const selectedForDelete = ref<Organization | null>(null)

const pageSize = 10

const filteredItems = computed(() => {
  if (!searchQuery.value) return organizationsStore.items
  const query = searchQuery.value.toLowerCase()
  return organizationsStore.items.filter((org: Organization) =>
    org.name.toLowerCase().includes(query) ||
    org.id.toLowerCase().includes(query) ||
    (org.code && org.code.toLowerCase().includes(query))
  )
})

const sortedItems = computed(() => {
  const items = [...filteredItems.value]
  items.sort((a, b) => {
    const aVal = a[sortBy.value as keyof Organization] ?? ''
    const bVal = b[sortBy.value as keyof Organization] ?? ''
    const cmp = String(aVal).localeCompare(String(bVal))
    return sortDir.value === 'asc' ? cmp : -cmp
  })
  return items
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return sortedItems.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(sortedItems.value.length / pageSize)
})

onMounted(() => {
  loadOrganizations()
})

const loadOrganizations = async () => {
  try {
    await organizationsStore.fetch({ limit: 100 })
  } catch (error) {
    console.error('Failed to load organizations:', error)
    uiStore.showToast('Failed to load organizations', 'error')
  }
}

const handleCreateSubmit = async (formData: CreateOrganizationDto) => {
  try {
    await organizationsStore.create(formData)
    showCreateModal.value = false
    currentPage.value = 1
    await loadOrganizations()
    uiStore.showToast('Organization created successfully', 'success')
  } catch (error) {
    console.error('Failed to create organization:', error)
    uiStore.showToast('Failed to create organization', 'error')
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
    if (paginatedItems.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }
    await loadOrganizations()
    uiStore.showToast('Organization deleted successfully', 'success')
  } catch (error) {
    console.error('Failed to delete organization:', error)
    uiStore.showToast('Failed to delete organization', 'error')
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
          <h1 class="text-3xl font-bold text-gray-900">Organizations</h1>
          <p class="text-gray-600 mt-2">Manage your organizations and their settings</p>
        </div>
        <Button @click="showCreateModal = true" variant="primary" size="md">
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
            placeholder="Search by name, ID, or code..."
            class="flex-1"
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

      <!-- Organizations Table -->
      <Card class="overflow-hidden">
        <OrganizationsTable
          :organizations="paginatedItems"
          :loading="organizationsStore.loading"
          :sort-by="sortBy"
          :sort-dir="sortDir"
          :page="currentPage"
          :page-size="pageSize"
          :total="sortedItems.length"
          @sort="handleSort"
          @paginate="handlePaginate"
          @view="viewDetail"
          @edit="editOrganization"
          @delete="confirmDelete"
        />
      </Card>
    </div>

    <!-- Create Organization Modal -->
    <Modal v-model="showCreateModal" title="Create Organization">
      <OrganizationForm
        :is-loading="organizationsStore.loading"
        :is-editing="false"
        @submit="handleCreateSubmit"
        @cancel="showCreateModal = false"
      />
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteConfirm" title="Delete Organization">
      <div>
        <Alert type="warning" class="mb-4">
          <strong>Warning:</strong> This action cannot be undone. All associated data may be affected.
        </Alert>
        <p class="text-gray-600">
          Are you sure you want to delete
          <strong class="text-gray-900">{{ selectedForDelete?.name }}</strong>
          ?
        </p>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button @click="showDeleteConfirm = false" variant="secondary">Cancel</Button>
          <Button
            @click="handleDelete"
            variant="danger"
            :disabled="organizationsStore.loading"
          >
            {{ organizationsStore.loading ? 'Deleting...' : 'Delete Organization' }}
          </Button>
        </div>
      </template>
    </Modal>
  </main>
</template>
