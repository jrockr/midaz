<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  modelValue?: boolean
  open?: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
  closeButton?: boolean
  type?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  open: false,
  closeButton: true,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  confirm: []
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-sm'
    case 'md':
      return 'max-w-md'
    case 'lg':
      return 'max-w-lg'
    default:
      return 'max-w-md'
  }
})

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.open) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="modelValue || open" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="emit('update:modelValue', false)" />

        <!-- Modal -->
        <div :class="`relative bg-white rounded-lg shadow-lg ${sizeClasses} w-full mx-4 animate-in fade-in zoom-in`">
          <!-- Header -->
          <div v-if="title || closeButton" class="flex items-center justify-between border-b border-gray-200 p-6">
            <h2 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h2>
            <button
              v-if="closeButton"
              @click="emit('update:modelValue', false)"
              class="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="flex items-center justify-end gap-3 border-t border-gray-200 p-6">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
