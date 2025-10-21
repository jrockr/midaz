<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Code -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Code <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.code"
        type="text"
        placeholder="e.g., USD, EUR, BTC"
        :disabled="isEditing"
        maxlength="10"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed uppercase"
        @blur="validateCode"
      />
      <p v-if="errors.code" class="mt-1 text-sm text-red-500">
        {{ errors.code }}
      </p>
    </div>

    <!-- Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Name <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.name"
        type="text"
        placeholder="e.g., United States Dollar"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="validateName"
      />
      <p v-if="errors.name" class="mt-1 text-sm text-red-500">
        {{ errors.name }}
      </p>
    </div>

    <!-- Type Selector -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Type <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.type"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="validateType"
      >
        <option value="">Select a type</option>
        <option v-for="t in assetTypes" :key="t" :value="t">
          {{ t }}
        </option>
      </select>
      <p v-if="errors.type" class="mt-1 text-sm text-red-500">
        {{ errors.type }}
      </p>
    </div>

    <!-- Decimals -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Decimals <span class="text-red-500">*</span>
      </label>
      <input
        v-model.number="form.decimals"
        type="number"
        min="0"
        max="8"
        placeholder="e.g., 2 (for USD)"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="validateDecimals"
      />
      <p class="mt-1 text-xs text-gray-500">Number of decimal places (0-8)</p>
      <p v-if="errors.decimals" class="mt-1 text-sm text-red-500">
        {{ errors.decimals }}
      </p>
    </div>

    <!-- Status -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Status
      </label>
      <div class="flex gap-4">
        <label class="flex items-center">
          <input
            v-model="form.status"
            type="radio"
            value="ACTIVE"
            class="mr-2"
          />
          <span>Active</span>
        </label>
        <label class="flex items-center">
          <input
            v-model="form.status"
            type="radio"
            value="INACTIVE"
            class="mr-2"
          />
          <span>Inactive</span>
        </label>
      </div>
    </div>

    <!-- Metadata Editor -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-gray-700">
          Metadata (JSON)
        </label>
        <button
          type="button"
          @click="showMetadataModal = true"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Edit JSON
        </button>
      </div>
      <div class="p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 font-mono">
        {{ metadataPreview }}
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        :disabled="isLoading"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {{ isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create' }}
      </button>
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        v-if="isDirty"
        type="button"
        @click="resetForm"
        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 ml-auto"
      >
        Reset
      </button>
    </div>

    <!-- Metadata Modal -->
    <div v-if="showMetadataModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-auto">
        <h3 class="text-lg font-semibold mb-4">Edit Metadata</h3>
        <textarea
          v-model="metadataJson"
          class="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
          placeholder="{}"
        />
        <p v-if="metadataError" class="mt-2 text-sm text-red-500">
          {{ metadataError }}
        </p>
        <div class="flex gap-2 mt-4">
          <button
            type="button"
            @click="saveMetadata"
            class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            @click="showMetadataModal = false"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Asset, CreateAssetDto, UpdateAssetDto } from '@/types'

interface Props {
  asset?: Asset | null
  isLoading?: boolean
}

interface Emits {
  (e: 'submit', payload: CreateAssetDto | UpdateAssetDto): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const assetTypes = ['CURRENCY', 'SECURITY', 'COMMODITY', 'CRYPTO', 'OTHER']

const form = ref({
  code: '',
  name: '',
  type: '',
  decimals: 2,
  status: 'ACTIVE' as const,
  metadata: {} as Record<string, unknown>
})

const initialForm = ref({ ...form.value })
const errors = ref({
  code: '',
  name: '',
  type: '',
  decimals: ''
})

const showMetadataModal = ref(false)
const metadataJson = ref('{}')
const metadataError = ref('')

const isDirty = computed(() =>
  JSON.stringify(form.value) !== JSON.stringify(initialForm.value)
)

const metadataPreview = computed(() => {
  const keys = Object.keys(form.value.metadata)
  if (keys.length === 0) return '{}'
  return `{ ${keys.slice(0, 2).map(k => `"${k}": ...`).join(', ')}${keys.length > 2 ? ', ...' : ''} }`
})

watch(
  () => props.asset,
  (newAsset) => {
    if (newAsset) {
      form.value = {
        code: newAsset.code,
        name: newAsset.name,
        type: newAsset.type,
        decimals: newAsset.decimals,
        status: newAsset.status,
        metadata: newAsset.metadata || {}
      }
      initialForm.value = { ...form.value }
      metadataJson.value = JSON.stringify(form.value.metadata, null, 2)
    }
  }
)

const validateCode = () => {
  if (!form.value.code.trim()) {
    errors.value.code = 'Code is required'
  } else if (form.value.code.length < 1 || form.value.code.length > 10) {
    errors.value.code = 'Code must be 1-10 characters'
  } else {
    errors.value.code = ''
  }
}

const validateName = () => {
  errors.value.name = form.value.name.trim() ? '' : 'Name is required'
}

const validateType = () => {
  errors.value.type = form.value.type ? '' : 'Type is required'
}

const validateDecimals = () => {
  if (form.value.decimals < 0 || form.value.decimals > 8) {
    errors.value.decimals = 'Decimals must be between 0 and 8'
  } else {
    errors.value.decimals = ''
  }
}

const validateForm = () => {
  validateCode()
  validateName()
  validateType()
  validateDecimals()
  return !errors.value.code && !errors.value.name && !errors.value.type && !errors.value.decimals
}

const saveMetadata = () => {
  try {
    form.value.metadata = JSON.parse(metadataJson.value)
    metadataError.value = ''
    showMetadataModal.value = false
  } catch (e) {
    metadataError.value = 'Invalid JSON'
  }
}

const handleSubmit = async () => {
  if (!validateForm()) return

  const payload: CreateAssetDto | UpdateAssetDto = {
    name: form.value.name,
    code: form.value.code,
    type: form.value.type,
    decimals: form.value.decimals,
    status: form.value.status,
    metadata: form.value.metadata
  }

  const emit = defineEmits<Emits>()[0]
  emit('submit', payload)
}


const resetForm = () => {
  if (confirm('Are you sure you want to reset the form?')) {
    form.value = { ...initialForm.value }
    metadataJson.value = JSON.stringify(form.value.metadata, null, 2)
  }
}
</script>
