<script setup lang="ts">
import { ref } from 'vue'

interface FailedTransaction {
  id: string
  error: string
  failedAt: string
  retryCount: number
}

const props = defineProps<{
  transaction?: FailedTransaction
}>()

const emit = defineEmits<{
  'retry': []
}>()

const isRetrying = ref(false)

const handleRetry = async () => {
  isRetrying.value = true
  await new Promise(r => setTimeout(r, 1000))
  isRetrying.value = false
  emit('retry')
}
</script>

<template>
  <div v-if="transaction" class="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
    <div>
      <p class="font-semibold text-red-900">Transaction Failed</p>
      <p class="text-sm text-red-700 mt-1">{{ transaction.error }}</p>
    </div>

    <div class="text-xs text-red-700 space-y-1">
      <p>Failed at: {{ new Date(transaction.failedAt).toLocaleString() }}</p>
      <p>Retry attempts: {{ transaction.retryCount }}/3</p>
    </div>

    <button
      @click="handleRetry"
      :disabled="isRetrying || transaction.retryCount >= 3"
      class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
    >
      {{ isRetrying ? 'Retrying...' : 'Retry Transaction' }}
    </button>
  </div>
</template>
