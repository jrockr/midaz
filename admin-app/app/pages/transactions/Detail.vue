<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/transactionStore'

const route = useRoute()
const router = useRouter()
const store = useTransactionStore()

const transactionId = computed(() => route.params.id as string)

onMounted(async () => {
  await store.fetchTransactions()
})

const transaction = computed(() => store.getTransaction(transactionId.value))

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    'DRAFT': '📝',
    'PENDING': '⏳',
    'PROCESSING': '⚙',
    'COMPLETED': '✅',
    'FAILED': '❌'
  }
  return icons[status] || '?'
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const formatAmount = (amount: number, asset: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: asset
  }).format(amount)
}
</script>

<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <button
          @click="router.back()"
          class="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back
        </button>
      </div>

      <div v-if="!transaction" class="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p class="text-gray-500 text-lg">Transaction not found</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Status Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center gap-4">
            <div class="text-4xl">{{ getStatusIcon(transaction.status) }}</div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ transaction.id }}</h1>
              <p class="text-lg font-semibold text-gray-700 mt-1">
                Status: <span class="text-blue-600">{{ transaction.status }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Transaction Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Type & Amounts -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Transaction Info</h2>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Type</span>
                <span class="font-semibold text-gray-900">{{ transaction.type }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Sources</span>
                <span class="font-semibold text-gray-900">{{ transaction.sources.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Destinations</span>
                <span class="font-semibold text-gray-900">{{ transaction.destinations.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total Amount</span>
                <span class="font-semibold text-gray-900">
                  {{ formatAmount(transaction.sources.reduce((s, acc) => s + acc.amount, 0), transaction.sources[0]?.asset) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Dates -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div class="space-y-3 text-sm">
              <div>
                <span class="text-gray-600">Created</span>
                <p class="font-mono text-gray-900 text-xs mt-1">{{ formatDate(transaction.createdAt) }}</p>
              </div>
              <div>
                <span class="text-gray-600">Updated</span>
                <p class="font-mono text-gray-900 text-xs mt-1">{{ formatDate(transaction.updatedAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sources -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Source Accounts</h2>
          <div class="space-y-3">
            <div
              v-for="(source, idx) in transaction.sources"
              :key="`source-${idx}`"
              class="border border-red-200 bg-red-50 rounded-lg p-4"
            >
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <p class="text-xs text-gray-600 mb-1">Account ID</p>
                  <p class="font-mono text-sm font-semibold text-gray-900">{{ source.accountId }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-1">Amount</p>
                  <p class="font-semibold text-red-600">-{{ formatAmount(source.amount, source.asset) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-1">Asset</p>
                  <p class="font-semibold text-gray-900">{{ source.asset }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Destinations -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Destination Accounts</h2>
          <div class="space-y-3">
            <div
              v-for="(dest, idx) in transaction.destinations"
              :key="`dest-${idx}`"
              class="border border-green-200 bg-green-50 rounded-lg p-4"
            >
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <p class="text-xs text-gray-600 mb-1">Account ID</p>
                  <p class="font-mono text-sm font-semibold text-gray-900">{{ dest.accountId }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-1">Amount</p>
                  <p class="font-semibold text-green-600">+{{ formatAmount(dest.amount) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Metadata -->
        <div v-if="transaction.metadata" class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Details & Notes</h2>
          <div class="space-y-4">
            <div v-if="transaction.metadata.reference">
              <p class="text-sm text-gray-600 mb-1">Reference</p>
              <p class="font-mono text-sm text-gray-900 bg-gray-100 p-2 rounded">{{ transaction.metadata.reference }}</p>
            </div>
            <div v-if="transaction.metadata.description">
              <p class="text-sm text-gray-600 mb-1">Description</p>
              <p class="text-gray-900 bg-gray-50 p-3 rounded">{{ transaction.metadata.description }}</p>
            </div>
            <div v-if="transaction.metadata.tags?.length">
              <p class="text-sm text-gray-600 mb-2">Tags</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(tag, idx) in transaction.metadata.tags"
                  :key="idx"
                  class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
          <button
            @click="router.push('/transactions')"
            class="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
