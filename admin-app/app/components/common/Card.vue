<script setup lang="ts">
interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

withDefaults(defineProps<Props>(), {
  padding: 'md',
  hoverable: false,
})

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
}
</script>

<template>
  <div
    :class="[
      'bg-white rounded-lg border border-gray-200 shadow-sm',
      paddingClasses[padding],
      hoverable ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : '',
    ]"
  >
    <slot />
  </div>
</template>
