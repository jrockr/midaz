<script setup lang="ts">
import { ref } from 'vue'

interface SavedSearch {
  id: string
  name: string
  criteria: Record<string, any>
  createdAt: string
}

const searches = ref<SavedSearch[]>([
  { id: '1', name: 'Large Transactions', criteria: { minAmount: 10000 }, createdAt: new Date().toISOString() },
  { id: '2', name: 'This Week', criteria: { dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }, createdAt: new Date().toISOString() }
])

const emit = defineEmits<{
  'apply': [search: SavedSearch]
}>()
</script>

<template>
  <div class="space-y-3">
    <h3 class="font-semibold text-gray-900 text-sm">Saved Searches</h3>
    <div class="grid grid-cols-1 gap-2">
      <button v-for="search in searches" :key="search.id" @click="emit('apply', search)" class="p-2 text-left text-sm border border-blue-200 bg-blue-50 rounded hover:bg-blue-100 text-blue-900 transition">
        ⭐ {{ search.name }}
      </button>
    </div>
  </div>
</template>
