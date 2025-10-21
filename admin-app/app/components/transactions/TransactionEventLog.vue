<script setup lang="ts">
import { computed } from 'vue'

interface Event {
  id: string
  type: string
  timestamp: string
  details: string
}

const props = withDefaults(
  defineProps<{
    events?: Event[]
  }>(),
  {
    events: () => [
      { id: '1', type: 'CREATED', timestamp: new Date().toISOString(), details: 'Transaction created by user' },
      { id: '2', type: 'SUBMITTED', timestamp: new Date(Date.now() - 60000).toISOString(), details: 'Submitted for approval' },
      { id: '3', type: 'PROCESSING', timestamp: new Date(Date.now() - 30000).toISOString(), details: 'Processing started' }
    ]
  }
)

const getEventIcon = (type: string) => {
  const icons: Record<string, string> = {
    'CREATED': '📝',
    'SUBMITTED': '📤',
    'PROCESSING': '⚙',
    'COMPLETED': '✅',
    'FAILED': '❌'
  }
  return icons[type] || '🔔'
}

const formatTime = (ts: string) => new Date(ts).toLocaleTimeString()
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-gray-900">Event Timeline</h3>

    <div class="space-y-3">
      <div v-for="event in events" :key="event.id" class="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
        <div class="text-2xl">{{ getEventIcon(event.type) }}</div>
        <div class="flex-1">
          <div class="flex justify-between">
            <p class="font-medium text-gray-900 text-sm">{{ event.type }}</p>
            <p class="text-xs text-gray-500">{{ formatTime(event.timestamp) }}</p>
          </div>
          <p class="text-sm text-gray-600 mt-1">{{ event.details }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
