<script setup lang="ts">
import { computed } from 'vue'

type Status = 'DRAFT' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

interface StatusStep {
  status: Status
  label: string
  icon: string
  color: string
  timestamp?: string
}

const props = defineProps<{
  currentStatus: Status
  timestamps?: Record<Status, string>
}>()

const steps: StatusStep[] = [
  {
    status: 'DRAFT',
    label: 'Draft',
    icon: '📝',
    color: 'gray'
  },
  {
    status: 'PENDING',
    label: 'Pending',
    icon: '⏳',
    color: 'yellow'
  },
  {
    status: 'PROCESSING',
    label: 'Processing',
    icon: '⚙',
    color: 'blue'
  },
  {
    status: 'COMPLETED',
    label: 'Completed',
    icon: '✅',
    color: 'green'
  }
]

const getCurrentStep = computed(() => {
  return steps.findIndex(s => s.status === props.currentStatus)
})

const getStepColor = (idx: number) => {
  const colors: Record<string, Record<string, string>> = {
    gray: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' }
  }

  if (idx < getCurrentStep.value) {
    return { ...colors.green, bg: 'bg-green-600', text: 'text-white' }
  }
  if (idx === getCurrentStep.value) {
    return colors[steps[idx].color]
  }
  return colors.gray
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-lg font-semibold text-gray-900">Transaction Timeline</h2>

    <!-- Timeline -->
    <div class="flex items-center justify-between gap-2">
      <div
        v-for="(step, idx) in steps"
        :key="step.status"
        class="flex flex-col items-center flex-1"
      >
        <!-- Step Circle -->
        <div
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold text-lg mb-2',
            getStepColor(idx).bg,
            getStepColor(idx).text,
            getStepColor(idx).border
          ]"
        >
          {{ step.icon }}
        </div>

        <!-- Label -->
        <p :class="['text-sm font-medium', idx <= getCurrentStep ? 'text-gray-900' : 'text-gray-500']">
          {{ step.label }}
        </p>

        <!-- Timestamp -->
        <p v-if="timestamps?.[step.status]" class="text-xs text-gray-500 mt-1">
          {{ formatDate(timestamps[step.status]) }}
        </p>

        <!-- Connector Line -->
        <div
          v-if="idx < steps.length - 1"
          :class="[
            'absolute left-1/2 top-6 w-full h-1 -ml-1',
            idx < getCurrentStep ? 'bg-green-600' : 'bg-gray-300'
          ]"
          style="transform: translateX(50%)"
        />
      </div>
    </div>

    <!-- Current Status Badge -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p class="text-sm text-blue-600 font-medium">Current Status</p>
      <p class="text-2xl font-bold text-blue-900 mt-1">{{ currentStatus }}</p>
    </div>
  </div>
</template>
