<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'active' | 'inactive'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
})

const classes = computed(() => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  switch (props.variant) {
    case 'success':
      return `${base} bg-green-100 text-green-800`
    case 'warning':
      return `${base} bg-yellow-100 text-yellow-800`
    case 'error':
      return `${base} bg-red-100 text-red-800`
    case 'info':
      return `${base} bg-blue-100 text-blue-800`
    case 'active':
      return `${base} bg-green-100 text-green-800`
    case 'inactive':
      return `${base} bg-gray-100 text-gray-800`
    case 'primary':
    default:
      return `${base} bg-blue-100 text-blue-800`
  }
})
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
