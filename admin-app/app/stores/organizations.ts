import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { organizationsService } from '../api/services/organizations'
import type { Organization, CreateOrganizationDto, UpdateOrganizationDto, PaginationState } from '../types'

export const useOrganizationsStore = defineStore('organizations', () => {
  // State
  const items = ref<Organization[]>([])
  const selectedId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PaginationState>({
    limit: 10,
    offset: 0,
    total: 0,
  })

  // Getters
  const selected = computed(() => items.value.find((org) => org.id === selectedId.value))
  const isEmpty = computed(() => items.value.length === 0)
  const hasMore = computed(() => pagination.value.offset + pagination.value.limit < pagination.value.total)

  // Actions
  const fetch = async (params?: { limit?: number; offset?: number; search?: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await organizationsService.list(params)
      items.value = response.data || []
      if (response.pagination) {
        pagination.value = response.pagination
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch organizations'
      error.value = errorMessage
      console.error('Fetch organizations error:', err)
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: CreateOrganizationDto): Promise<Organization | null> => {
    loading.value = true
    error.value = null
    try {
      const response = await organizationsService.create(payload)
      items.value.push(response)
      // Increment total count
      pagination.value.total += 1
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create organization'
      error.value = errorMessage
      console.error('Create organization error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const getById = async (id: string): Promise<Organization | null> => {
    loading.value = true
    error.value = null
    try {
      const response = await organizationsService.getById(id)
      selectedId.value = id
      // Update in items if exists, otherwise add
      const index = items.value.findIndex((org) => org.id === id)
      if (index !== -1) {
        items.value[index] = response
      } else {
        items.value.push(response)
      }
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch organization'
      error.value = errorMessage
      console.error('Get organization error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const update = async (id: string, payload: UpdateOrganizationDto): Promise<Organization | null> => {
    loading.value = true
    error.value = null
    try {
      const response = await organizationsService.update(id, payload)
      const index = items.value.findIndex((org) => org.id === id)
      if (index !== -1) {
        items.value[index] = response
      }
      if (selectedId.value === id) {
        selectedId.value = id // Trigger update
      }
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update organization'
      error.value = errorMessage
      console.error('Update organization error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const remove = async (id: string): Promise<boolean> => {
    loading.value = true
    error.value = null
    try {
      await organizationsService.delete(id)
      items.value = items.value.filter((org) => org.id !== id)
      pagination.value.total -= 1
      if (selectedId.value === id) {
        selectedId.value = null
      }
      return true
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete organization'
      error.value = errorMessage
      console.error('Delete organization error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const select = (id: string | null) => {
    selectedId.value = id
  }

  const clearError = () => {
    error.value = null
  }

  const setPagination = (limit: number, offset: number) => {
    pagination.value.limit = limit
    pagination.value.offset = offset
  }

  const reset = () => {
    items.value = []
    selectedId.value = null
    loading.value = false
    error.value = null
    pagination.value = {
      limit: 10,
      offset: 0,
      total: 0,
    }
  }

  return {
    // State
    items,
    selectedId,
    loading,
    error,
    pagination,

    // Getters
    selected,
    isEmpty,
    hasMore,

    // Actions
    fetch,
    create,
    getById,
    update,
    remove,
    select,
    clearError,
    setPagination,
    reset,
  }
})
