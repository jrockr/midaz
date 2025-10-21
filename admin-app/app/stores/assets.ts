import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { assetsService } from '../api/services/assets'
import type { Asset, CreateAssetDto, UpdateAssetDto, PaginationState } from '../types'

export const useAssetsStore = defineStore('assets', () => {
  // State
  const items = ref<Asset[]>([])
  const selectedId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PaginationState>({
    limit: 10,
    offset: 0,
    total: 0,
  })

  // Getters
  const selected = computed(() => items.value.find((asset) => asset.id === selectedId.value))
  const isEmpty = computed(() => items.value.length === 0)
  const hasMore = computed(() => pagination.value.offset + pagination.value.limit < pagination.value.total)

  // Actions
  const fetch = async (params?: { organizationId: string; ledgerId: string; limit?: number; offset?: number; search?: string }) => {
    if (!params?.organizationId || !params?.ledgerId) {
      error.value = 'Organization ID and Ledger ID are required'
      return
    }
    loading.value = true
    error.value = null
    try {
      const response = await assetsService.list(params.organizationId, params.ledgerId, params)
      items.value = response.data || []
      if (response.pagination) {
        pagination.value = response.pagination
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assets'
      error.value = errorMessage
      console.error('Fetch assets error:', err)
    } finally {
      loading.value = false
    }
  }

  const create = async (organizationId: string, ledgerId: string, payload: CreateAssetDto): Promise<Asset | null> => {
    loading.value = true
    error.value = null
    try {
      const response = await assetsService.create(organizationId, ledgerId, payload)
      items.value.push(response)
      pagination.value.total += 1
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create asset'
      error.value = errorMessage
      console.error('Create asset error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const getById = async (organizationId: string, ledgerId: string, id: string): Promise<Asset | null> => {
    loading.value = true
    error.value = null
    try {
      const response = await assetsService.getById(organizationId, ledgerId, id)
      selectedId.value = id
      const index = items.value.findIndex((asset) => asset.id === id)
      if (index !== -1) {
        items.value[index] = response
      } else {
        items.value.push(response)
      }
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch asset'
      error.value = errorMessage
      console.error('Get asset error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const update = async (organizationId: string, ledgerId: string, id: string, payload: UpdateAssetDto): Promise<Asset | null> => {
    loading.value = true
    error.value = null
    try {
      const response = await assetsService.update(organizationId, ledgerId, id, payload)
      const index = items.value.findIndex((asset) => asset.id === id)
      if (index !== -1) {
        items.value[index] = response
      }
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update asset'
      error.value = errorMessage
      console.error('Update asset error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const delete_ = async (organizationId: string, ledgerId: string, id: string): Promise<boolean> => {
    loading.value = true
    error.value = null
    try {
      await assetsService.delete(organizationId, ledgerId, id)
      items.value = items.value.filter((asset) => asset.id !== id)
      pagination.value.total -= 1
      return true
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete asset'
      error.value = errorMessage
      console.error('Delete asset error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const clearSelection = () => {
    selectedId.value = null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    items,
    selectedId,
    selected,
    loading,
    error,
    isEmpty,
    hasMore,
    pagination,
    fetch,
    create,
    getById,
    update,
    delete: delete_,
    clearSelection,
    clearError,
  }
})
