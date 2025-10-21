<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Ledger Selector -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Ledger <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.ledgerId"
        :disabled="isEditing"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        @change="onLedgerChange"
        @blur="validateLedger"
      >
        <option value="">Select a ledger</option>
        <option v-for="ledger in ledgers" :key="ledger.id" :value="ledger.id">
          {{ ledger.name }} ({{ ledger.code }})
        </option>
      </select>
      <p v-if="errors.ledgerId" class="mt-1 text-sm text-red-500">
        {{ errors.ledgerId }}
      </p>
    </div>

    <!-- Asset Selector (filtered by ledger) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Asset <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.assetId"
        :disabled="isEditing || !form.ledgerId"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        @blur="validateAsset"
      >
        <option value="">Select an asset</option>
        <option v-for="asset in filteredAssets" :key="asset.id" :value="asset.id">
          {{ asset.code }} - {{ asset.name }}
        </option>
      </select>
      <p v-if="errors.assetId" class="mt-1 text-sm text-red-500">
        {{ errors.assetId }}
      </p>
    </div>

    <!-- Alias (Code) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Alias / Code <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.alias"
        type="text"
        placeholder="e.g., ACC-001"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="validateAlias"
      />
      <p v-if="errors.alias" class="mt-1 text-sm text-red-500">
        {{ errors.alias }}
      </p>
    </div>

    <!-- Account Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Account Name <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.accountName"
        type="text"
        placeholder="e.g., Operating Account"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="validateAccountName"
      />
      <p v-if="errors.accountName" class="mt-1 text-sm text-red-500">
        {{ errors.accountName }}
      </p>
    </div>

    <!-- Account Number (Optional) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Account Number
      </label>
      <input
        v-model="form.accountNumber"
        type="text"
        placeholder="e.g., 123456789"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Account Type -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Account Type <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.type"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="validateType"
      >
        <option value="">Select type</option>
        <option value="ASSET">Asset</option>
        <option value="LIABILITY">Liability</option>
        <option value="EQUITY">Equity</option>
      </select>
      <p v-if="errors.type" class="mt-1 text-sm text-red-500">
        {{ errors.type }}
      </p>
    </div>

    <!-- Portfolio Selector (Optional) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Portfolio (Optional)
      </label>
      <select
        v-model="form.portfolioId"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">No portfolio</option>
        <option v-for="portfolio in portfolios" :key="portfolio.id" :value="portfolio.id">
          {{ portfolio.name }}
        </option>
      </select>
    </div>

    <!-- Segment Selector (Optional) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Segment (Optional)
      </label>
      <select
        v-model="form.segmentId"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">No segment</option>
        <option v-for="segment in segments" :key="segment.id" :value="segment.id">
          {{ segment.name }}
        </option>
      </select>
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

    <!-- External Code (Optional) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        External Code (Optional)
      </label>
      <input
        v-model="form.externalCode"
        type="text"
        placeholder="e.g., EXT-CODE-123"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
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
import { useLedgersStore, useAssetsStore, usePortfoliosStore, useSegmentsStore } from '@/stores'
import type { Account, CreateAccountDto, UpdateAccountDto } from '@/types'

interface Props {
  account?: Account | null
  isLoading?: boolean
}

interface Emits {
  (e: 'submit', payload: CreateAccountDto | UpdateAccountDto): void
  (e: 'cancel'): void
}

defineProps<Props>()
defineEmits<Emits>()

const ledgersStore = useLedgersStore()
const assetsStore = useAssetsStore()
const portfoliosStore = usePortfoliosStore()
const segmentsStore = useSegmentsStore()

const form = ref({
  ledgerId: '',
  assetId: '',
  alias: '',
  accountName: '',
  accountNumber: '',
  type: '',
  portfolioId: '',
  segmentId: '',
  externalCode: '',
  status: 'ACTIVE' as const,
  metadata: {} as Record<string, unknown>
})

const initialForm = ref({ ...form.value })
const errors = ref({
  ledgerId: '',
  assetId: '',
  alias: '',
  accountName: '',
  type: ''
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

const ledgers = computed(() => ledgersStore.items)
const portfolios = computed(() => portfoliosStore.items)
const segments = computed(() => segmentsStore.items)

const filteredAssets = computed(() => {
  if (!form.ledgerId) return []
  // In a real app, we'd filter by ledger's organization
  return assetsStore.items
})

onMounted(() => {
  ledgersStore.fetch({ limit: 100 })
  assetsStore.fetch({ limit: 100 })
  portfoliosStore.fetch({ limit: 100 })
  segmentsStore.fetch({ limit: 100 })
})

watch(
  () => props.account,
  (newAccount) => {
    if (newAccount) {
      form.value = {
        ledgerId: newAccount.ledgerId,
        assetId: newAccount.asset?.id || '',
        alias: newAccount.alias,
        accountName: newAccount.accountName,
        accountNumber: newAccount.accountNumber || '',
        type: newAccount.type,
        portfolioId: newAccount.portfolioId || '',
        segmentId: newAccount.segmentId || '',
        externalCode: newAccount.externalCode || '',
        status: newAccount.status,
        metadata: newAccount.metadata || {}
      }
      initialForm.value = { ...form.value }
      metadataJson.value = JSON.stringify(form.value.metadata, null, 2)
    }
  }
)

const onLedgerChange = () => {
  form.value.assetId = ''
}

const validateLedger = () => {
  errors.value.ledgerId = form.value.ledgerId ? '' : 'Ledger is required'
}

const validateAsset = () => {
  errors.value.assetId = form.value.assetId ? '' : 'Asset is required'
}

const validateAlias = () => {
  errors.value.alias = form.value.alias.trim() ? '' : 'Alias is required'
}

const validateAccountName = () => {
  errors.value.accountName = form.value.accountName.trim() ? '' : 'Account name is required'
}

const validateType = () => {
  errors.value.type = form.value.type ? '' : 'Account type is required'
}

const validateForm = () => {
  validateLedger()
  validateAsset()
  validateAlias()
  validateAccountName()
  validateType()
  return !errors.value.ledgerId && !errors.value.assetId && !errors.value.alias && 
         !errors.value.accountName && !errors.value.type
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

const handleSubmit = () => {
  if (!validateForm()) return

  const payload: CreateAccountDto | UpdateAccountDto = {
    alias: form.value.alias,
    name: form.value.accountName,
    type: form.value.type as any,
    assetCode: form.value.assetId,
    status: { code: form.value.status },
    metadata: form.value.metadata
  }

  if (form.value.portfolioId) {
    (payload as any).portfolioId = form.value.portfolioId
  }
  if (form.value.segmentId) {
    (payload as any).segmentId = form.value.segmentId
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
