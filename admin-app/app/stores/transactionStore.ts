import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Transaction {
  id: string
  type: 'SIMPLE' | 'COMPLEX' | 'DSL' | 'TEMPLATE'
  sources: Array<{ accountId: string; amount: number; asset: string }>
  destinations: Array<{ accountId: string; amount: number }>
  metadata?: Record<string, any>
  status: 'DRAFT' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  createdAt: string
  updatedAt: string
}

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Mock data for development
  const mockTransactions: Transaction[] = [
    {
      id: 'TXN-001',
      type: 'SIMPLE',
      sources: [{ accountId: 'ACC-001', amount: 1000, asset: 'USD' }],
      destinations: [{ accountId: 'ACC-002', amount: 1000 }],
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'TXN-002',
      type: 'COMPLEX',
      sources: [
        { accountId: 'ACC-001', amount: 500, asset: 'USD' },
        { accountId: 'ACC-003', amount: 500, asset: 'USD' }
      ],
      destinations: [
        { accountId: 'ACC-002', amount: 600 },
        { accountId: 'ACC-004', amount: 400 }
      ],
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  const fetchTransactions = async () => {
    try {
      loading.value = true
      error.value = null
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      transactions.value = mockTransactions
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch transactions'
    } finally {
      loading.value = false
    }
  }

  const createTransaction = async (transaction: Omit<Transaction, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    try {
      loading.value = true
      error.value = null
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newTxn: Transaction = {
        ...transaction,
        id: `TXN-${Date.now()}`,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      transactions.value.push(newTxn)
      return newTxn
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create transaction'
      throw e
    } finally {
      loading.value = false
    }
  }

  const getTransaction = (id: string) => {
    return transactions.value.find(t => t.id === id)
  }

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const idx = transactions.value.findIndex(t => t.id === id)
      if (idx === -1) throw new Error('Transaction not found')
      
      transactions.value[idx] = {
        ...transactions.value[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update transaction'
      throw e
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      const idx = transactions.value.findIndex(t => t.id === id)
      if (idx === -1) throw new Error('Transaction not found')
      transactions.value.splice(idx, 1)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete transaction'
      throw e
    }
  }

  // Approval operations
  const approveTransaction = async (id: string, data: any) => {
    try {
      loading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const idx = transactions.value.findIndex(t => t.id === id)
      if (idx === -1) throw new Error('Transaction not found')
      
      transactions.value[idx] = {
        ...transactions.value[idx],
        status: 'PROCESSING',
        updatedAt: new Date().toISOString()
      }
      return transactions.value[idx]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to approve transaction'
      throw e
    } finally {
      loading.value = false
    }
  }

  const rejectTransaction = async (id: string, data: any) => {
    try {
      loading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const idx = transactions.value.findIndex(t => t.id === id)
      if (idx === -1) throw new Error('Transaction not found')
      
      transactions.value[idx] = {
        ...transactions.value[idx],
        status: 'FAILED',
        updatedAt: new Date().toISOString()
      }
      return transactions.value[idx]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to reject transaction'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Batch operations
  const batches = ref<any[]>([])

  const createBatch = async (formData: FormData) => {
    try {
      loading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const batch = {
        id: `BATCH-${Date.now()}`,
        name: formData.get('name') || 'Batch Upload',
        status: 'VALIDATING',
        totalCount: 0,
        successCount: 0,
        failureCount: 0,
        createdAt: new Date().toISOString()
      }
      
      batches.value.push(batch)
      return batch
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create batch'
      throw e
    } finally {
      loading.value = false
    }
  }

  const retryBatch = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const idx = batches.value.findIndex(b => b.id === id)
      if (idx === -1) throw new Error('Batch not found')
      
      batches.value[idx] = {
        ...batches.value[idx],
        status: 'PROCESSING'
      }
      return batches.value[idx]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to retry batch'
      throw e
    } finally {
      loading.value = false
    }
  }

  const cancelBatch = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const idx = batches.value.findIndex(b => b.id === id)
      if (idx === -1) throw new Error('Batch not found')
      
      batches.value[idx] = {
        ...batches.value[idx],
        status: 'CANCELLED'
      }
      return batches.value[idx]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to cancel batch'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    transactions,
    batches,
    loading,
    error,

    // Computed
    transactionCount: computed(() => transactions.value.length),
    pendingTransactions: computed(() => transactions.value.filter(t => t.status === 'PENDING')),
    pendingApprovals: computed(() => transactions.value.filter(t => t.status === 'PENDING')),
    completedTransactions: computed(() => transactions.value.filter(t => t.status === 'COMPLETED')),

    // Methods
    fetchTransactions,
    createTransaction,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    approveTransaction,
    rejectTransaction,
    createBatch,
    retryBatch,
    cancelBatch
  }
})
