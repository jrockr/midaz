<script setup lang="ts">
import { computed } from 'vue'

interface Transaction {
  type?: string
  sources?: Array<{ accountId: string; amount: number; asset: string }>
  destinations?: Array<{ accountId: string; amount: number; asset?: string }>
  metadata?: Record<string, any>
}

const props = defineProps<{
  transaction: Transaction
}>()

const totalIn = computed(() => {
  return props.transaction.sources?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0
})

const totalOut = computed(() => {
  return props.transaction.destinations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0
})

const isBalanced = computed(() => {
  return Math.abs(totalIn.value - totalOut.value) < 0.01
})

const getAsset = computed(() => {
  return props.transaction.sources?.[0]?.asset || 'USD'
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: getAsset.value
  }).format(amount)
}
</script>

<template>
  <div class="transaction-preview space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
      <h2 class="text-2xl font-bold mb-2">Transaction Preview</h2>
      <p class="text-blue-100">Review before submitting</p>
    </div>

    <!-- Transaction Type -->
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <div class="flex justify-between items-center">
        <span class="text-sm font-medium text-gray-600">Type</span>
        <span class="text-lg font-semibold text-gray-900">{{ transaction.type || 'Not selected' }}</span>
      </div>
    </div>

    <!-- Sources & Destinations Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Sources -->
      <div>
        <h3 class="font-semibold text-gray-900 mb-3">Sources</h3>
        <div class="space-y-2">
          <div
            v-if="!transaction.sources || transaction.sources.length === 0"
            class="text-sm text-gray-500 italic"
          >
            No sources selected
          </div>
          <div
            v-for="(source, idx) in transaction.sources"
            :key="`source-${idx}`"
            class="bg-red-50 border border-red-200 rounded p-3"
          >
            <div class="text-xs text-gray-600">Account ID</div>
            <div class="font-mono text-sm text-gray-900">{{ source.accountId }}</div>
            <div class="mt-2 text-lg font-bold text-red-600">
              -{{ formatCurrency(source.amount) }}
            </div>
          </div>
          <div v-if="transaction.sources?.length" class="pt-2 border-t border-gray-200">
            <div class="flex justify-between text-sm font-semibold">
              <span>Total Out:</span>
              <span class="text-red-600">{{ formatCurrency(totalIn) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Destinations -->
      <div>
        <h3 class="font-semibold text-gray-900 mb-3">Destinations</h3>
        <div class="space-y-2">
          <div
            v-if="!transaction.destinations || transaction.destinations.length === 0"
            class="text-sm text-gray-500 italic"
          >
            No destinations selected
          </div>
          <div
            v-for="(dest, idx) in transaction.destinations"
            :key="`dest-${idx}`"
            class="bg-green-50 border border-green-200 rounded p-3"
          >
            <div class="text-xs text-gray-600">Account ID</div>
            <div class="font-mono text-sm text-gray-900">{{ dest.accountId }}</div>
            <div class="mt-2 text-lg font-bold text-green-600">
              +{{ formatCurrency(dest.amount) }}
            </div>
          </div>
          <div v-if="transaction.destinations?.length" class="pt-2 border-t border-gray-200">
            <div class="flex justify-between text-sm font-semibold">
              <span>Total In:</span>
              <span class="text-green-600">{{ formatCurrency(totalOut) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Balance Check -->
    <div :class="['p-4 rounded-lg', isBalanced ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200']">
      <div class="flex items-center gap-3">
        <div :class="['text-2xl', isBalanced ? 'text-green-600' : 'text-red-600']">
          {{ isBalanced ? '✓' : '✗' }}
        </div>
        <div>
          <div :class="['font-semibold', isBalanced ? 'text-green-900' : 'text-red-900']">
            {{ isBalanced ? 'Transaction Balanced' : 'Transaction Unbalanced' }}
          </div>
          <div :class="['text-sm', isBalanced ? 'text-green-700' : 'text-red-700']">
            {{ isBalanced ? 'Total in and out match perfectly' : `Difference: ${formatCurrency(Math.abs(totalIn - totalOut))}` }}
          </div>
        </div>
      </div>
    </div>

    <!-- Metadata -->
    <div v-if="transaction.metadata" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h3 class="font-semibold text-gray-900 mb-3">Details</h3>
      <div class="space-y-2 text-sm">
        <div v-if="transaction.metadata.reference" class="flex justify-between">
          <span class="text-gray-600">Reference:</span>
          <span class="font-mono text-gray-900">{{ transaction.metadata.reference }}</span>
        </div>
        <div v-if="transaction.metadata.description" class="flex justify-between">
          <span class="text-gray-600">Description:</span>
          <span class="text-gray-900">{{ transaction.metadata.description }}</span>
        </div>
        <div v-if="transaction.metadata.tags?.length" class="pt-2">
          <span class="text-gray-600 block mb-2">Tags:</span>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(tag, idx) in transaction.metadata.tags"
              :key="idx"
              class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
