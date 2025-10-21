<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Organization Selector -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Organization <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.organizationId"
        :disabled="isEditing"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        @blur="validateOrganization"
      >
        <option value="">Select an organization</option>
        <option v-for="org in organizations" :key="org.id" :value="org.id">
          {{ org.name }}
        </option>
      </select>
      <p v-if="errors.organizationId" class="mt-1 text-sm text-red-500">
        {{ errors.organizationId }}
      </p>
    </div>

    <!-- Currency Selector -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Currency <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.currency"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="validateCurrency"
      >
        <option value="">Select a currency</option>
        <option v-for="curr in currencies" :key="curr" :value="curr">
          {{ curr }}
        </option>
      </select>
      <p v-if="errors.currency" class="mt-1 text-sm text-red-500">
        {{ errors.currency }}
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
        placeholder="e.g., Main Ledger"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="validateName"
      />
      <p v-if="errors.name" class="mt-1 text-sm text-red-500">
        {{ errors.name }}
      </p>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <textarea
        v-model="form.description"
        placeholder="Enter ledger description"
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
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
import { ref, computed, watch, onMounted } from 'vue'
import { useOrganizationsStore } from '@/stores'
import type { Ledger, CreateLedgerDto, UpdateLedgerDto } from '@/types'

interface Props {
  ledger?: Ledger | null
  isLoading?: boolean
  isEditing?: boolean
}

interface Emits {
  (e: 'submit', payload: CreateLedgerDto | UpdateLedgerDto): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const organizationsStore = useOrganizationsStore()

// Currency list (ISO 4217 common currencies)
const currencies = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD',
  'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'INR', 'BRL', 'ZAR'
]

const form = ref({
  organizationId: '',
  currency: '',
  name: '',
  description: '',
  status: 'ACTIVE' as const,
  metadata: {} as Record<string, unknown>
})

const initialForm = ref({ ...form.value })
const errors = ref({
  organizationId: '',
  currency: '',
  name: ''
})

const showMetadataModal = ref(false)
const metadataJson = ref('{}')
const metadataError = ref('')

const organizations = computed(() => organizationsStore.items)

const isDirty = computed(() =>
  JSON.stringify(form.value) !== JSON.stringify(initialForm.value)
)

const metadataPreview = computed(() => {
  const keys = Object.keys(form.value.metadata)
  if (keys.length === 0) return '{}'
  return `{ ${keys.slice(0, 2).map(k => `"${k}": ...`).join(', ')}${keys.length > 2 ? ', ...' : ''} }`
})

onMounted(() => {
  organizationsStore.fetch({ limit: 100 })
})

watch(
  () => props.ledger,
  (newLedger) => {
    if (newLedger) {
      form.value = {
        organizationId: newLedger.organizationId || '',
        currency: '', // Extract from metadata or another field if available
        name: newLedger.name,
        description: '', // Add if available in type
        status: newLedger.status,
        metadata: newLedger.metadata || {}
      }
      initialForm.value = { ...form.value }
      metadataJson.value = JSON.stringify(form.value.metadata, null, 2)
    }
  },
  { immediate: false }
)

const validateOrganization = () => {
  errors.value.organizationId = form.value.organizationId ? '' : 'Organization is required'
}

const validateCurrency = () => {
  errors.value.currency = form.value.currency ? '' : 'Currency is required'
}

const validateName = () => {
  errors.value.name = form.value.name.trim() ? '' : 'Name is required'
}

const validateForm = () => {
  validateOrganization()
  validateCurrency()
  validateName()
  return !errors.value.organizationId && !errors.value.currency && !errors.value.name
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

  const payload: CreateLedgerDto | UpdateLedgerDto = {
    name: form.value.name,
    status: form.value.status,
    metadata: form.value.metadata
  }

  emit('submit', payload)
}

const resetForm = () => {
  if (confirm('Are you sure you want to reset the form?')) {
    form.value = { ...initialForm.value }
    metadataJson.value = JSON.stringify(form.value.metadata, null, 2)
  }
}
</script>
