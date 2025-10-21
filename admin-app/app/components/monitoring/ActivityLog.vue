<script setup lang="ts">
import { computed } from 'vue'

interface LogEntry {
  id: string
  timestamp: string
  action: string
  user: string
  details: string
  status: 'SUCCESS' | 'ERROR' | 'WARNING'
}

const props = withDefaults(
  defineProps<{
    entries?: LogEntry[]
  }>(),
  {
    entries: () => [
      { id: '1', timestamp: new Date().toISOString(), action: 'Transaction Created', user: 'John Doe', details: 'TXN-001', status: 'SUCCESS' },
      { id: '2', timestamp: new Date(Date.now() - 300000).toISOString(), action: 'Balance Updated', user: 'System', details: 'ACC-001', status: 'SUCCESS' },
      { id: '3', timestamp: new Date(Date.now() - 600000).toISOString(), action: 'Reconciliation Failed', user: 'Jane Smith', details: 'Discrepancy found', status: 'ERROR' }
    ]
  }
)

const sortedEntries = computed(() => [...props.entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    'SUCCESS': '✅',
    'ERROR': '❌',
    'WARNING': '⚠️'
  }
  return icons[status] || '?'
}

const formatTime = (ts: string) => {
  return new Date(ts).toLocaleTimeString()
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold text-gray-900">Activity Log</h2>

    <div class="space-y-2">
      <div v-for="entry in sortedEntries" :key="entry.id" class="flex gap-4 p-3 bg-gray-50 rounded-lg">
        <div class="text-2xl">{{ getStatusIcon(entry.status) }}</div>
        <div class="flex-1">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-semibold text-gray-900 text-sm">{{ entry.action }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ entry.user }} • {{ entry.details }}</p>
            </div>
            <span class="text-xs text-gray-500">{{ formatTime(entry.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
