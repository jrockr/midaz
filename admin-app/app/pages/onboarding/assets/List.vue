<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Modal, Input, Alert, Card, Breadcrumb } from '@/components'
import { AssetForm, AssetsTable } from '@/components/assets'
import { useAssetsStore, useUIStore } from '@/stores'
import type { Asset, CreateAssetDto } from '@/types'

const router = useRouter()
const assetsStore = useAssetsStore()
const uiStore = useUIStore()

const showCreateModal = ref(false)
const showDeleteConfirm = ref(false)
const searchQuery = ref('')
const filterStatus = ref<'ACTIVE' | 'INACTIVE' | ''>('')
const filterType = ref<string>('')
const sortBy = ref('createdAt')
const sortDir = ref<'asc' | 'desc'>('desc')
const pageSize = ref(10)
const currentPage = ref(1)
const selectedForDelete = ref<Asset | null>(null)
const selectedForEdit = ref<Asset | null>(null)
const isEditMode = ref(false)

const assetTypes = ['CURRENCY', 'SECURITY', 'COMMODITY', 'CRYPTO', 'OTHER']

const filteredItems = computed(() => {
  let items = [...assetsStore.items]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(
      asset =>
        asset.code.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query) ||
        asset.id.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    items = items.filter(asset => asset.status === filterStatus.value)
  }

  if (filterType.value) {
    items = items.filter(asset => asset.type === filterType.value)
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

onMounted(() => {
  loadAssets()
})

const loadAssets = async () => {
  try {
    await assetsStore.fetch({ limit: 100 })
  } catch (error) {
    console.error('Failed to load assets:', error)
    uiStore.showToast('Failed to load assets', 'error')
  }
}

const openCreateModal = () => {
  selectedForEdit.value = null
  isEditMode.value = false
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  selectedForEdit.value = null
  isEditMode.value = false
}

const handleFormSubmit = async (payload: CreateAssetDto) => {
  try {
    if (isEditMode.value && selectedForEdit.value) {
      await assetsStore.update(selectedForEdit.value.id, payload)
      uiStore.showToast('Asset updated successfully', 'success')
    } else {
      await assetsStore.create(payload)
      uiStore.showToast('Asset created successfully', 'success')
    }
    closeCreateModal()
    await loadAssets()
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Operation failed'
    uiStore.showToast(errorMsg, 'error')
    console.error('Error:', error)
  }
}

const viewDetail = (asset: Asset) => {
  router.push(`/onboarding/assets/${asset.id}`)
}

const editAsset = (asset: Asset) => {
  selectedForEdit.value = asset
  isEditMode.value = true
  showCreateModal.value = true
}

const confirmDelete = (asset: Asset) => {
  selectedForDelete.value = asset
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!selectedForDelete.value) return

  try {
    await assetsStore.delete(selectedForDelete.value.id)
    showDeleteConfirm.value = false
    selectedForDelete.value = null
    await loadAssets()
    uiStore.showToast('Asset deleted successfully', 'success')
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to delete asset'
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
          <h1 class="text-3xl font-bold text-gray-900">Assets</h1>
          <p class="text-gray-600 mt-2">Manage currencies, securities, and other assets</p>
        </div>
        <Button @click="openCreateModal" variant="primary" size="md">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Asset
        </Button>
      </div>

      <!-- Search and Filters -->
      <Card class="p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search by code, name, or ID..."
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
            <option v-for="type in assetTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
          <Button @click="loadAssets" variant="secondary" class="w-full">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </Card>

      <!-- Error Alert -->
      <Alert v-if="assetsStore.error" type="error" class="mb-6">
        {{ assetsStore.error }}
      </Alert>

      <!-- Table -->
      <Card class="overflow-hidden">
        <AssetsTable
          :items="paginatedItems"
          :loading="assetsStore.loading"
          :sortBy="sortBy"
          :sortDir="sortDir"
          :page="currentPage"
          :pageSize="pageSize"
          :total="filteredItems.length"
          @sort="handleSort"
          @paginate="handlePaginate"
          @view="viewDetail"
          @edit="editAsset"
          @delete="confirmDelete"
        />
      </Card>
    </div>

    <!-- Create/Edit Modal -->
    <Modal v-model="showCreateModal" :title="isEditMode ? 'Edit Asset' : 'Create New Asset'">
      <AssetForm
        :asset="selectedForEdit"
        :isLoading="assetsStore.loading"
        :isEditing="isEditMode"
        @submit="handleFormSubmit"
        @cancel="closeCreateModal"
      />
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteConfirm" title="Delete Asset">
      <div class="space-y-4">
        <p class="text-gray-600">
          Are you sure you want to delete <strong>{{ selectedForDelete?.name }}</strong> ({{ selectedForDelete?.code }})?
        </p>
        <p class="text-sm text-gray-500">
          This action cannot be undone. Accounts using this asset may also be affected.
        </p>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button @click="showDeleteConfirm = false" variant="secondary">Cancel</Button>
          <Button @click="handleDelete" variant="danger" :disabled="assetsStore.loading">
            {{ assetsStore.loading ? 'Deleting...' : 'Delete' }}
          </Button>
        </div>
      </template>
    </Modal>
  </main>
</template>
