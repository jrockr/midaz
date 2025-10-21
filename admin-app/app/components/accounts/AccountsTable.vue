<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th
            @click="handleSort('alias')"
            class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          >
            <div class="flex items-center gap-2">
              Code
              <span v-if="sortBy === 'alias'" class="text-blue-600">
                {{ sortDir === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </th>
          <th
            @click="handleSort('accountName')"
            class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          >
            <div class="flex items-center gap-2">
              Name
              <span v-if="sortBy === 'accountName'" class="text-blue-600">
                {{ sortDir === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Ledger
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Asset
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Type
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
          <td v-for="j in 8" :key="`cell-${j}`" class="px-6 py-4">
            <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="items.length === 0" class="bg-white">
          <td colspan="8" class="px-6 py-12 text-center">
            <div class="text-gray-500">
              <div class="text-lg font-medium">No accounts found</div>
              <div class="text-sm">Create a new account to get started</div>
            </div>
          </td>
        </tr>

        <!-- Data Rows -->
        <tr v-else v-for="account in items" :key="account.id" class="bg-white hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center gap-2">
              <code class="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                {{ account.alias }}
              </code>
              <button
                @click="copyToClipboard(account.alias)"
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
            <div class="text-sm font-medium text-gray-900">{{ account.accountName }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            {{ getLedgerName(account.ledgerId) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
              {{ account.asset?.code || '-' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            {{ account.type }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              :class="{
                'px-3 py-1 rounded-full text-xs font-medium': true,
                'bg-green-100 text-green-800': account.status === 'ACTIVE',
                'bg-gray-100 text-gray-800': account.status === 'INACTIVE'
              }"
            >
              {{ account.status }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            {{ formatDate(account.createdAt) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <div class="flex gap-2">
              <button
                @click="$emit('view', account)"
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                View
              </button>
              <button
                @click="$emit('edit', account)"
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                Edit
              </button>
              <button
                @click="showDropdown = showDropdown === account.id ? null : account.id"
                class="text-gray-600 hover:text-gray-800"
              >
                ⋮
              </button>
              <div
                v-if="showDropdown === account.id"
                class="absolute bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-2"
              >
                <button
                  @click="copyToClipboard(account.id); showDropdown = null"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Copy ID
                </button>
                <button
                  @click="$emit('delete', account); showDropdown = null"
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
import { useLedgersStore } from '@/stores'
import type { Account } from '@/types'

interface Props {
  items: Account[]
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
  (e: 'view', item: Account): void
  (e: 'edit', item: Account): void
  (e: 'delete', item: Account): void
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

const ledgersStore = useLedgersStore()
const showDropdown = ref<string | null>(null)

const handleSort = (column: string) => {
  const newDir = props.sortBy === column && props.sortDir === 'asc' ? 'desc' : 'asc'
  const emit = defineEmits<Emits>()[0]
  emit('sort', column, newDir)
}

const getLedgerName = (ledgerId: string) => {
  const ledger = ledgersStore.items.find(l => l.id === ledgerId)
  return ledger?.name || ledgerId
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
