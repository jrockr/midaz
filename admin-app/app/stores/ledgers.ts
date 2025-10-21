import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ledgersService } from '../api/services/ledgers'

export const useLedgersStore = defineStore('ledgers', () => {
  const items = ref([])
  const selectedId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetch = async (params?: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await ledgersService.list(params)
      items.value = response.data || []
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch ledgers'
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await ledgersService.create(payload)
      items.value.push(response)
      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to create ledger'
      return null
    } finally {
      loading.value = false
    }
  }

  const getById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await ledgersService.getById(id)
      selectedId.value = id
      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch ledger'
      return null
    } finally {
      loading.value = false
    }
  }

  const update = async (id: string, payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await ledgersService.update(id, payload)
      const index = items.value.findIndex((item: any) => item.id === id)
      if (index !== -1) {
        items.value[index] = response
      }
      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to update ledger'
      return null
    } finally {
      loading.value = false
    }
  }

  const remove = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await ledgersService.delete(id)
      items.value = items.value.filter((item: any) => item.id !== id)
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to delete ledger'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    selectedId,
    loading,
    error,
    fetch,
    create,
    getById,
    update,
    remove,
  }
})
