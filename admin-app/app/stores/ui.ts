import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

export const useUIStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const theme = ref<'light' | 'dark'>('light')
  const modals = ref<Record<string, boolean>>({})
  const toasts = ref<Toast[]>([])

  let toastId = 0

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
  }

  const toggleModal = (name: string) => {
    if (name in modals.value) {
      modals.value[name] = !modals.value[name]
    } else {
      modals.value[name] = true
    }
  }

  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = String(++toastId)
    const toast: Toast = { id, message, type, duration }
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    sidebarOpen,
    theme,
    modals,
    toasts,
    toggleSidebar,
    setTheme,
    toggleModal,
    showToast,
    removeToast,
  }
})
