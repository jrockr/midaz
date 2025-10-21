<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import TransactionTypeSelector from './TransactionTypeSelector.vue'
import TransactionAmountInput from './TransactionAmountInput.vue'
import TransactionMetadata from './TransactionMetadata.vue'
import TransactionPreview from './TransactionPreview.vue'

type TransactionType = 'SIMPLE' | 'COMPLEX' | 'DSL' | 'TEMPLATE'

interface TransactionSource {
  accountId: string
  amount: number
  asset: string
}

interface TransactionDestination {
  accountId: string
  amount: number
}

interface Transaction {
  type: TransactionType
  sources: TransactionSource[]
  destinations: TransactionDestination[]
  metadata: Record<string, any>
}

const emit = defineEmits<{
  submit: [transaction: Transaction]
}>()

const tabs = ['Type', 'Sources', 'Destinations', 'Amounts', 'Details', 'Preview']
const activeTab = ref(0)

const transaction = reactive<Transaction>({
  type: 'SIMPLE',
  sources: [{ accountId: '', amount: 0, asset: 'USD' }],
  destinations: [{ accountId: '', amount: 0 }],
  metadata: {}
})

const errors = ref<string[]>([])

const currentTabName = computed(() => tabs[activeTab.value])
const isLastTab = computed(() => activeTab.value === tabs.length - 1)
const canGoBack = computed(() => activeTab.value > 0)
const canGoNext = computed(() => validateCurrentTab())
const isValid = computed(() => validateTransaction())

const validateCurrentTab = (): boolean => {
  if (currentTabName.value === 'Type') {
    return !!transaction.type
  } else if (currentTabName.value === 'Sources') {
    return transaction.sources.some(s => s.accountId.trim())
  } else if (currentTabName.value === 'Destinations') {
    return transaction.destinations.some(d => d.accountId.trim())
  } else if (currentTabName.value === 'Amounts') {
    return transaction.sources.every(s => s.amount > 0)
  }
  return true
}

const validateTransaction = (): boolean => {
  errors.value = []

  if (!transaction.type) {
    errors.value.push('Transaction type is required')
    return false
  }

  if (!transaction.sources.some(s => s.accountId.trim())) {
    errors.value.push('At least one source account is required')
    return false
  }

  if (!transaction.destinations.some(d => d.accountId.trim())) {
    errors.value.push('At least one destination account is required')
    return false
  }

  const totalOut = transaction.sources.reduce((sum, s) => sum + (s.amount || 0), 0)
  const totalIn = transaction.destinations.reduce((sum, d) => sum + (d.amount || 0), 0)

  if (Math.abs(totalOut - totalIn) > 0.01) {
    errors.value.push(
      `Transaction amounts do not balance. Out: ${totalOut}, In: ${totalIn}`
    )
    return false
  }

  return true
}

const handlePrevious = () => {
  if (canGoBack.value) {
    activeTab.value--
  }
}

const handleNext = () => {
  if (canGoNext.value && !isLastTab.value) {
    activeTab.value++
  }
}

const handleSubmit = () => {
  if (validateTransaction()) {
    emit('submit', transaction)
  }
}

const addSource = () => {
  transaction.sources.push({ accountId: '', amount: 0, asset: 'USD' })
}

const removeSource = (idx: number) => {
  if (transaction.sources.length > 1) {
    transaction.sources.splice(idx, 1)
  }
}

const addDestination = () => {
  transaction.destinations.push({ accountId: '', amount: 0 })
}

const removeDestination = (idx: number) => {
  if (transaction.destinations.length > 1) {
    transaction.destinations.splice(idx, 1)
  }
}
</script>

