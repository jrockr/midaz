<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  'upload': [file: File]
}>()

const dragOver = ref(false)
const selectedFile = ref<File | null>(null)
const progress = ref(0)

const handleDrop = (e: DragEvent) => {
  dragOver.value = false
  const files = e.dataTransfer?.files
  if (files?.[0]) {
    selectedFile.value = files[0]
  }
}

const handleSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) {
    selectedFile.value = target.files[0]
  }
}

const handleUpload = () => {
  if (!selectedFile.value) return
  
  // Simulate upload progress
  let current = 0
  const interval = setInterval(() => {
    current += Math.random() * 30
    if (current >= 100) {
      progress.value = 100
      clearInterval(interval)
      emit('upload', selectedFile.value!)
    } else {
      progress.value = current
    }
  }, 300)
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Batch Transaction Upload</h2>

    <!-- Upload Area -->
    <div
      @drop="handleDrop"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      :class="['border-2 border-dashed rounded-lg p-12 text-center transition', dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50']"
    >
      <div class="text-5xl mb-4">📁</div>
      <p class="font-semibold text-gray-900 mb-2">Drag and drop your CSV file</p>
      <p class="text-gray-600 mb-4">or</p>
      <label class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer inline-block">
        Select File
        <input type="file" accept=".csv" @change="handleSelect" class="hidden" />
      </label>
    </div>

    <!-- Selected File -->
    <div v-if="selectedFile" class="bg-white border border-gray-200 rounded-lg p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="text-2xl">📄</span>
          <div>
            <p class="font-semibold text-gray-900">{{ selectedFile.name }}</p>
            <p class="text-sm text-gray-600">{{ (selectedFile.size / 1024).toFixed(2) }} KB</p>
          </div>
        </div>
        <button @click="selectedFile = null" class="text-red-600 hover:text-red-700">✕</button>
      </div>

      <!-- Progress -->
      <div v-if="progress > 0" class="mb-4">
        <div class="flex justify-between mb-2">
          <span class="text-sm text-gray-600">Uploading...</span>
          <span class="text-sm font-semibold text-gray-900">{{ Math.round(progress) }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full transition-all" :style="{ width: `${progress}%` }" />
        </div>
      </div>

      <!-- Upload Button -->
      <button
        v-if="progress === 0"
        @click="handleUpload"
        class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Upload Batch
      </button>

      <div v-else-if="progress === 100" class="text-center p-4 bg-green-50 rounded-lg">
        <p class="text-green-800 font-medium">✓ Upload Complete!</p>
      </div>
    </div>

    <!-- Instructions -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 class="font-semibold text-blue-900 mb-2">CSV Format Requirements</h3>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• Column 1: Transaction Type (SIMPLE, COMPLEX)</li>
        <li>• Column 2: Source Account ID</li>
        <li>• Column 3: Destination Account ID</li>
        <li>• Column 4: Amount</li>
        <li>• Column 5: Asset (USD, EUR, etc.)</li>
      </ul>
    </div>
  </div>
</template>
