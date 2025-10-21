<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input, Alert } from '@/components'

interface Emit {
  (e: 'update', data: any[]): void
  (e: 'close'): void
}

const emit = defineEmits<Emit>()

const form = ref({
  balances: [{ id: '', newBalance: 0, available: 0, onHold: 0 }],
  operation: 'SET'
})

const errors = ref<string[]>([])
const isLoading = ref(false)

const addRow = () => {
  form.value.balances.push({ id: '', newBalance: 0, available: 0, onHold: 0 })
}

const removeRow = (index: number) => {
  form.value.balances.splice(index, 1)
}

const validate = () => {
  errors.value = []
  
  form.value.balances.forEach((bal, idx) => {
    if (!bal.id) {
      errors.value.push(`Row ${idx + 1}: Balance ID is required`)
    }
    if (bal.newBalance <= 0) {
      errors.value.push(`Row ${idx + 1}: Balance must be greater than 0`)
    }
    if (bal.available + bal.onHold > bal.newBalance) {
      errors.value.push(`Row ${idx + 1}: Available + On Hold cannot exceed balance`)
    }
  })
  
  return errors.value.length === 0
}

const handleSubmit = async () => {
  if (!validate()) return
  
  isLoading.value = true
  try {
    emit('update', form.value.balances)
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
    <Alert v-if="errors.length > 0" type="error">
      <ul class="list-disc pl-5">
        <li v-for="(err, idx) in errors" :key="idx">{{ err }}</li>
      </ul>
    </Alert>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Operation</label>
      <select v-model="form.operation" class="block w-full px-3 py-2 border border-gray-300 rounded-lg">
        <option value="SET">Set Balance</option>
        <option value="INCREMENT">Increment</option>
        <option value="DECREMENT">Decrement</option>
      </select>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-3 py-2 text-left font-semibold">Balance ID</th>
            <th class="px-3 py-2 text-right font-semibold">New Balance</th>
            <th class="px-3 py-2 text-right font-semibold">Available</th>
            <th class="px-3 py-2 text-right font-semibold">On Hold</th>
            <th class="px-3 py-2 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="(bal, idx) in form.balances" :key="idx">
            <td class="px-3 py-2">
              <Input v-model="bal.id" placeholder="BAL-001" />
            </td>
            <td class="px-3 py-2">
              <Input v-model.number="bal.newBalance" type="number" step="0.01" />
            </td>
            <td class="px-3 py-2">
              <Input v-model.number="bal.available" type="number" step="0.01" />
            </td>
            <td class="px-3 py-2">
              <Input v-model.number="bal.onHold" type="number" step="0.01" />
            </td>
            <td class="px-3 py-2 text-center">
              <Button v-if="form.balances.length > 1" @click="removeRow(idx)" variant="ghost" size="sm" class="text-red-600">Remove</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Button @click="addRow" variant="secondary" class="w-full">+ Add Row</Button>

    <div class="flex gap-2 justify-end pt-4">
      <Button @click="handleClose" variant="secondary">Cancel</Button>
      <Button @click="handleSubmit" variant="primary" :disabled="isLoading">
        {{ isLoading ? 'Updating...' : 'Update Balances' }}
      </Button>
    </div>
  </div>
</template>
