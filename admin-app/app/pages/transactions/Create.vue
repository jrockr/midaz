<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/transactionStore'
import TransactionBuilder from '@/components/transactions/TransactionBuilder.vue'

const router = useRouter()
const store = useTransactionStore()

interface Transaction {
  type: 'SIMPLE' | 'COMPLEX' | 'DSL' | 'TEMPLATE'
  sources: Array<{ accountId: string; amount: number; asset: string }>
  destinations: Array<{ accountId: string; amount: number }>
  metadata: Record<string, any>
}

const handleSubmit = async (transaction: Transaction) => {
  try {
    const created = await store.createTransaction({
      ...transaction,
      metadata: transaction.metadata || {}
    })
    
    // Show success message
    console.log('Transaction created:', created)
    
    // Redirect to transaction detail
    await router.push(`/transactions/${created.id}`)
  } catch (error) {
    console.error('Error creating transaction:', error)
  }
}
</script>

<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <TransactionBuilder @submit="handleSubmit" />
    </div>
  </div>
</template>
