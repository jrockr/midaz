<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button, Card, Input, Alert, Breadcrumb } from '@/components'
import { useLedgersStore } from '@/stores'
import type { Ledger } from '@/types'

const router = useRouter()
const route = useRoute()
const ledgersStore = useLedgersStore()

const ledger = ref<Ledger | null>(null)
const isEditing = ref(false)
const editForm = ref({
  name: '',
  description: '',
  status: 'ACTIVE' as const,
})

onMounted(async () => {
  const { id } = route.params
  isEditing.value = route.query.edit === 'true'

  try {
    const ledger_data = await ledgersStore.getById(id as string)
    ledger.value = ledger_data
    if (isEditing.value) {
      editForm.value = {
        name: ledger_data.name,
        description: ledger_data.description || '',
        status: ledger_data.status,
      }
    }
  } catch (error) {
    console.error('Failed to load ledger:', error)
  }
})

const handleSave = async () => {
  if (!ledger.value) return

  try {
    await ledgersStore.update(ledger.value.id, {
      name: editForm.value.name,
      description: editForm.value.description,
      status: editForm.value.status,
    })
    ledger.value.name = editForm.value.name
    ledger.value.description = editForm.value.description
    ledger.value.status = editForm.value.status
    isEditing.value = false
    alert('Ledger updated successfully')
  } catch (error) {
    console.error('Failed to update ledger:', error)
    alert('Failed to update ledger')
  }
}

const handleCancel = () => {
  isEditing.value = false
  if (ledger.value) {
    editForm.value = {
      name: ledger.value.name,
      description: ledger.value.description || '',
      status: ledger.value.status,
    }
  }
}
</script>

<template>
  <main class="flex-1 overflow-auto">
    <div class="px-6 py-8">
      <Breadcrumb class="mb-6" />
      
      <div v-if="ledger" class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ ledger.name }}</h1>
            <p class="text-gray-600 mt-2">Ledger Details</p>
          </div>
          <Button v-if="!isEditing" @click="isEditing = true" variant="primary">
            Edit
          </Button>
          <div v-else class="flex gap-2">
            <Button @click="handleCancel" variant="secondary">Cancel</Button>
            <Button @click="handleSave" variant="primary">Save</Button>
          </div>
        </div>

        <!-- Content -->
        <Card class="p-6">
          <div class="space-y-4">
            <div v-if="!isEditing">
              <p class="text-sm text-gray-600 mb-1">Ledger ID</p>
              <p class="font-mono text-sm">{{ ledger.id }}</p>
            </div>
            <div v-else class="space-y-2">
              <label class="block text-sm font-medium">Name</label>
              <Input v-model="editForm.name" type="text" />
            </div>

            <div v-if="!isEditing">
              <p class="text-sm text-gray-600 mb-1">Status</p>
              <p>{{ ledger.status }}</p>
            </div>
            <div v-else class="space-y-2">
              <label class="block text-sm font-medium">Status</label>
              <select v-model="editForm.status" class="w-full px-3 py-2 border rounded">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-600">Loading ledger details...</p>
      </div>
    </div>
  </main>
</template>
