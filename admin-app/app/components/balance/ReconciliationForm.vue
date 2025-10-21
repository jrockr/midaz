<script setup lang="ts">
import { ref, reactive } from 'vue'

interface ReconciliationItem {
  transactionId: string
  amount: number
  status: 'MATCHED' | 'PENDING' | 'DISCREPANCY'
}

const props = defineProps<{
  accountId?: string
}>()

const emit = defineEmits<{
  'submit': [data: any]
}>()

const reconciliation = reactive({
  accountId: props.accountId || '',
  startDate: '',
  endDate: '',
  items: [] as ReconciliationItem[],
  notes: ''
})

const mockItems: ReconciliationItem[] = [
  { transactionId: 'TXN-001', amount: 1000, status: 'MATCHED' },
  { transactionId: 'TXN-002', amount: 500, status: 'MATCHED' },
  { transactionId: 'TXN-003', amount: 250, status: 'PENDING' },
  { transactionId: 'TXN-004', amount: 100, status: 'DISCREPANCY' }
]

const loading = ref(false)

const handleStartReconciliation = async () => {
  loading.value = true
  // Simulate loading
  await new Promise(resolve => setTimeout(resolve, 500))
  reconciliation.items = mockItems
  loading.value = false
}

const handleSubmit = () => {
  emit('submit', {
    accountId: reconciliation.accountId,
    startDate: reconciliation.startDate,
    endDate: reconciliation.endDate,
    itemsMatched: reconciliation.items.filter(i => i.status === 'MATCHED').length,
    itemsPending: reconciliation.items.filter(i => i.status === 'PENDING').length,
    discrepancies: reconciliation.items.filter(i => i.status === 'DISCREPANCY').length,
    notes: reconciliation.notes
  })
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'MATCHED': 'bg-green-100 text-green-800',
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'DISCREPANCY': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    'MATCHED': '✓',
    'PENDING': '⏳',
    'DISCREPANCY': '!'
  }
  return icons[status] || '?'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Account Reconciliation</h2>
      <p class="text-gray-600 mt-1">Match transactions and identify discrepancies</p>
    </div>

    <!-- Configuration -->
    <div class="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h3 class="font-semibold text-gray-900">Reconciliation Parameters</h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Account ID</label>
          <input
            v-model="reconciliation.accountId"
            type="text"
            placeholder="ACC-001"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
          <input
            v-model="reconciliation.startDate"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
          <input
            v-model="reconciliation.endDate"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        @click="handleStartReconciliation"
        :disabled="!reconciliation.accountId || loading"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {{ loading ? 'Loading...' : 'Start Reconciliation' }}
      </button>
    </div>

    <!-- Results -->
    <div v-if="reconciliation.items.length" class="space-y-6">
      <!-- Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <p class="text-sm text-green-600 font-medium">Matched</p>
          <p class="text-3xl font-bold text-green-900 mt-2">
            {{ reconciliation.items.filter(i => i.status === 'MATCHED').length }}
          </p>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-sm text-yellow-600 font-medium">Pending</p>
          <p class="text-3xl font-bold text-yellow-900 mt-2">
            {{ reconciliation.items.filter(i => i.status === 'PENDING').length }}
          </p>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-sm text-red-600 font-medium">Discrepancies</p>
          <p class="text-3xl font-bold text-red-900 mt-2">
            {{ reconciliation.items.filter(i => i.status === 'DISCREPANCY').length }}
          </p>
        </div>
      </div>

      <!-- Items List -->
      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h3 class="font-semibold text-gray-900">Reconciliation Items</h3>
        </div>

        <div class="divide-y divide-gray-200">
          <div
            v-for="item in reconciliation.items"
            :key="item.transactionId"
            class="p-4 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div class="flex items-center gap-4">
              <span class="text-2xl">{{ getStatusIcon(item.status) }}</span>
              <div>
                <p class="font-mono text-sm font-semibold text-gray-900">{{ item.transactionId }}</p>
                <p class="text-sm text-gray-600">$ {{ item.amount.toFixed(2) }}</p>
              </div>
            </div>

            <span :class="['px-3 py-1 rounded-full text-sm font-medium', getStatusColor(item.status)]">
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
        <textarea
          v-model="reconciliation.notes"
          placeholder="Any findings or discrepancies to note..."
          rows="4"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <!-- Submit -->
      <button
        @click="handleSubmit"
        class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
      >
        ✓ Complete Reconciliation
      </button>
    </div>
  </div>
</template>
