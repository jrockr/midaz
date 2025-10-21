<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button, Card, Input, Alert, Spinner } from '@/components'
import { useOrganizationsStore } from '@/stores'
import type { Organization } from '@/types'

const router = useRouter()
const route = useRoute()
const organizationsStore = useOrganizationsStore()

const organization = ref<Organization | null>(null)
const isEditing = ref(false)
const editForm = ref({
  name: '',
  status: 'active' as const,
})

onMounted(async () => {
  const { id } = route.params
  isEditing.value = route.query.edit === 'true'

  try {
    const org = await organizationsStore.getById(id as string)
    organization.value = org
    if (isEditing.value) {
      editForm.value = {
        name: org.name,
        status: org.status,
      }
    }
  } catch (error) {
    console.error('Failed to load organization:', error)
  }
})

const handleSave = async () => {
  if (!organization.value) return

  try {
    await organizationsStore.update(organization.value.id, {
      name: editForm.value.name,
      status: editForm.value.status,
    })
    organization.value.name = editForm.value.name
    organization.value.status = editForm.value.status
    isEditing.value = false
    alert('Organization updated successfully')
  } catch (error) {
    console.error('Failed to update organization:', error)
    alert('Failed to update organization')
  }
}

const handleCancel = () => {
  isEditing.value = false
  if (organization.value) {
    editForm.value = {
      name: organization.value.name,
      status: organization.value.status,
    }
  }
}

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString()
  } catch {
    return dateString
  }
}
</script>

<template>
  <main class="flex-1 overflow-auto">
    <div class="px-6 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <button
            @click="router.back()"
            class="text-blue-600 hover:text-blue-900 font-medium"
          >
            ← Back
          </button>
          <div>
            <h1 v-if="organization" class="text-3xl font-bold text-gray-900">
              {{ organization.name }}
            </h1>
            <p class="text-gray-600 mt-2">Organization Details</p>
          </div>
        </div>
        <div class="flex gap-2">
          <Button
            v-if="!isEditing"
            @click="isEditing = true"
            variant="primary"
          >
            Edit
          </Button>
          <div v-else class="flex gap-2">
            <Button @click="handleCancel" variant="secondary">Cancel</Button>
            <Button @click="handleSave" variant="primary">Save</Button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="organizationsStore.loading && !organization" class="flex items-center justify-center py-12">
        <Spinner size="md" />
      </div>

      <!-- Error Alert -->
      <Alert v-if="organizationsStore.error" type="error" class="mb-6">
        {{ organizationsStore.error }}
      </Alert>

      <!-- Organization Details -->
      <div v-if="organization" class="space-y-6">
        <!-- General Information -->
        <Card class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">General Information</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Organization ID</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                {{ organization.id }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <div v-if="!isEditing" class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                {{ organization.name }}
              </div>
              <Input
                v-else
                v-model="editForm.name"
                type="text"
                placeholder="Organization name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div v-if="!isEditing" class="flex items-center gap-2">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    organization.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ organization.status }}
                </span>
              </div>
              <select
                v-else
                v-model="editForm.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </Card>

        <!-- Metadata -->
        <Card class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Metadata</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Created At</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm">
                {{ formatDate(organization.createdAt) }}
              </div>
            </div>

            <div v-if="organization.updatedAt">
              <label class="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm">
                {{ formatDate(organization.updatedAt) }}
              </div>
            </div>
          </div>
        </Card>

        <!-- Related Resources -->
        <Card class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Related Resources</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              @click="router.push('/ledgers')"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 class="font-medium text-gray-900">Ledgers</h3>
              <p class="text-sm text-gray-600 mt-1">View organization ledgers</p>
            </button>
            <button
              @click="router.push('/accounts')"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 class="font-medium text-gray-900">Accounts</h3>
              <p class="text-sm text-gray-600 mt-1">View organization accounts</p>
            </button>
            <button
              @click="router.push('/operations')"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 class="font-medium text-gray-900">Operations</h3>
              <p class="text-sm text-gray-600 mt-1">View organization operations</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  </main>
</template>
