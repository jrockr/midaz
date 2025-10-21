import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { accountsService } from '../api/services/accounts'
import type { Account, CreateAccountDto, UpdateAccountDto, PaginationState } from '../types'

export const useAccountsStore = defineStore('accounts', () => {
  // State
  const items = ref<Account[]>([])
  const selectedId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PaginationState>({
    limit: 10,
    offset: 0,
    total: 0,
  })

  // Getters
  const selected = computed(() => items.value.find((account) => account.id === selectedId.value))
  const isEmpty = computed(() => items.value.length === 0)
  const hasMore = computed(() => pagination.value.offset + pagination.value.limit < pagination.value.total)

  // Actions
  const fetch = async (params?: { limit?: number; offset?: number; search?: string; ledgerId?: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await accountsService.list(params)
      items.value = response.data || []
      if (response.pagination) {
        pagination.value = response.pagination
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch accounts'
      error.value = errorMessage
      console.error('Fetch accounts error:', err)
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: CreateAccountDto): Promise<Account | null> => {
    loading.value = true
    error.value = null
    try {
      const response = await accountsService.create(payload)
      items.value.push(response)
      pagination.value.total += 1
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account'
      error.value = errorMessage
      console.error('Create account error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const getById = async (id: string): Promise<Account | null> => {
    loading.value = true
    error.value = null
    try {
      const response = await accountsService.getById(id)
      selectedId.value = id
      const index = items.value.findIndex((account) => account.id === id)
      if (index !== -1) {
        items.value[index] = response
      } else {
        items.value.push(response)
      }
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch account'
      error.value = errorMessage
      console.error('Get account error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const update = async (id: string, payload: UpdateAccountDto): Promise<Account | null> => {
    loading.value = true
    error.value = null
    try {
      const response = await accountsService.update(id, payload)
      const index = items.value.findIndex((account) => account.id === id)
      if (index !== -1) {
        items.value[index] = response
      }
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update account'
      error.value = errorMessage
      console.error('Update account error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const delete_ = async (id: string): Promise<boolean> => {
    loading.value = true
    error.value = null
    try {
      await accountsService.delete(id)
      items.value = items.value.filter((account) => account.id !== id)
      pagination.value.total -= 1
      return true
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete account'
      error.value = errorMessage
      console.error('Delete account error:', err)
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
