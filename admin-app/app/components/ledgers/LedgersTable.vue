<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th
            @click="handleSort('name')"
            class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          >
            <div class="flex items-center gap-2">
              Name
              <span v-if="sortBy === 'name'" class="text-blue-600">
                {{ sortDir === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </th>
          <th
            @click="handleSort('organizationId')"
            class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          >
            <div class="flex items-center gap-2">
              Organization
              <span v-if="sortBy === 'organizationId'" class="text-blue-600">
                {{ sortDir === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </th>
          <th
            @click="handleSort('code')"
            class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          >
            <div class="flex items-center gap-2">
              Code
              <span v-if="sortBy === 'code'" class="text-blue-600">
                {{ sortDir === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </th>
          <th
            @click="handleSort('status')"
            class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          >
            <div class="flex items-center gap-2">
              Status
              <span v-if="sortBy === 'status'" class="text-blue-600">
                {{ sortDir === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </th>
          <th
            @click="handleSort('createdAt')"
            class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          >
            <div class="flex items-center gap-2">
              Created
              <span v-if="sortBy === 'createdAt'" class="text-blue-600">
                {{ sortDir === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <!-- Loading Skeleton -->
        <tr v-if="loading" v-for="i in 5" :key="`skeleton-${i}`" class="bg-white hover:bg-gray-50">
          <td v-for="j in 6" :key="`cell-${j}`" class="px-6 py-4">
            <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="items.length === 0" class="bg-white">
          <td colspan="6" class="px-6 py-12 text-center">
            <div class="text-gray-500">
              <div class="text-lg font-medium">No ledgers found</div>
              <div class="text-sm">Create a new ledger to get started</div>
            </div>
          </td>
        </tr>

        <!-- Data Rows -->
        <tr v-else v-for="ledger in items" :key="ledger.id" class="bg-white hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">{{ ledger.name }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-600">{{ getOrgName(ledger.organizationId) }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center gap-2">
              <code class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {{ ledger.code || '-' }}
              </code>
              <button
                @click="copyToClipboard(ledger.code || ledger.id)"
                class="text-gray-400 hover:text-gray-600"
                title="Copy to clipboard"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 011 1v2h4a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h4V3z" />
                </svg>
              </button>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              :class="{
                'px-3 py-1 rounded-full text-xs font-medium': true,
                'bg-green-100 text-green-800': ledger.status === 'ACTIVE',
                'bg-gray-100 text-gray-800': ledger.status === 'INACTIVE'
              }"
            >
              {{ ledger.status }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            {{ formatDate(ledger.createdAt) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <div class="flex gap-2">
              <button
                @click="$emit('view', ledger)"
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                View
              </button>
              <button
                @click="$emit('edit', ledger)"
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                Edit
              </button>
              <button
                @click="showDropdown = showDropdown === ledger.id ? null : ledger.id"
                class="text-gray-600 hover:text-gray-800"
              >
                ⋮
              </button>
              <div
                v-if="showDropdown === ledger.id"
                class="absolute bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-2"
              >
                <button
                  @click="copyToClipboard(ledger.id); showDropdown = null"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Copy ID
                </button>
                <button
                  @click="$emit('delete', ledger); showDropdown = null"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
      <div class="text-sm text-gray-600">
        Showing {{ (page - 1) * pageSize + 1 }} to {{ Math.min(page * pageSize, total) }} of {{ total }}
      </div>
      <div class="flex gap-2">
        <button
          @click="$emit('paginate', page - 1)"
          :disabled="page === 1"
          class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div class="flex items-center gap-2">
          <span>Page {{ page }}</span>
        </div>
        <button
          @click="$emit('paginate', page + 1)"
          :disabled="page * pageSize >= total"
          class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrganizationsStore } from '@/stores'
import type { Ledger } from '@/types'

interface Props {
  items: Ledger[]
  loading?: boolean
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
  total?: number
}

interface Emits {
  (e: 'sort', column: string, direction: 'asc' | 'desc'): void
  (e: 'paginate', page: number): void
  (e: 'view', item: Ledger): void
  (e: 'edit', item: Ledger): void
  (e: 'delete', item: Ledger): void
  (e: 'pageSize', size: number): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  sortBy: 'createdAt',
  sortDir: 'desc',
  page: 1,
  pageSize: 10,
  total: 0
})

defineEmits<Emits>()

const organizationsStore = useOrganizationsStore()
const showDropdown = ref<string | null>(null)

const currentSortDir = computed(() => props.sortDir)

const handleSort = (column: string) => {
  const newDir = props.sortBy === column && props.sortDir === 'asc' ? 'desc' : 'asc'
  const emit = defineEmits<Emits>()[0]
  emit('sort', column, newDir)
}

const getOrgName = (orgId: string) => {
  const org = organizationsStore.items.find(o => o.id === orgId)
  return org?.name || orgId
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}
</script>
