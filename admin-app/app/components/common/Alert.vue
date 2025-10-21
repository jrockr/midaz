<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: true,
})

const emit = defineEmits<{
  dismiss: []
}>()

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'error':
      return 'M10 14l4-4m0 0l-4-4m4 4l4-4m0 0l-4 4m4-4l4 4'
    case 'warning':
      return 'M12 9v2m0 4v2m0-10c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8z'
    case 'info':
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
})

const colorClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800'
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200 text-blue-800'
  }
})

const iconColorClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-400'
    case 'error':
      return 'text-red-400'
    case 'warning':
      return 'text-yellow-400'
    case 'info':
    default:
      return 'text-blue-400'
  }
})
</script>

<template>
  <div :class="`flex items-start rounded-lg border p-4 ${colorClasses}`">
    <svg :class="`h-5 w-5 flex-shrink-0 ${iconColorClasses} mt-0.5`" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" :d="icon" clip-rule="evenodd" />
    </svg>

    <div class="ml-3 flex-1">
      <h3 v-if="title" class="text-sm font-medium">{{ title }}</h3>
      <div class="text-sm">
        <slot />
      </div>
    </div>

    <button
      v-if="dismissible"
      @click="emit('dismiss')"
      class="ml-3 inline-flex flex-shrink-0 text-current hover:opacity-75 focus:outline-none"
    >
      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>
