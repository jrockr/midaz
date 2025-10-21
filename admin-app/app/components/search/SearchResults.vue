<script setup lang="ts">
interface Result {
  id: string
  title: string
  type: string
  snippet: string
}

const props = withDefaults(
  defineProps<{
    results?: Result[]
    loading?: boolean
  }>(),
  {
    results: () => [
      { id: '1', title: 'Transaction TXN-001', type: 'TRANSACTION', snippet: 'Amount: $1000, Status: Completed' },
      { id: '2', title: 'Account ACC-001', type: 'ACCOUNT', snippet: 'Balance: $50000, Asset: USD' }
    ],
    loading: false
  }
)

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    'TRANSACTION': '💳',
    'ACCOUNT': '🏦',
    'BALANCE': '💰'
  }
  return icons[type] || '📄'
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-gray-900">Search Results</h3>

    <div v-if="loading" class="text-center p-8">
      <div class="inline-block animate-spin text-3xl">⏳</div>
      <p class="text-gray-600 mt-2">Searching...</p>
    </div>

    <div v-else-if="results.length === 0" class="text-center p-8 text-gray-500">
      <p>No results found</p>
    </div>

    <div v-else class="space-y-2">
      <div v-for="result in results" :key="result.id" class="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition cursor-pointer">
        <div class="flex gap-3">
          <span class="text-2xl">{{ getTypeIcon(result.type) }}</span>
          <div class="flex-1">
            <p class="font-medium text-gray-900 text-sm">{{ result.title }}</p>
            <p class="text-xs text-gray-600 mt-1">{{ result.snippet }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
