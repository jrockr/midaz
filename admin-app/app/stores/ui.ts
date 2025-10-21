import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const theme = ref<'light' | 'dark'>('light')
  const modals = ref<Record<string, boolean>>({})

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

  return {
    sidebarOpen,
    theme,
    modals,
    toggleSidebar,
    setTheme,
    toggleModal,
  }
})
