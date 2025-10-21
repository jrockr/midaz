<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue'

interface Column<T> {
  key: keyof T | 'actions'
  label: string
  sortable?: boolean
  width?: string
  class?: string
  render?: (value: any, row: T) => string
}

interface Props<T> {
  items: T[]
  columns: Column<T>[]
  loading?: boolean
  sortBy?: keyof T
  sortOrder?: 'asc' | 'desc'
  hoverable?: boolean
  striped?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hoverable: true,
  striped: true,
})

const emit = defineEmits<{
  sort: [key: keyof Props['items'][0]]
  rowClick: [row: Props['items'][0]]
}>()

const handleSort = (key: string) => {
  if (key !== 'actions') {
    emit('sort', key as keyof Props['items'][0])
  }
}

const getCellValue = (item: any, column: Column<any>): string => {
  if (column.key === 'actions') {
    return ''
  }

  const value = item[column.key]

  if (column.render) {
    return column.render(value, item)
  }

  if (value === null || value === undefined) {
    return '—'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

const getColumnClass = (column: Column<any>) => {
  const base = 'px-6 py-4 text-sm'
  if (column.class) return `${base} ${column.class}`
  return base
}

const isSorted = (key: string) => {
  return props.sortBy === key
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="w-full text-left">
      <!-- Header -->
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th v-for="column in columns" :key="String(column.key)" class="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <button
              v-if="column.sortable && column.key !== 'actions'"
              @click="handleSort(String(column.key))"
              class="flex items-center gap-1 hover:text-gray-900 transition-colors"
            >
              {{ column.label }}
              <svg
                v-if="isSorted(String(column.key))"
                :class="`h-4 w-4 transition-transform ${props.sortOrder === 'desc' ? 'rotate-180' : ''}`"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3.707 9.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414 0l6-6a1 1 0 00-1.414-1.414L9 14.586V3a1 1 0 00-2 0v11.586L3.707 9.293z" />
              </svg>
            </button>
            <span v-else>{{ column.label }}</span>
          </th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="index"
          :class="[
            'border-b border-gray-200 transition-colors',
            striped && index % 2 === 1 ? 'bg-gray-50' : 'bg-white',
            hoverable ? 'hover:bg-blue-50 cursor-pointer' : '',
          ]"
          @click="emit('rowClick', item)"
        >
          <td
            v-for="column in columns"
            :key="String(column.key)"
            :class="getColumnClass(column)"
            :style="{ width: column.width }"
          >
            <slot v-if="column.key === 'actions'" name="actions" :item="item" />
            <span v-else>{{ getCellValue(item, column) }}</span>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-if="items.length === 0 && !loading">
          <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No data available</p>
          </td>
        </tr>

        <!-- Loading State -->
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-6 py-12 text-center">
            <div class="flex items-center justify-center gap-2">
              <svg class="h-5 w-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span class="text-gray-600">Loading...</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
