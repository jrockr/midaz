<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { Button, Input, Modal, Alert, Card } from '@/components'
import type { Organization, CreateOrganizationDto, UpdateOrganizationDto, Address } from '@/types'
import { useOrganizationsStore } from '@/stores'

interface Props {
  organization?: Organization | null
  isLoading?: boolean
  isEditing?: boolean
}

interface Emits {
  submit: (data: CreateOrganizationDto | UpdateOrganizationDto) => void
  cancel: () => void
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isEditing: false,
})

const emit = defineEmits<Emits>()
const organizationsStore = useOrganizationsStore()

const STORAGE_KEY = 'organization-form-draft'

const formData = reactive<{
  legalName: string
  legalDocument: string
  doingBusinessAs: string
  parentOrganizationId: string | null
  address: Address
  status: { code: 'ACTIVE' | 'INACTIVE' }
  metadata: Record<string, unknown>
}>({
  legalName: '',
  legalDocument: '',
  doingBusinessAs: '',
  parentOrganizationId: null,
  address: {
    line1: '',
    line2: '',
    zipCode: '',
    city: '',
    state: '',
    country: '',
  },
  status: { code: 'ACTIVE' },
  metadata: {},
})

const errors = reactive<Record<string, string>>({})
const showMetadataEditor = ref(false)
const metadataJson = ref('{}')
const dirtyFields = ref<Set<string>>(new Set())
const showParentSelector = ref(false)

// Computed properties
const hasErrors = computed(() => Object.keys(errors).length > 0)
const isDirty = computed(() => dirtyFields.value.size > 0)
const formTitle = computed(() => (props.isEditing ? 'Edit Organization' : 'Create Organization'))
const parentOrganizations = computed(() => 
  organizationsStore.items.filter(org => org.id !== props.organization?.id)
)
const selectedParentName = computed(() => 
  organizationsStore.items.find(org => org.id === formData.parentOrganizationId)?.legalName || 'No parent selected'
)

// Initialize form with existing data or from localStorage
onMounted(() => {
  try {
    if (props.organization) {
      formData.legalName = props.organization.legalName
      formData.legalDocument = props.organization.legalDocument
      formData.doingBusinessAs = props.organization.doingBusinessAs || ''
      formData.parentOrganizationId = props.organization.parentOrganizationId || null
      formData.address = props.organization.address || {
        line1: '',
        line2: '',
        zipCode: '',
        city: '',
        state: '',
        country: '',
      }
      formData.status = props.organization.status || { code: 'ACTIVE' }
      formData.metadata = props.organization.metadata || {}
      metadataJson.value = JSON.stringify(props.organization.metadata || {}, null, 2)
    } else {
      // Load from localStorage if not editing
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        Object.assign(formData, parsed)
        metadataJson.value = JSON.stringify(parsed.metadata || {}, null, 2)
      }
    }
  } catch (e) {
    console.error('Failed to initialize form:', e)
  }
})

// Validation
const validateForm = () => {
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })

  if (!formData.legalName?.trim()) {
    errors.legalName = 'Legal name is required'
  } else if (formData.legalName.length < 2) {
    errors.legalName = 'Legal name must be at least 2 characters'
  }

  if (!formData.legalDocument?.trim()) {
    errors.legalDocument = 'Legal document is required'
  } else if (formData.legalDocument.length < 2) {
    errors.legalDocument = 'Legal document must be at least 2 characters'
  }

  if (formData.address.line1 && formData.address.line1.length > 256) {
    errors.address = 'Address line 1 must not exceed 256 characters'
  }

  return !hasErrors.value
}

const parseMetadataJson = () => {
  try {
    const parsed = JSON.parse(metadataJson.value)
    if (typeof parsed !== 'object' || Array.isArray(parsed)) {
      errors.metadata = 'Metadata must be a valid JSON object'
      return false
    }
    formData.metadata = parsed
    delete errors.metadata
    return true
  } catch (e) {
    errors.metadata = `Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`
    return false
  }
}

const updateMetadata = () => {
  if (!parseMetadataJson()) {
    return
  }
  showMetadataEditor.value = false
  dirtyFields.value.add('metadata')
  saveToLocalStorage()
}

// Track dirty fields
const markDirty = (field: string) => {
  dirtyFields.value.add(field)
  saveToLocalStorage()
}

// localStorage management
const saveToLocalStorage = () => {
  if (!props.isEditing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
  }
}

const clearLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY)
}

const resetForm = () => {
  if (!isDirty.value) return
  if (confirm('Are you sure you want to discard your changes?')) {
    Object.assign(formData, {
      legalName: props.organization?.legalName || '',
      legalDocument: props.organization?.legalDocument || '',
      doingBusinessAs: props.organization?.doingBusinessAs || '',
      parentOrganizationId: props.organization?.parentOrganizationId || null,
      address: props.organization?.address || {
        line1: '',
        line2: '',
        zipCode: '',
        city: '',
        state: '',
        country: '',
      },
      status: props.organization?.status || { code: 'ACTIVE' },
      metadata: props.organization?.metadata || {},
    })
    metadataJson.value = JSON.stringify(props.organization?.metadata || {}, null, 2)
    dirtyFields.value.clear()
    Object.assign(errors, {})
    clearLocalStorage()
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  if (!parseMetadataJson()) {
    return
  }

  const payload = props.isEditing
    ? ({
        legalName: formData.legalName,
        legalDocument: formData.legalDocument,
        doingBusinessAs: formData.doingBusinessAs,
        parentOrganizationId: formData.parentOrganizationId,
        address: formData.address,
        status: formData.status,
        metadata: formData.metadata,
      } as UpdateOrganizationDto)
    : ({
        legalName: formData.legalName,
        legalDocument: formData.legalDocument,
        doingBusinessAs: formData.doingBusinessAs,
        parentOrganizationId: formData.parentOrganizationId,
        address: formData.address,
        status: formData.status,
        metadata: formData.metadata,
      } as CreateOrganizationDto)

  emit('submit', payload)
  clearLocalStorage()
  dirtyFields.value.clear()
}

const handleCancel = () => {
  if (isDirty.value && !confirm('You have unsaved changes. Discard them?')) {
    return
  }
  clearLocalStorage()
  emit('cancel')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Errors Alert -->
    <Alert v-if="hasErrors" type="error">
      <div class="text-sm">
        <p class="font-semibold mb-2">Please fix the following errors:</p>
        <ul class="list-disc list-inside space-y-1">
          <li v-for="(error, field) in errors" :key="field" v-show="error">
            {{ error }}
          </li>
        </ul>
      </div>
    </Alert>

    <!-- Main Form Fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Legal Name Field -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Legal Name <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="formData.legalName"
          type="text"
          placeholder="e.g., Lerian Financial Services Ltd."
          :error="errors.legalName as string"
          @update:modelValue="markDirty('legalName')"
          class="w-full"
        />
        <p v-if="errors.legalName" class="text-red-600 text-xs mt-1">{{ errors.legalName }}</p>
      </div>

      <!-- Legal Document Field -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Legal Document <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="formData.legalDocument"
          type="text"
          placeholder="e.g., 123456789012345"
          :error="errors.legalDocument as string"
          @update:modelValue="markDirty('legalDocument')"
          class="w-full"
        />
        <p v-if="errors.legalDocument" class="text-red-600 text-xs mt-1">{{ errors.legalDocument }}</p>
      </div>

      <!-- Doing Business As Field (Full Width) -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Doing Business As
        </label>
        <Input
          v-model="formData.doingBusinessAs"
          type="text"
          placeholder="e.g., Lerian FS"
          @update:modelValue="markDirty('doingBusinessAs')"
          class="w-full"
        />
      </div>

      <!-- Parent Organization Field (Full Width) -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Parent Organization
        </label>
        <div class="flex gap-2">
          <div class="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm flex items-center">
            {{ selectedParentName }}
          </div>
          <Button 
            type="button"
            variant="secondary"
            size="md"
            @click="showParentSelector = true"
          >
            Select
          </Button>
        </div>
      </div>

      <!-- Status Field -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Status <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.status.code"
          @change="markDirty('status')"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>
    </div>

    <!-- Address Section -->
    <Card class="bg-gray-50 p-4">
      <div class="mb-4">
        <h3 class="text-sm font-semibold text-gray-900">Address Information</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Address Line 1 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Address Line 1
          </label>
          <Input
            v-model="formData.address.line1"
            type="text"
            placeholder="Street address"
            @update:modelValue="markDirty('address')"
            class="w-full"
          />
        </div>

        <!-- Address Line 2 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Address Line 2
          </label>
          <Input
            v-model="formData.address.line2"
            type="text"
            placeholder="Apartment, suite, etc."
            @update:modelValue="markDirty('address')"
            class="w-full"
          />
        </div>

        <!-- City -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <Input
            v-model="formData.address.city"
            type="text"
            placeholder="City name"
            @update:modelValue="markDirty('address')"
            class="w-full"
          />
        </div>

        <!-- State -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            State/Province
          </label>
          <Input
            v-model="formData.address.state"
            type="text"
            placeholder="State or province"
            @update:modelValue="markDirty('address')"
            class="w-full"
          />
        </div>

        <!-- Zip Code -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Zip/Postal Code
          </label>
          <Input
            v-model="formData.address.zipCode"
            type="text"
            placeholder="Postal code"
            @update:modelValue="markDirty('address')"
            class="w-full"
          />
        </div>

        <!-- Country -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <Input
            v-model="formData.address.country"
            type="text"
            placeholder="Country code (e.g., US)"
            @update:modelValue="markDirty('address')"
            class="w-full"
            maxlength="2"
          />
        </div>
      </div>
      <p v-if="errors.address" class="text-red-600 text-xs mt-2">{{ errors.address }}</p>
    </Card>

    <!-- Metadata Section -->
    <Card class="bg-gray-50 p-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-gray-900">Metadata</h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          @click="showMetadataEditor = true"
        >
          <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit JSON
        </Button>
      </div>

      <div class="bg-white p-3 rounded border border-gray-200 max-h-32 overflow-auto">
        <pre class="text-xs text-gray-600 font-mono">{{ metadataJson }}</pre>
      </div>

      <p v-if="errors.metadata" class="text-red-600 text-xs mt-2">{{ errors.metadata }}</p>
    </Card>

    <!-- Metadata Editor Modal -->
    <Modal v-model="showMetadataEditor" title="Edit Metadata">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            JSON Metadata
          </label>
          <textarea
            v-model="metadataJson"
            class="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder='{"key": "value"}'
          />
        </div>
        <Alert type="info" class="text-xs">
          Enter valid JSON object (not array). Use empty {} for no metadata.
        </Alert>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button @click="showMetadataEditor = false" variant="secondary">
            Cancel
          </Button>
          <Button @click="updateMetadata" variant="primary">
            Update Metadata
          </Button>
        </div>
      </template>
    </Modal>

    <!-- Parent Organization Selector Modal -->
    <Modal v-model="showParentSelector" title="Select Parent Organization" size="lg">
      <div class="space-y-4">
        <div v-if="parentOrganizations.length === 0" class="text-center py-6">
          <p class="text-gray-600">No parent organizations available</p>
        </div>
        <div v-else class="max-h-96 overflow-y-auto">
          <div 
            v-for="org in parentOrganizations" 
            :key="org.id"
            @click="formData.parentOrganizationId = org.id; showParentSelector = false; markDirty('parentOrganizationId')"
            class="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
            :class="{ 'bg-blue-50 border-blue-500': formData.parentOrganizationId === org.id }"
          >
            <div class="font-medium text-gray-900">{{ org.legalName }}</div>
            <div class="text-sm text-gray-600">{{ org.doingBusinessAs || 'N/A' }}</div>
            <div class="text-xs text-gray-500 mt-1">ID: {{ org.id }}</div>
          </div>
        </div>
        <Button 
          type="button"
          variant="secondary"
          class="w-full"
          @click="() => { formData.parentOrganizationId = null; showParentSelector = false; markDirty('parentOrganizationId') }"
        >
          Clear Parent Organization
        </Button>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button @click="showParentSelector = false" variant="secondary">
            Cancel
          </Button>
        </div>
      </template>
    </Modal>

    <!-- Form Actions -->
    <div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
      <Button
        type="button"
        variant="secondary"
        @click="resetForm"
        :disabled="!isDirty"
      >
        Reset
      </Button>
      <Button
        type="button"
        variant="secondary"
        @click="handleCancel"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="primary"
        :disabled="isLoading || hasErrors"
      >
        {{ isLoading ? 'Saving...' : (isEditing ? 'Update Organization' : 'Create Organization') }}
      </Button>
    </div>

    <!-- Dirty State Indicator -->
    <div v-if="isDirty && !props.isEditing" class="text-xs text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-200">
      💾 Form has unsaved changes (auto-saving to browser)
    </div>
  </form>
</template>
