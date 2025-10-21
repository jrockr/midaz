<script setup lang="ts">
import { ref } from 'vue'

interface SearchOptions {
  query: string
  type?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [options: SearchOptions]
}>()

const searchQuery = ref(props.modelValue || '')
const showAdvanced = ref(false)
const filters = ref({
  type: '',
  status: '',
  dateFrom: '',
  dateTo: ''
})

const handleSearch = () => {
  emit('update:modelValue', searchQuery.value)
  emit('search', {
    query: searchQuery.value,
    ...filters.value
  })
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value = {
    type: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  }
  emit('update:modelValue', '')
  emit('search', {
    query: '',
    ...filters.value
  })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Basic Search -->
    <div class="flex gap-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search transactions by ID, account ID..."
        @keyup.enter="handleSearch"
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        @click="handleSearch"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Search
      </button>
      <button
        @click="showAdvanced = !showAdvanced"
        class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        {{ showAdvanced ? '✕' : '+' }} Filters
      </button>
    </div>

    <!-- Advanced Filters -->
    <div v-if="showAdvanced" class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            v-model="filters.type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="SIMPLE">Simple</option>
            <option value="COMPLEX">Complex</option>
            <option value="DSL">DSL</option>
            <option value="TEMPLATE">Template</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
          <input
            v-model="filters.dateFrom"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
          <input
            v-model="filters.dateTo"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="flex gap-2">
        <button
          @click="handleSearch"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>
        <button
          @click="clearFilters"
          class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
</template>
