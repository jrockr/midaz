<script setup lang="ts">
import { ref, reactive } from 'vue'

interface Alert {
  id: string
  name: string
  type: 'BALANCE_LOW' | 'TRANSACTION_FAILED' | 'HIGH_VOLUME' | 'CUSTOM'
  threshold?: number
  enabled: boolean
  channels: ('EMAIL' | 'SMS' | 'WEBHOOK')[]
}

const props = withDefaults(
  defineProps<{
    modelValue?: Alert[]
  }>(),
  {
    modelValue: () => []
  }
)

const emit = defineEmits<{
  'update:modelValue': [alerts: Alert[]]
}>()

const showForm = ref(false)
const alerts = ref<Alert[]>(props.modelValue)
const newAlert = reactive<Partial<Alert>>({
  name: '',
  type: 'BALANCE_LOW',
  threshold: 1000,
  enabled: true,
  channels: ['EMAIL']
})

const addAlert = () => {
  if (!newAlert.name || !newAlert.type) return

  const alert: Alert = {
    id: `ALERT-${Date.now()}`,
    name: newAlert.name,
    type: newAlert.type,
    threshold: newAlert.threshold,
    enabled: newAlert.enabled!,
    channels: newAlert.channels || ['EMAIL']
  }

  alerts.value.push(alert)
  emit('update:modelValue', alerts.value)

  // Reset form
  newAlert.name = ''
  newAlert.type = 'BALANCE_LOW'
  newAlert.threshold = 1000
  newAlert.enabled = true
  newAlert.channels = ['EMAIL']
  showForm.value = false
}

const toggleAlert = (id: string) => {
  const alert = alerts.value.find(a => a.id === id)
  if (alert) {
    alert.enabled = !alert.enabled
    emit('update:modelValue', alerts.value)
  }
}

const deleteAlert = (id: string) => {
  alerts.value = alerts.value.filter(a => a.id !== id)
  emit('update:modelValue', alerts.value)
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'BALANCE_LOW': 'Low Balance',
    'TRANSACTION_FAILED': 'Failed Transaction',
    'HIGH_VOLUME': 'High Volume',
    'CUSTOM': 'Custom Rule'
  }
  return labels[type] || type
}

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    'BALANCE_LOW': '💰',
    'TRANSACTION_FAILED': '❌',
    'HIGH_VOLUME': '📈',
    'CUSTOM': '⚙'
  }
  return icons[type] || '🔔'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold text-gray-900">Alert Configuration</h2>
      <button
        @click="showForm = !showForm"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {{ showForm ? '✕' : '+' }} New Alert
      </button>
    </div>

    <!-- New Alert Form -->
    <div v-if="showForm" class="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Alert Name</label>
        <input
          v-model="newAlert.name"
          type="text"
          placeholder="e.g., Daily Balance Check"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Alert Type</label>
          <select
            v-model="newAlert.type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="BALANCE_LOW">Low Balance</option>
            <option value="TRANSACTION_FAILED">Failed Transaction</option>
            <option value="HIGH_VOLUME">High Volume</option>
            <option value="CUSTOM">Custom Rule</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Threshold</label>
          <input
            v-model.number="newAlert.threshold"
            type="number"
            placeholder="1000"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Notification Channels</label>
        <div class="flex gap-4">
          <label v-for="channel in ['EMAIL', 'SMS', 'WEBHOOK']" :key="channel" class="flex items-center">
            <input
              type="checkbox"
              :value="channel"
              :checked="newAlert.channels?.includes(channel as any)"
              @change="(e) => {
                if ((e.target as HTMLInputElement).checked) {
                  newAlert.channels = [...(newAlert.channels || []), channel as any]
                } else {
                  newAlert.channels = newAlert.channels?.filter(c => c !== channel)
                }
              }"
              class="mr-2"
            />
            <span class="text-sm text-gray-700">{{ channel }}</span>
          </label>
        </div>
      </div>

      <label class="flex items-center">
        <input
          type="checkbox"
          v-model="newAlert.enabled"
          class="mr-2"
        />
        <span class="text-sm text-gray-700">Enable Alert</span>
      </label>

      <div class="flex gap-2">
        <button
          @click="addAlert"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create Alert
        </button>
        <button
          @click="showForm = false"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Alerts List -->
    <div class="space-y-3">
      <div v-if="alerts.length === 0" class="text-center p-6 text-gray-500">
        No alerts configured yet
      </div>

      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
      >
        <div class="flex items-start justify-between">
          <div class="flex gap-4 flex-1">
            <div class="text-2xl">{{ getTypeIcon(alert.type) }}</div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ alert.name }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ getTypeLabel(alert.type) }}</p>
              <div class="mt-2 flex gap-2">
                <span v-for="channel in alert.channels" :key="channel" class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {{ channel }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <label class="flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="alert.enabled"
                @change="toggleAlert(alert.id)"
                class="mr-2"
              />
              <span class="text-sm text-gray-700">{{ alert.enabled ? 'Enabled' : 'Disabled' }}</span>
            </label>
            <button
              @click="deleteAlert(alert.id)"
              class="text-red-600 hover:text-red-700 font-medium text-sm ml-2"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
