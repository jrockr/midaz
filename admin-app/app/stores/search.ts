import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const results = ref<any[]>([])
  const savedSearches = ref<any[]>([])
  const searchHistory = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const performSearch = async (criteria: any) => {
    try {
      isLoading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Simulate search results
      results.value = [
        {
          id: 'RESULT-001',
          type: 'TRANSACTION',
          title: 'Transaction TXN-12345',
          description: 'Transfer from Account A to Account B',
          metadata: 'Amount: $1,000.00',
          relevance: 95
        },
        {
          id: 'RESULT-002',
          type: 'ACCOUNT',
          title: 'Account ACC-001',
          description: 'Primary checking account',
          metadata: 'Balance: $50,000.00',
          relevance: 85
        }
      ]

      // Add to history
      searchHistory.value.unshift({
        query: criteria.query,
        timestamp: new Date().toISOString(),
        resultCount: results.value.length
      })

      return results.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Search failed'
      console.error('Search error:', e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const saveSearch = async (name: string, criteria: any) => {
    try {
      isLoading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const search = {
        id: `SEARCH-${Date.now()}`,
        name,
        criteria,
        createdAt: new Date().toISOString()
      }
      
      savedSearches.value.push(search)
      return search
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to save search'
      console.error('Save search error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const loadSavedSearch = async (id: string) => {
    const search = savedSearches.value.find(s => s.id === id)
    if (search) {
      return performSearch(search.criteria)
    }
    return []
  }

  const deleteSavedSearch = (id: string) => {
    const idx = savedSearches.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      savedSearches.value.splice(idx, 1)
    }
  }

  return {
    results,
    savedSearches,
    searchHistory,
    isLoading,
    error,
    performSearch,
    saveSearch,
    loadSavedSearch,
    deleteSavedSearch
  }
})

export const useBalanceStore = defineStore('balance', () => {
  const accounts = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchAccounts = async () => {
    try {
      isLoading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Simulate fetching accounts
      accounts.value = [
        {
          id: 'ACC-001',
          alias: 'Main Account',
          accountName: 'Primary Business Account',
          type: 'ASSET',
          balance: 50000,
          onHold: 5000,
          status: 'ACTIVE',
          reconciliationStatus: 'RECONCILED'
        },
        {
          id: 'ACC-002',
          alias: 'Reserve Account',
          accountName: 'Emergency Reserve',
          type: 'ASSET',
          balance: 25000,
          onHold: 0,
          status: 'ACTIVE',
          reconciliationStatus: 'ACTIVE'
        }
      ]
      
      return accounts.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch accounts'
      console.error('Fetch accounts error:', e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const reconcileAccount = async (accountId: string, data: any) => {
    try {
      isLoading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const idx = accounts.value.findIndex(a => a.id === accountId)
      if (idx === -1) throw new Error('Account not found')
      
      accounts.value[idx] = {
        ...accounts.value[idx],
        reconciliationStatus: data.difference === 0 ? 'RECONCILED' : 'RECONCILING'
      }
      
      return accounts.value[idx]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to reconcile account'
      console.error('Reconcile account error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const getTotalBalance = (): number => {
    return accounts.value.reduce((total, acc) => total + acc.balance, 0)
  }

  const getOnHoldAmount = (): number => {
    return accounts.value.reduce((total, acc) => total + acc.onHold, 0)
  }

  const getAvailableBalance = (): number => {
    return getTotalBalance() - getOnHoldAmount()
  }

  return {
    accounts,
    isLoading,
    error,
    fetchAccounts,
    reconcileAccount,
    getTotalBalance,
    getOnHoldAmount,
    getAvailableBalance
  }
})
