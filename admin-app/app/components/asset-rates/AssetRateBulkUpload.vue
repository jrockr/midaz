<script setup lang="ts">
import { ref } from 'vue'
import { Button, Alert } from '@/components'

interface Emit {
  (e: 'upload', data: any[]): void
  (e: 'close'): void
}

const emit = defineEmits<Emit>()

const csvContent = ref('')
const errors = ref<string[]>([])
const isLoading = ref(false)
const preview = ref<any[]>([])

const parseCSV = () => {
  errors.value = []
  preview.value = []
  
  const lines = csvContent.value.trim().split('\n')
  if (lines.length < 2) {
    errors.value.push('CSV must contain header and at least one data row')
    return
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const requiredHeaders = ['sourceasset', 'destinationasset', 'rate', 'effectivedate']
  
  for (const header of requiredHeaders) {
    if (!headers.includes(header)) {
      errors.value.push(`Missing required column: ${header}`)
      return
    }
  }

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    
    if (values.length < 4) {
      errors.value.push(`Row ${i + 1}: Insufficient columns`)
      continue
    }

    const [sourceAsset, destinationAsset, rateStr, effectiveDate] = values

    if (!sourceAsset || !destinationAsset) {
      errors.value.push(`Row ${i + 1}: Missing asset`)
      continue
    }

    const rate = parseFloat(rateStr)
    if (isNaN(rate) || rate <= 0) {
      errors.value.push(`Row ${i + 1}: Invalid rate`)
      continue
    }

    preview.value.push({
      sourceAsset,
      destinationAsset,
      rate,
      reverseRate: parseFloat((1 / rate).toFixed(8)),
      effectiveDate,
      status: 'ACTIVE'
    })
  }

  if (preview.value.length === 0 && errors.value.length === 0) {
    errors.value.push('No valid data rows found')
  }
}

const handleUpload = async () => {
  parseCSV()
  if (errors.value.length > 0 || preview.value.length === 0) return
  
  isLoading.value = true
  try {
    emit('upload', preview.value)
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  emit('close')
}

const downloadTemplate = () => {
  const csv = 'sourceAsset,destinationAsset,rate,effectiveDate\nUSD,EUR,1.08,2025-10-21\nEUR,GBP,0.86,2025-10-21\nGBP,JPY,155.20,2025-10-21'
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'asset-rates-template.csv'
  link.click()
}
</script>

<template>
  <div class="space-y-4 max-h-96 overflow-y-auto">
    <Alert v-if="errors.length > 0" type="error">
      <ul class="list-disc pl-5">
        <li v-for="(err, idx) in errors" :key="idx" class="text-sm">{{ err }}</li>
      </ul>
    </Alert>

    <div>
      <div class="flex justify-between items-center mb-2">
        <label class="block text-sm font-medium text-gray-700">Paste CSV Data</label>
        <Button @click="downloadTemplate" variant="ghost" size="sm">📥 Download Template</Button>
      </div>
      <textarea 
        v-model="csvContent" 
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        rows="6"
        placeholder="sourceAsset,destinationAsset,rate,effectiveDate&#10;USD,EUR,1.08,2025-10-21"
      ></textarea>
    </div>

    <div v-if="preview.length > 0" class="bg-blue-50 rounded-lg p-4">
      <p class="text-sm font-semibold text-blue-900 mb-2">Preview ({{ preview.length }} records)</p>
      <div class="space-y-2 max-h-40 overflow-y-auto">
        <div v-for="(record, idx) in preview.slice(0, 5)" :key="idx" class="text-xs bg-white rounded px-2 py-1 flex justify-between">
          <span>{{ record.sourceAsset }} → {{ record.destinationAsset }}</span>
          <span class="font-semibold">{{ record.rate.toFixed(8) }}</span>
        </div>
        <p v-if="preview.length > 5" class="text-xs text-gray-600">... and {{ preview.length - 5 }} more</p>
      </div>
    </div>

    <div class="flex gap-2 justify-end pt-4">
      <Button @click="handleClose" variant="secondary">Cancel</Button>
      <Button @click="handleUpload" variant="primary" :disabled="isLoading || preview.length === 0">
        {{ isLoading ? 'Uploading...' : `Upload ${preview.length} Records` }}
      </Button>
    </div>
  </div>
</template>
