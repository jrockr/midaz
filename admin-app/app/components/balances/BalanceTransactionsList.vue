<script setup lang="ts">
interface Props {
  transactions?: Array<{
    id: string
    date: string
    type: 'DEBIT' | 'CREDIT'
    amount: number
    description: string
  }>
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  isLoading: false
})

const mockTransactions = [
  { id: 'TXN-001', date: '2025-10-21', type: 'CREDIT' as const, amount: 5000, description: 'Deposit' },
  { id: 'TXN-002', date: '2025-10-20', type: 'DEBIT' as const, amount: 2000, description: 'Withdrawal' },
  { id: 'TXN-003', date: '2025-10-19', type: 'CREDIT' as const, amount: 1500, description: 'Interest' }
]

const transactionList = (transactions && transactions.length > 0) ? transactions : mockTransactions

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-6">Recent Transactions</h3>
    
    <div v-if="isLoading" class="text-center py-8">
      <p class="text-gray-600">Loading transactions...</p>
    </div>
    <div v-else-if="transactionList.length === 0" class="text-center py-8">
      <p class="text-gray-600">No transactions</p>
    </div>
    <div v-else class="space-y-3">
      <div v-for="txn in transactionList" :key="txn.id" class="flex items-center justify-between py-3 border-b last:border-b-0">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900">{{ txn.description }}</p>
          <p class="text-xs text-gray-600">{{ txn.id }} · {{ txn.date }}</p>
        </div>
        <span :class="`font-semibold ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`">
          {{ txn.type === 'CREDIT' ? '+' : '-' }}{{ formatCurrency(txn.amount) }}
        </span>
      </div>
    </div>
  </div>
</template>
