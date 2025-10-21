<script setup lang="ts">
import { ref, computed } from 'vue'

interface SearchCriteria {
  text?: string
  dateFrom?: string
  dateTo?: string
  status?: string
  type?: string
  minAmount?: number
  maxAmount?: number
}

const props = defineProps<{
  modelValue?: SearchCriteria
}>()

const emit = defineEmits<{
  'update:modelValue': [criteria: SearchCriteria]
  'search': [criteria: SearchCriteria]
}>()

const criteria = ref<SearchCriteria>(props.modelValue || {})
const savedSearches = ref<{ name: string; criteria: SearchCriteria }[]>([
  { name: 'Large Transactions', criteria: { minAmount: 10000 } },
  { name: 'Failed Transactions', criteria: { status: 'FAILED' } },
  { name: 'This Week', criteria: { dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } }
])

const handleSearch = () => {
  emit('update:modelValue', criteria.value)
  emit('search', criteria.value)
}

const clearSearch = () => {
  criteria.value = {}
  emit('update:modelValue', {})
  emit('search', {})
}

const applySavedSearch = (search: typeof savedSearches.value[0]) => {
  criteria.value = { ...search.criteria }
  handleSearch()
}

const criteriaCount = computed(() => {
  return Object.values(criteria.value).filter(v => v !== undefined && v !== '').length
})
</script>

<template>
  <div class="space-y-6">
    <!-- Search Form -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">Advanced Search</h2>

      <div class="space-y-4">
        <!-- Text Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Text</label>
          <input
            v-model="criteria.text"
            type="text"
            placeholder="Transaction ID, Account ID, Reference..."
            @keyup.enter="handleSearch"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Date Range -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              v-model="criteria.dateFrom"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              v-model="criteria.dateTo"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Status & Type -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="criteria.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              v-model="criteria.type"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any Type</option>
              <option value="SIMPLE">Simple</option>
              <option value="COMPLEX">Complex</option>
              <option value="DSL">DSL</option>
              <option value="TEMPLATE">Template</option>
            </select>
          </div>
        </div>

        <!-- Amount Range -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Min Amount</label>
            <input
              v-model.number="criteria.minAmount"
              type="number"
              placeholder="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Max Amount</label>
            <input
              v-model.number="criteria.maxAmount"
              type="number"
              placeholder="999999"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-4">
          <button
            @click="handleSearch"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Search
          </button>
          <button
            @click="clearSearch"
            :disabled="criteriaCount === 0"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>

        <!-- Active Criteria -->
        <div v-if="criteriaCount > 0" class="flex flex-wrap gap-2 pt-2">
          <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {{ criteriaCount }} filter{{ criteriaCount !== 1 ? 's' : '' }} active
          </span>
        </div>
      </div>
    </div>

    <!-- Saved Searches -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Searches</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          v-for="search in savedSearches"
          :key="search.name"
          @click="applySavedSearch(search)"
          class="p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          {{ search.name }}
        </button>
      </div>
    </div>
  </div>
</template>
