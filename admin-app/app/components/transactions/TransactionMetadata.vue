<script setup lang="ts">
import { ref, computed } from 'vue'

interface Metadata {
  reference?: string
  description?: string
  tags?: string[]
  [key: string]: any
}

const props = defineProps<{
  modelValue?: Metadata
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Metadata]
}>()

const metadata = computed({
  get: () => props.modelValue || {},
  set: (value) => emit('update:modelValue', value)
})

const reference = computed({
  get: () => metadata.value.reference || '',
  set: (value) => {
    metadata.value = { ...metadata.value, reference: value }
  }
})

const description = computed({
  get: () => metadata.value.description || '',
  set: (value) => {
    metadata.value = { ...metadata.value, description: value }
  }
})

const tagInput = ref('')
const tags = computed({
  get: () => metadata.value.tags || [],
  set: (value) => {
    metadata.value = { ...metadata.value, tags: value }
  }
})

const addTag = () => {
  if (tagInput.value.trim()) {
    tags.value = [...tags.value, tagInput.value.trim()]
    tagInput.value = ''
  }
}

const removeTag = (index: number) => {
  tags.value = tags.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="metadata-editor space-y-6">
    <!-- Reference -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Reference / ID
      </label>
      <input
        v-model="reference"
        type="text"
        placeholder="e.g., TXN-2025-001"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <p class="text-xs text-gray-500 mt-1">Optional unique reference for this transaction</p>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <textarea
        v-model="description"
        placeholder="Add details about this transaction..."
        rows="4"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>

    <!-- Tags -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Tags
      </label>
      <div class="flex gap-2 mb-3">
        <input
          v-model="tagInput"
          type="text"
          placeholder="Add tag..."
          @keyup.enter="addTag"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          @click="addTag"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      <!-- Tag Display -->
      <div v-if="tags.length" class="flex flex-wrap gap-2">
        <span
          v-for="(tag, idx) in tags"
          :key="idx"
          class="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
        >
          {{ tag }}
          <button
            @click="removeTag(idx)"
            class="hover:text-blue-600 text-blue-600"
          >
            ✕
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
input:focus,
textarea:focus,
select:focus {
  outline: none;
}
</style>
