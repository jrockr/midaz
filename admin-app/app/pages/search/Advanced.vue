<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Modal, Input, Card, Breadcrumb } from '@/components'
import AdvancedSearch from '@/components/search/AdvancedSearch.vue'
import SavedSearches from '@/components/search/SavedSearches.vue'
import SearchHistory from '@/components/search/SearchHistory.vue'
import type { SearchResult } from '@/types'

interface SearchCriteria {
  query: string
  type: 'TRANSACTIONS' | 'ACCOUNTS' | 'LEDGERS' | 'ALL'
  filters: Record<string, any>
  limit: number
  offset: number
  name?: string
}

const searchQuery = ref('')
const searchType = ref<'TRANSACTIONS' | 'ACCOUNTS' | 'LEDGERS' | 'ALL'>('ALL')
const advancedFilters = ref({
  startDate: '',
  endDate: '',
  minAmount: '',
  maxAmount: '',
  status: '',
  sortBy: 'relevance',
  sortDir: 'desc' as 'asc' | 'desc'
})

const results = ref<SearchResult[]>([])
const isSearching = ref(false)
const showAdvanced = ref(false)
const showSaveModal = ref(false)
const saveSearchName = ref('')

const pageSize = ref(10)
const currentPage = ref(1)

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return results.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(results.value.length / pageSize.value))

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    return
  }

  isSearching.value = true
  currentPage.value = 1

  try {
    // API call would go here
    const criteria: SearchCriteria = {
      query: searchQuery.value,
      type: searchType.value,
      filters: advancedFilters.value,
      limit: 100,
      offset: 0
    }

    // Simulate search results
    results.value = [
      // Results would come from API
    ]
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    isSearching.value = false
  }
}

const openSaveModal = () => {
  saveSearchName.value = ''
  showSaveModal.value = true
}

const closeSaveModal = () => {
  showSaveModal.value = false
  saveSearchName.value = ''
}

const handleSaveSearch = async () => {
  if (!saveSearchName.value.trim()) {
    return
  }

  try {
    // API call to save search
    const criteria: SearchCriteria = {
      query: searchQuery.value,
      type: searchType.value,
      filters: advancedFilters.value,
      limit: 100,
      offset: 0,
      name: saveSearchName.value
    }

    // Save search logic here

    closeSaveModal()
  } catch (error) {
    console.error('Failed to save search:', error)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  searchType.value = 'ALL'
  advancedFilters.value = {
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    status: '',
    sortBy: 'relevance',
    sortDir: 'desc'
  }
  results.value = []
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const getResultIcon = (type: string) => {
  const icons: Record<string, string> = {
    'TRANSACTION': '💳',
    'ACCOUNT': '🏦',
    'LEDGER': '📋',
    'PORTFOLIO': '📊'
  }
  return icons[type] || '📄'
}

const getResultTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'TRANSACTION': 'text-blue-600',
    'ACCOUNT': 'text-green-600',
    'LEDGER': 'text-purple-600',
    'PORTFOLIO': 'text-orange-600'
  }
  return colors[type] || 'text-gray-600'
}
</script>

<template>
  <main class="flex-1 overflow-auto">
    <div class="px-6 py-8">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <Breadcrumb />
      </div>

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Advanced Search</h1>
        <p class="text-gray-600 mt-2">Search across all financial data with advanced filters</p>
      </div>

      <!-- Search Interface -->
      <AdvancedSearch 
        @search="performSearch"
        @save="openSaveModal"
        v-model:query="searchQuery"
        v-model:type="searchType"
        v-model:filters="advancedFilters"
        :is-loading="isSearching"
      />

      <!-- Advanced Filters Toggle -->
      <div class="mb-6">
        <button
          @click="showAdvanced = !showAdvanced"
          class="text-blue-600 hover:text-blue-900 text-sm font-medium"
        >
          {{ showAdvanced ? 'Hide' : 'Show' }} Advanced Filters
        </button>
      </div>

      <!-- Advanced Filters Panel -->
      <div v-if="showAdvanced" class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              v-model="advancedFilters.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              v-model="advancedFilters.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Min Amount</label>
            <input
              v-model="advancedFilters.minAmount"
              type="number"
              placeholder="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Max Amount</label>
            <input
              v-model="advancedFilters.maxAmount"
              type="number"
              placeholder="999999"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="advancedFilters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              v-model="advancedFilters.sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="name">Name</option>
            </select>
          </div>
          <div class="col-span-full">
            <Button @click="performSearch" variant="primary" class="w-full">
              <span v-if="!isSearching">🔍 Search</span>
              <span v-else>Searching...</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- Results Stats -->
      <div v-if="results.length > 0" class="mb-6">
        <Card class="p-4 bg-blue-50 border border-blue-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Found {{ results.length }} results</p>
              <p class="text-lg font-semibold text-gray-900">Displaying {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, results.length) }}</p>
            </div>
            <div class="flex gap-2">
              <Button @click="openSaveModal" variant="secondary" size="sm">
                💾 Save Search
              </Button>
              <Button @click="clearFilters" variant="secondary" size="sm">
                ✕ Clear All
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <!-- Results Table -->
      <div v-if="isSearching" class="text-center py-12">
        <div class="inline-block">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600">Searching...</p>
        </div>
      </div>

      <div v-else-if="results.length === 0 && searchQuery" class="text-center py-12">
        <p class="text-gray-500">No results found for "{{ searchQuery }}"</p>
      </div>

      <div v-else-if="results.length > 0" class="space-y-4">
        <Card v-for="result in paginatedResults" :key="result.id" class="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-4 flex-1">
              <span class="text-2xl">{{ getResultIcon(result.type) }}</span>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ result.title }}</h3>
                <p class="text-sm text-gray-600 mt-1">{{ result.description }}</p>
                <div class="flex gap-2 mt-3">
                  <span :class="`text-xs font-medium ${getResultTypeColor(result.type)}`">{{ result.type }}</span>
                  <span class="text-xs text-gray-500">{{ result.metadata }}</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-500">
                Relevance: {{ result.relevance }}%
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 flex justify-center">
        <nav class="flex gap-1">
          <button
            v-if="currentPage > 1"
            @click="handlePageChange(currentPage - 1)"
            class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            ← Previous
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="handlePageChange(page)"
            :class="page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
            class="px-3 py-2 rounded-lg"
          >
            {{ page }}
          </button>
          <button
            v-if="currentPage < totalPages"
            @click="handlePageChange(currentPage + 1)"
            class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Next →
          </button>
        </nav>
      </div>

      <!-- Saved Searches Sidebar (Mobile: Hidden) -->
      <div class="hidden lg:block fixed right-0 top-0 mt-24 mr-6 w-64">
        <SavedSearches />
        <div class="mt-4">
          <SearchHistory />
        </div>
      </div>
    </div>

    <!-- Save Search Modal -->
    <Modal v-model="showSaveModal" title="Save Search">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Search Name <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="saveSearchName"
            type="text"
            placeholder="e.g., High Value Transactions"
          />
        </div>
        <p class="text-sm text-gray-600">
          This search will be saved with your current filters and can be accessed later from your saved searches.
        </p>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button @click="closeSaveModal" variant="secondary">Cancel</Button>
          <Button @click="handleSaveSearch" variant="primary">Save Search</Button>
        </div>
      </template>
    </Modal>
  </main>
</template>
