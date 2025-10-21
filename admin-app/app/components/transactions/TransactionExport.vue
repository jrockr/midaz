<script setup lang="ts">
import { ref } from 'vue'

const formats = ['CSV', 'JSON', 'PDF', 'Excel']
const selectedFormat = ref('CSV')

const handleExport = () => {
  console.log('Exporting as', selectedFormat.value)
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
    <h3 class="font-semibold text-gray-900">Export Transactions</h3>
    <select v-model="selectedFormat" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
      <option v-for="fmt in formats" :key="fmt">{{ fmt }}</option>
    </select>
    <button @click="handleExport" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      📥 Export as {{ selectedFormat }}
    </button>
  </div>
</template>
