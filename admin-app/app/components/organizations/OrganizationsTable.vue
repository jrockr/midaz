<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Badge } from '@/components'
import type { Organization } from '@/types'

interface Props {
  organizations: Organization[]
  loading?: boolean
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
  total?: number
}

interface Emits {
  sort: (column: string, direction: 'asc' | 'desc') => void
  paginate: (page: number) => void
  view: (org: Organization) => void
  edit: (org: Organization) => void
  delete: (org: Organization) => void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  sortBy: 'createdAt',
  sortDir: 'desc',
  page: 1,
  pageSize: 10,
  total: 0,
})

const emit = defineEmits<Emits>()

const showActionsMenu = ref<string | null>(null)

const columns = [
  { key: 'id', label: 'ID', width: '15%', sortable: true },
  { key: 'legalName', label: 'Legal Name', width: '25%', sortable: true },
  { key: 'legalDocument', label: 'Legal Document', width: '15%', sortable: false },
  { key: 'status', label: 'Status', width: '12%', sortable: true },
  { key: 'createdAt', label: 'Created', width: '18%', sortable: true },
  { key: 'actions', label: 'Actions', width: '15%', sortable: false },
]

const totalPages = computed(() => Math.ceil((props.total || 0) / (props.pageSize || 10)))

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const toggleSort = (column: string) => {
  if (!columns.find(c => c.key === column)?.sortable) return

  const newDir = props.sortBy === column && props.sortDir === 'asc' ? 'desc' : 'asc'
  emit('sort', column, newDir)
}

const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    emit('paginate', newPage)
  }
}

const getStatusBadgeVariant = (status: any) => {
  const statusCode = status?.code || status
  return statusCode === 'ACTIVE' ? 'success' : 'warning'
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  alert('Copied to clipboard!')
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
    <!-- Table -->
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            :style="{ width: column.width }"
          >
            <button
              v-if="column.sortable"
              @click="toggleSort(column.key)"
              class="inline-flex items-center gap-2 hover:text-gray-900 transition-colors"
            >
              {{ column.label }}
              <svg
                v-if="sortBy === column.key"
                :class="['h-4 w-4 transition-transform', sortDir === 'desc' ? 'rotate-180' : '']"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4"
                />
              </svg>
            </button>
            <span v-else>{{ column.label }}</span>
          </th>
        </tr>
      </thead>

      <!-- Loading Skeleton -->
      <tbody v-if="loading" class="divide-y divide-gray-200 bg-white">
        <tr v-for="i in pageSize" :key="i">
          <td v-for="col in columns" :key="col.key" class="px-6 py-4 whitespace-nowrap">
            <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
          </td>
        </tr>
      </tbody>

      <!-- Empty State -->
      <tbody v-else-if="organizations.length === 0" class="divide-y divide-gray-200 bg-white">
        <tr>
          <td :colspan="columns.length" class="px-6 py-8 text-center text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p class="text-sm font-medium">No organizations found</p>
            <p class="text-xs text-gray-400 mt-1">Create your first organization to get started</p>
          </td>
        </tr>
      </tbody>

      <!-- Data Rows -->
      <tbody v-else class="divide-y divide-gray-200 bg-white">
        <tr
          v-for="org in organizations"
          :key="org.id"
          class="hover:bg-gray-50 transition-colors"
        >
          <!-- ID Column -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center gap-2">
              <code class="text-xs font-mono text-gray-600">
                {{ org.id.substring(0, 8) }}...
              </code>
              <button
                @click="copyToClipboard(org.id)"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy full ID"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </td>

          <!-- Legal Name Column -->
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ org.legalName }}
          </td>

          <!-- Legal Document Column -->
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            {{ org.legalDocument || '-' }}
          </td>

          <!-- Status Column -->
          <td class="px-6 py-4 whitespace-nowrap">
            <Badge
              :variant="getStatusBadgeVariant(org.status)"
              :label="org.status?.code || org.status"
            />
          </td>

          <!-- Created Date Column -->
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            {{ formatDate(org.createdAt) }}
          </td>

          <!-- Actions Column -->
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <div class="relative">
              <button
                @click="showActionsMenu = showActionsMenu === org.id ? null : org.id"
                class="inline-flex items-center px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10.5 1.5H9.5V.5h1v1zm0 4H9.5v-1h1v1zm0 4H9.5v-1h1v1zm0 4H9.5v-1h1v1z"
                  />
                </svg>
              </button>

              <!-- Actions Menu -->
              <div
                v-if="showActionsMenu === org.id"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
              >
                <button
                  @click="emit('view', org); showActionsMenu = null"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg transition-colors flex items-center gap-2"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Details
                </button>
                <button
                  @click="emit('edit', org); showActionsMenu = null"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  @click="emit('delete', org); showActionsMenu = null"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg transition-colors flex items-center gap-2"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3H4v2h16V7h-3.5z"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div v-if="total > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Showing
        <span class="font-semibold">{{ (page - 1) * pageSize + 1 }}</span>
        to
        <span class="font-semibold">{{ Math.min(page * pageSize, total) }}</span>
        of
        <span class="font-semibold">{{ total }}</span>
        results
      </div>

      <div class="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          :disabled="page === 1"
          @click="handlePageChange(page - 1)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </Button>

        <div class="flex items-center gap-1">
          <span class="text-sm text-gray-600">
            Page <span class="font-semibold">{{ page }}</span> of
            <span class="font-semibold">{{ totalPages }}</span>
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          :disabled="page === totalPages"
          @click="handlePageChange(page + 1)"
        >
          Next
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>
    </div>
  </div>
</template>
