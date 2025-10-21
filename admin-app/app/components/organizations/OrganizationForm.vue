<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { Button, Input, Modal, Alert, Card } from '@/components'
import type { Organization, CreateOrganizationDto, UpdateOrganizationDto } from '@/types'

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

const STORAGE_KEY = 'organization-form-draft'

const formData = reactive<{
  name: string
  code: string
  description: string
  parentId: string | null
  metadata: Record<string, unknown>
}>({
  name: '',
  code: '',
  description: '',
  parentId: null,
  metadata: {},
})

const errors = reactive<Record<string, string>>({})
const showMetadataEditor = ref(false)
const metadataJson = ref('{}')
const dirtyFields = ref<Set<string>>(new Set())

// Computed properties
const hasErrors = computed(() => Object.keys(errors).length > 0)
const isDirty = computed(() => dirtyFields.value.size > 0)
const formTitle = computed(() => (props.isEditing ? 'Edit Organization' : 'Create Organization'))

// Initialize form with existing data or from localStorage
onMounted(() => {
  if (props.organization) {
    formData.name = props.organization.name
    formData.code = props.organization.code || ''
    formData.description = props.organization.description || ''
    formData.parentId = props.organization.parentId || null
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
})

// Validation
const validateForm = () => {
  errors.name = ''
  errors.code = ''
  errors.description = ''

  if (!formData.name?.trim()) {
    errors.name = 'Organization name is required'
  } else if (formData.name.length < 2) {
    errors.name = 'Organization name must be at least 2 characters'
  }

  if (formData.code && formData.code.length < 2) {
    errors.code = 'Code must be at least 2 characters'
  }

  if (formData.description && formData.description.length > 500) {
    errors.description = 'Description must not exceed 500 characters'
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
      name: props.organization?.name || '',
      code: props.organization?.code || '',
      description: props.organization?.description || '',
      parentId: props.organization?.parentId || null,
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
        name: formData.name,
        code: formData.code,
        description: formData.description,
        parentId: formData.parentId,
        metadata: formData.metadata,
      } as UpdateOrganizationDto)
    : ({
        name: formData.name,
        code: formData.code,
        description: formData.description,
        parentId: formData.parentId,
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
      <!-- Name Field -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Organization Name <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="formData.name"
          type="text"
          placeholder="e.g., Acme Corporation"
          :error="errors.name || ''"
          @update:modelValue="markDirty('name')"
          class="w-full"
        />
        <p v-if="errors.name" class="text-red-600 text-xs mt-1">{{ errors.name }}</p>
      </div>

      <!-- Code Field -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Organization Code
        </label>
        <Input
          v-model="formData.code"
          type="text"
          placeholder="e.g., ACME"
          :error="errors.code || ''"
          @update:modelValue="markDirty('code')"
          class="w-full"
        />
        <p v-if="errors.code" class="text-red-600 text-xs mt-1">{{ errors.code }}</p>
      </div>

      <!-- Description Field (Full Width) -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          v-model="formData.description"
          placeholder="Provide a description for this organization"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="4"
          @change="markDirty('description')"
        />
        <p v-if="errors.description" class="text-red-600 text-xs mt-1">{{ errors.description }}</p>
        <p class="text-gray-500 text-xs mt-1">
          {{ formData.description.length }} / 500 characters
        </p>
      </div>
    </div>

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
