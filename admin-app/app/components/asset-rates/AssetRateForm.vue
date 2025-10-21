<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button, Input, Alert } from '@/components'

interface Props {
  assetRate?: any
}

interface Emit {
  (e: 'save', data: any): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const form = ref({
  sourceAsset: '',
  destinationAsset: '',
  rate: 0,
  reverseRate: 0,
  effectiveDate: new Date().toISOString().split('T')[0],
  status: 'ACTIVE',
  metadata: ''
})

const assets = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL']
const errors = ref<Record<string, string>>({})
const isLoading = ref(false)

watch(() => props.assetRate, (newVal) => {
  if (newVal) {
    form.value = {
      sourceAsset: newVal.sourceAsset,
      destinationAsset: newVal.destinationAsset,
      rate: newVal.rate,
      reverseRate: newVal.reverseRate || (1 / newVal.rate),
      effectiveDate: newVal.effectiveDate,
      status: newVal.status,
      metadata: JSON.stringify(newVal.metadata || {})
    }
  }
}, { immediate: true })

const calculateReverseRate = () => {
  if (form.value.rate > 0) {
    form.value.reverseRate = parseFloat((1 / form.value.rate).toFixed(8))
  }
}

const validate = () => {
  errors.value = {}
  
  if (!form.value.sourceAsset) {
    errors.value.sourceAsset = 'Source asset is required'
  }
  
  if (!form.value.destinationAsset) {
    errors.value.destinationAsset = 'Destination asset is required'
  }
  
  if (form.value.sourceAsset === form.value.destinationAsset) {
    errors.value.destinationAsset = 'Source and destination assets must be different'
  }
  
  if (form.value.rate <= 0) {
    errors.value.rate = 'Rate must be greater than 0'
  }
  
  if (!form.value.effectiveDate) {
    errors.value.effectiveDate = 'Effective date is required'
  }

  try {
    JSON.parse(form.value.metadata)
  } catch {
    errors.value.metadata = 'Invalid JSON'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  calculateReverseRate()
  if (!validate()) return
  
  isLoading.value = true
  try {
    emit('save', {
      sourceAsset: form.value.sourceAsset,
      destinationAsset: form.value.destinationAsset,
      rate: form.value.rate,
      reverseRate: form.value.reverseRate,
      effectiveDate: form.value.effectiveDate,
      status: form.value.status,
      metadata: JSON.parse(form.value.metadata)
    })
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Source Asset</label>
        <select v-model="form.sourceAsset" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">Select asset</option>
          <option v-for="asset in assets" :key="asset" :value="asset">{{ asset }}</option>
        </select>
        <p v-if="errors.sourceAsset" class="text-red-600 text-sm mt-1">{{ errors.sourceAsset }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Destination Asset</label>
        <select v-model="form.destinationAsset" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">Select asset</option>
          <option v-for="asset in assets" :key="asset" :value="asset">{{ asset }}</option>
        </select>
        <p v-if="errors.destinationAsset" class="text-red-600 text-sm mt-1">{{ errors.destinationAsset }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Rate</label>
        <Input v-model.number="form.rate" type="number" step="0.00000001" placeholder="1.2500" @blur="calculateReverseRate" />
        <p v-if="errors.rate" class="text-red-600 text-sm mt-1">{{ errors.rate }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Reverse Rate</label>
        <Input :value="form.reverseRate.toFixed(8)" type="text" disabled placeholder="Auto-calculated" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
        <Input v-model="form.effectiveDate" type="date" />
        <p v-if="errors.effectiveDate" class="text-red-600 text-sm mt-1">{{ errors.effectiveDate }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select v-model="form.status" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Metadata (JSON)</label>
      <textarea v-model="form.metadata" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
      <p v-if="errors.metadata" class="text-red-600 text-sm mt-1">{{ errors.metadata }}</p>
    </div>

    <div class="flex gap-2 justify-end pt-4">
      <Button @click="handleClose" variant="secondary">Cancel</Button>
      <Button @click="handleSubmit" variant="primary" :disabled="isLoading">
        {{ isLoading ? 'Saving...' : 'Save' }}
      </Button>
    </div>
  </div>
</template>
