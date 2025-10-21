<script setup lang="ts">
interface Notification {
  id: string
  type: string
  message: string
  severity: 'INFO' | 'WARNING' | 'CRITICAL'
}

const props = withDefaults(
  defineProps<{
    notifications?: Notification[]
  }>(),
  {
    notifications: () => [
      { id: '1', type: 'LOW_BALANCE', message: 'ACC-001 balance below threshold', severity: 'WARNING' }
    ]
  }
)

const getSeverityColor = (s: string) => {
  const colors: Record<string, string> = {
    'INFO': 'bg-blue-100 text-blue-800 border-blue-300',
    'WARNING': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'CRITICAL': 'bg-red-100 text-red-800 border-red-300'
  }
  return colors[s] || 'bg-gray-100'
}
</script>

<template>
  <div class="space-y-2">
    <div v-for="notif in notifications" :key="notif.id" :class="['p-3 border rounded text-sm', getSeverityColor(notif.severity)]">
      <p class="font-medium">{{ notif.type }}</p>
      <p class="text-xs mt-1">{{ notif.message }}</p>
    </div>
  </div>
</template>
