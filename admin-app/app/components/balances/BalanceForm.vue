<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button, Input, Alert } from '@/components'

interface Props {
  balance?: any
}

interface Emit {
  (e: 'save', data: any): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const form = ref({
  balance: 0,
  available: 0,
  onHold: 0,
  metadata: ''
})

const errors = ref<Record<string, string>>({})
const isLoading = ref(false)

watch(() => props.balance, (newVal) => {
  if (newVal) {
    form.value = {
      balance: newVal.balance,
      available: newVal.available,
      onHold: newVal.onHold,
      metadata: JSON.stringify(newVal.metadata || {})
    }
  }
}, { immediate: true })

const validate = () => {
  errors.value = {}
  
  if (form.value.balance <= 0) {
    errors.value.balance = 'Balance must be greater than 0'
  }
  
  if (form.value.available < 0) {
    errors.value.available = 'Available cannot be negative'
  }
  
  if (form.value.onHold < 0) {
    errors.value.onHold = 'On hold cannot be negative'
  }
  
  if (form.value.available + form.value.onHold > form.value.balance) {
    errors.value.balance = 'Available + On Hold cannot exceed Total Balance'
  }

  try {
    JSON.parse(form.value.metadata)
  } catch {
    errors.value.metadata = 'Invalid JSON'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return
  
  isLoading.value = true
  try {
    emit('save', {
      ...form.value,
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
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Total Balance</label>
      <Input v-model.number="form.balance" type="number" step="0.01" placeholder="0.00" />
      <p v-if="errors.balance" class="text-red-600 text-sm mt-1">{{ errors.balance }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Available</label>
      <Input v-model.number="form.available" type="number" step="0.01" placeholder="0.00" />
      <p v-if="errors.available" class="text-red-600 text-sm mt-1">{{ errors.available }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">On Hold</label>
      <Input v-model.number="form.onHold" type="number" step="0.01" placeholder="0.00" />
      <p v-if="errors.onHold" class="text-red-600 text-sm mt-1">{{ errors.onHold }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Metadata (JSON)</label>
      <textarea v-model="form.metadata" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4"></textarea>
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
