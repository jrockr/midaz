<script setup lang="ts">
import { ref } from 'vue'

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: string
}

const attachments = ref<Attachment[]>([
  { id: '1', name: 'invoice.pdf', size: 245000, type: 'pdf', uploadedAt: new Date().toISOString() },
  { id: '2', name: 'receipt.jpg', size: 125000, type: 'image', uploadedAt: new Date(Date.now() - 3600000).toISOString() }
])

const formatSize = (bytes: number) => {
  const kb = Math.round(bytes / 1024)
  return kb > 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB'
}

const getIcon = (type: string) => {
  const icons: Record<string, string> = {
    'pdf': '📄',
    'image': '🖼',
    'document': '📋'
  }
  return icons[type] || '📎'
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-gray-900">Attachments</h3>

    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
      <p class="text-2xl mb-2">📎</p>
      <p class="text-sm text-gray-600">Drag files or click to upload</p>
    </div>

    <div v-if="attachments.length" class="space-y-2">
      <div v-for="file in attachments" :key="file.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-3">
          <span class="text-2xl">{{ getIcon(file.type) }}</span>
          <div class="text-sm">
            <p class="font-medium text-gray-900">{{ file.name }}</p>
            <p class="text-xs text-gray-600">{{ formatSize(file.size) }}</p>
          </div>
        </div>
        <button class="text-red-600 hover:text-red-700">✕</button>
      </div>
    </div>
  </div>
</template>