<template>
  <div class="transaction-builder max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Transaction</h1>
      <p class="text-gray-600">Build complex financial transactions with multiple sources and destinations</p>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex overflow-x-auto border-b border-gray-200 mb-8">
      <button
        v-for="(tab, idx) in tabs"
        :key="tab"
        :disabled="idx > activeTab + 1"
        :class="[
          'px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition',
          idx === activeTab
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-600 hover:text-gray-900',
          idx > activeTab + 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        ]"
        @click="activeTab = idx"
      >
        <span class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-full flex items-center justify-center" 
            :class="idx < activeTab ? 'bg-green-600 text-white text-xs' : 'bg-gray-200 text-gray-600 text-xs'">
            {{ idx < activeTab ? '✓' : idx + 1 }}
          </span>
          {{ tab }}
        </span>
      </button>
    </div>

    <!-- Content Area -->
    <div class="bg-white rounded-lg border border-gray-200 p-8 mb-8">
      <!-- Type Selection -->
      <div v-if="currentTabName === 'Type'" class="min-h-80">
        <TransactionTypeSelector
          v-model="transaction.type"
        />
      </div>

      <!-- Sources Selection -->
      <div v-if="currentTabName === 'Sources'" class="min-h-80">
        <h2 class="text-xl font-semibold mb-6 text-gray-900">Select Source Accounts</h2>
        <div class="space-y-4">
          <div
            v-for="(source, idx) in transaction.sources"
            :key="`source-${idx}`"
            class="flex gap-3 items-end"
          >
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Account {{ idx + 1 }}
              </label>
              <input
                v-model="source.accountId"
                type="text"
                placeholder="Enter account ID"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              v-if="transaction.sources.length > 1"
              @click="removeSource(idx)"
              class="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>
          <button
            @click="addSource"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Add Another Source
          </button>
        </div>
      </div>

      <!-- Destinations Selection -->
      <div v-if="currentTabName === 'Destinations'" class="min-h-80">
        <h2 class="text-xl font-semibold mb-6 text-gray-900">Select Destination Accounts</h2>
        <div class="space-y-4">
          <div
            v-for="(dest, idx) in transaction.destinations"
            :key="`dest-${idx}`"
            class="flex gap-3 items-end"
          >
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Account {{ idx + 1 }}
              </label>
              <input
                v-model="dest.accountId"
                type="text"
                placeholder="Enter account ID"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              v-if="transaction.destinations.length > 1"
              @click="removeDestination(idx)"
              class="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>
          <button
            @click="addDestination"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Add Another Destination
          </button>
        </div>
      </div>

      <!-- Amounts -->
      <div v-if="currentTabName === 'Amounts'" class="min-h-80 space-y-8">
        <h2 class="text-xl font-semibold mb-6 text-gray-900">Configure Amounts</h2>
        <div
          v-for="(source, idx) in transaction.sources"
          :key="`amount-${idx}`"
          class="border border-gray-200 rounded-lg p-6"
        >
          <h3 class="font-semibold text-gray-900 mb-4">Source {{ idx + 1 }}: {{ source.accountId }}</h3>
          <TransactionAmountInput
            :model-value="source"
            @update:model-value="transaction.sources[idx] = $event"
          />
        </div>
      </div>

      <!-- Details/Metadata -->
      <div v-if="currentTabName === 'Details'" class="min-h-80">
        <h2 class="text-xl font-semibold mb-6 text-gray-900">Transaction Details</h2>
        <TransactionMetadata
          :model-value="transaction.metadata"
          @update:model-value="transaction.metadata = $event"
        />
      </div>

      <!-- Preview -->
      <div v-if="currentTabName === 'Preview'" class="min-h-80">
        <TransactionPreview :transaction="transaction" />
      </div>
    </div>

    <!-- Errors -->
    <div v-if="errors.length" class="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 class="font-semibold text-red-900 mb-2">Validation Errors:</h3>
      <ul class="space-y-1">
        <li v-for="(error, idx) in errors" :key="idx" class="text-red-700 text-sm">
          • {{ error }}
        </li>
      </ul>
    </div>

    <!-- Actions -->
    <div class="flex gap-4 justify-between">
      <button
        @click="handlePrevious"
        :disabled="!canGoBack"
        class="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        ← Previous
      </button>

      <div class="flex gap-4">
        <button
          v-if="!isLastTab"
          @click="handleNext"
          :disabled="!canGoNext"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
        <button
          v-else
          @click="handleSubmit"
          :disabled="!isValid"
          class="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ✓ Submit Transaction
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
input:focus,
select:focus {
  outline: none;
}
</style>
