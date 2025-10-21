import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSegmentsStore = defineStore('segments', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  return { items, loading, error }
})
