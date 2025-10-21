<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
  fullWidth: false,
})

const variantClasses = computed(() => {
  const base = 'font-medium rounded-lg transition-colors duration-200'
  switch (props.variant) {
    case 'primary':
      return `${base} bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400`
    case 'secondary':
      return `${base} bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100`
    case 'danger':
      return `${base} bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400`
    case 'ghost':
      return `${base} text-gray-700 hover:bg-gray-100 disabled:text-gray-400`
    default:
      return base
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'md':
      return 'px-4 py-2 text-base'
    case 'lg':
      return 'px-6 py-3 text-lg'
    default:
      return 'px-4 py-2 text-base'
  }
})

const classes = computed(() => {
  const baseClasses = `${variantClasses.value} ${sizeClasses.value} inline-flex items-center justify-center gap-2`
  const widthClass = props.fullWidth ? 'w-full' : ''
  const disabledClass = props.disabled || props.loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
  return `${baseClasses} ${widthClass} ${disabledClass}`
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="classes"
    class="focus:outline-none focus:ring-2 focus:ring-offset-2"
  >
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <span><slot /></span>
  </button>
</template>
