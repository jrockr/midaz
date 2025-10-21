import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Portfolio } from '@/types'

interface PortfolioWithAccounts extends Portfolio {
  accountsCount?: number
  linkedAccounts?: string[]
}

export const usePortfoliosStore = defineStore('portfolios', () => {
  const items = ref<PortfolioWithAccounts[]>([])
  const currentPortfolio = ref<PortfolioWithAccounts | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const linkedAccounts = ref<Map<string, string[]>>(new Map())

  // Computed
  const total = computed(() => items.value.length)

  // Getters
  const getItemById = (id: string) => {
    return items.value.find(item => item.id === id)
  }

  const getLinkedAccounts = (portfolioId: string) => {
    return linkedAccounts.value.get(portfolioId) || []
  }

  // Actions - Fetch
  const fetchAll = async (params?: { limit?: number; page?: number }) => {
    loading.value = true
    error.value = null
    try {
      // Mock API call - replace with actual API
      items.value = [
        {
          id: 'ptf-001',
          name: 'Retail Portfolio',
          code: 'RTL-01',
          description: 'Portfolio for retail transactions',
          status: 'ACTIVE',
          organizationId: 'org-001',
          accountsCount: 5,
          linkedAccounts: ['acc-001', 'acc-002'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
      return items.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch portfolios'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetch = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const portfolio = items.value.find(item => item.id === id)
      if (!portfolio) {
        // Mock API call - replace with actual API
        currentPortfolio.value = {
          id,
          name: 'Sample Portfolio',
          code: 'SPL-01',
          description: 'A sample portfolio',
          status: 'ACTIVE',
          organizationId: 'org-001',
          accountsCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      } else {
        currentPortfolio.value = portfolio
      }
      return currentPortfolio.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch portfolio'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Create
  const create = async (data: Partial<PortfolioWithAccounts>) => {
    loading.value = true
    error.value = null
    try {
      const newPortfolio: PortfolioWithAccounts = {
        id: `ptf-${Date.now()}`,
        name: data.name || '',
        code: data.code || '',
        description: data.description,
        status: data.status || 'ACTIVE',
        organizationId: data.organizationId || '',
        accountsCount: 0,
        linkedAccounts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: data.metadata,
      }
      items.value.push(newPortfolio)
      return newPortfolio
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create portfolio'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Update
  const update = async (id: string, data: Partial<PortfolioWithAccounts>) => {
    loading.value = true
    error.value = null
    try {
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = { ...items.value[index], ...data, updatedAt: new Date().toISOString() }
        return items.value[index]
      }
      throw new Error('Portfolio not found')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update portfolio'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Delete
  const remove = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value.splice(index, 1)
        linkedAccounts.value.delete(id)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete portfolio'
      throw err
    } finally {
      loading.value = false
    }
  }

  const delete_: typeof remove = remove

  // Actions - Account Linking
  const linkAccount = async (portfolioId: string, accountId: string) => {
    loading.value = true
    error.value = null
    try {
      const portfolio = items.value.find(item => item.id === portfolioId)
      if (!portfolio) throw new Error('Portfolio not found')

      const linked = linkedAccounts.value.get(portfolioId) || []
      if (!linked.includes(accountId)) {
        linked.push(accountId)
        linkedAccounts.value.set(portfolioId, linked)
        portfolio.accountsCount = (portfolio.accountsCount || 0) + 1
        portfolio.linkedAccounts = linked
      }
      return linked
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to link account'
      throw err
    } finally {
      loading.value = false
    }
  }

  const unlinkAccount = async (portfolioId: string, accountId: string) => {
    loading.value = true
    error.value = null
    try {
      const portfolio = items.value.find(item => item.id === portfolioId)
      if (!portfolio) throw new Error('Portfolio not found')

      const linked = linkedAccounts.value.get(portfolioId) || []
      const index = linked.indexOf(accountId)
      if (index !== -1) {
        linked.splice(index, 1)
        linkedAccounts.value.set(portfolioId, linked)
        portfolio.accountsCount = Math.max(0, (portfolio.accountsCount || 1) - 1)
        portfolio.linkedAccounts = linked
      }
      return linked
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to unlink account'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getLinkedAccountsList = async (portfolioId: string) => {
    try {
      return getLinkedAccounts(portfolioId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch linked accounts'
      throw err
    }
  }

  return {
    // State
    items,
    currentPortfolio,
    loading,
    error,
    linkedAccounts,
    // Computed
    total,
    // Getters
    getItemById,
    getLinkedAccounts,
    // Actions
    fetchAll,
    fetch,
    create,
    update,
    remove,
    delete: delete_,
    linkAccount,
    unlinkAccount,
    getLinkedAccountsList,
  }
})
