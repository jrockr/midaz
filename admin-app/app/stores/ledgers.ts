import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ledgersService } from '../api/services/ledgers'

export const useLedgersStore = defineStore('ledgers', () => {
  const items = ref([])
  const selectedId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetch = async (params?: { organizationId: string; limit?: number; offset?: number }) => {
    if (!params?.organizationId) {
      error.value = 'Organization ID is required'
      return
    }
    loading.value = true
    error.value = null
    try {
      const response = await ledgersService.list(params.organizationId, params)
      items.value = response.items || []
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch ledgers'
    } finally {
      loading.value = false
    }
  }

  const fetchAll = fetch

  const create = async (organizationId: string, payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await ledgersService.create(organizationId, payload)
      items.value.push(response)
      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to create ledger'
      return null
    } finally {
      loading.value = false
    }
  }

  const getById = async (organizationId: string, id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await ledgersService.getById(organizationId, id)
      selectedId.value = id
      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch ledger'
      return null
    } finally {
      loading.value = false
    }
  }

  const update = async (organizationId: string, id: string, payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await ledgersService.update(organizationId, id, payload)
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

  const remove = async (organizationId: string, id: string) => {
    loading.value = true
    error.value = null
    try {
      await ledgersService.delete(organizationId, id)
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
    fetchAll,
    create,
    getById,
    update,
    remove,
    delete: remove,
  }
})
