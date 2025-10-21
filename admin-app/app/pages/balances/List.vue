<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Button, Card, Input, Table, Modal, Alert, Breadcrumb } from '@/components'
import { useBalanceStore } from '@/stores'
import { useOrganizationsStore } from '@/stores/organizations'
import { useLedgersStore } from '@/stores/ledgers'

const route = useRoute()
const balanceStore = useBalanceStore()
const organizationsStore = useOrganizationsStore()
const ledgersStore = useLedgersStore()

const orgSearchQuery = ref('')
const ledgerSearchQuery = ref('')
const selectedOrgId = ref(route.params.orgId as string || '')
const selectedLedgerId = ref(route.params.ledgerId as string || '')

const orgId = computed(() => selectedOrgId.value)
const ledgerId = computed(() => selectedLedgerId.value)
const accountId = computed(() => route.params.accountId as string)

const filteredOrganizations = computed(() => {
  if (!orgSearchQuery.value) return organizationsStore.items
  const query = orgSearchQuery.value.toLowerCase()
  return organizationsStore.items.filter(org => 
    org.name.toLowerCase().includes(query) || org.id.toLowerCase().includes(query)
  )
})

const filteredLedgers = computed(() => {
  if (!ledgerSearchQuery.value) return ledgersStore.items
  const query = ledgerSearchQuery.value.toLowerCase()
  return ledgersStore.items.filter(ledger => 
    ledger.name.toLowerCase().includes(query) || ledger.id.toLowerCase().includes(query)
  )
})

watch(selectedOrgId, async (newOrgId) => {
  if (newOrgId) {
    selectedLedgerId.value = ''
    await ledgersStore.fetchAll({ organizationId: newOrgId, limit: 100 })
  }
})

watch(selectedLedgerId, async (newLedgerId) => {
  if (newLedgerId && selectedOrgId.value) {
    await loadBalances()
  }
})

const balances = ref<any[]>([])
const filters = ref({
  asset: '',
  status: '',
  search: ''
})

const sortBy = ref('balance')
const sortOrder = ref<'asc' | 'desc'>('desc')
const isLoading = ref(false)
const error = ref<string | null>(null)
const showForm = ref(false)
const selectedBalance = ref<any>(null)

onMounted(async () => {
  await organizationsStore.fetchAll({ limit: 100 })
  if (selectedOrgId.value) {
    await ledgersStore.fetchAll({ organizationId: selectedOrgId.value, limit: 100 })
    if (selectedLedgerId.value) {
      await loadBalances()
    }
  }
})

const loadBalances = async () => {
  if (!selectedOrgId.value || !selectedLedgerId.value) {
    error.value = 'Please select organization and ledger'
    return
  }
  isLoading.value = true
  error.value = null
  try {
    // Simulated API call - replace with actual API call
    // await balanceStore.fetchAll({ organizationId: selectedOrgId.value, ledgerId: selectedLedgerId.value })
    balances.value = [
      {
        id: 'BAL-001',
        asset: 'USD',
        currency: 'USD',
        balance: 50000,
        available: 45000,
        onHold: 5000,
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'BAL-002',
        asset: 'EUR',
        currency: 'EUR',
        balance: 25000,
        available: 25000,
        onHold: 0,
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'BAL-003',
        asset: 'GBP',
        currency: 'GBP',
        balance: 15000,
        available: 12000,
        onHold: 3000,
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load balances'
  } finally {
    isLoading.value = false
  }
}

const filteredAndSortedBalances = computed(() => {
  let result = balances.value

  if (filters.value.asset) {
    result = result.filter(b => b.asset === filters.value.asset)
  }

  if (filters.value.status) {
    result = result.filter(b => b.status === filters.value.status)
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(b => 
      b.id.toLowerCase().includes(search) || 
      b.asset.toLowerCase().includes(search)
    )
  }

  result.sort((a, b) => {
    const aVal = a[sortBy.value]
    const bVal = b[sortBy.value]
    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    return sortOrder.value === 'asc' ? comparison : -comparison
  })

  return result
})

const openForm = (balance?: any) => {
  selectedBalance.value = balance
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  selectedBalance.value = null
}

const handleSave = async () => {
  closeForm()
  await loadBalances()
}

const deleteBalance = async (id: string) => {
  if (confirm('Are you sure you want to delete this balance?')) {
    try {
      // Delete logic would go here
      balances.value = balances.value.filter(b => b.id !== id)
    } catch (err) {
      error.value = 'Failed to delete balance'
    }
  }
}

const exportBalances = () => {
  const csv = [
    ['ID', 'Asset', 'Currency', 'Balance', 'Available', 'On Hold', 'Status', 'Created', 'Updated'],
    ...filteredAndSortedBalances.value.map(b => [
      b.id, b.asset, b.currency, b.balance, b.available, b.onHold, 
      b.status, new Date(b.createdAt).toLocaleDateString(), new Date(b.updatedAt).toLocaleDateString()
    ])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `balances-${new Date().toISOString()}.csv`
  link.click()
}

const getStatusColor = (status: string) => {
  return status === 'ACTIVE' ? 'text-green-600' : 'text-yellow-600'
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
</script>

<template>
  <div class="p-6">
    <Breadcrumb :items="[
      { label: 'Balances' }
    ]" />

    <div class="mt-6 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Account Balances</h1>
      <Button @click="openForm" variant="primary" :disabled="!selectedOrgId || !selectedLedgerId">+ Add Balance</Button>
    </div>

    <Alert v-if="error" type="error" class="mt-4">{{ error }}</Alert>

    <!-- Organization & Ledger Selectors -->
    <Card class="mt-6 p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Organization <span class="text-red-500">*</span>
          </label>
          <input
            v-model="orgSearchQuery"
            type="text"
            placeholder="Search organizations..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500"
          />
          <select
            v-model="selectedOrgId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an organization</option>
            <option v-for="org in filteredOrganizations" :key="org.id" :value="org.id">
              {{ org.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ledger <span class="text-red-500">*</span>
          </label>
          <input
            v-model="ledgerSearchQuery"
            type="text"
            placeholder="Search ledgers..."
            :disabled="!selectedOrgId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <select
            v-model="selectedLedgerId"
            :disabled="!selectedOrgId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select a ledger</option>
            <option v-for="ledger in filteredLedgers" :key="ledger.id" :value="ledger.id">
              {{ ledger.name }}
            </option>
          </select>
        </div>
      </div>
    </Card>

    <Card v-if="selectedOrgId && selectedLedgerId" class="mt-6 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label class="text-sm font-medium text-gray-700">Search</label>
          <Input v-model="filters.search" placeholder="Search by ID or asset..." class="mt-1" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Asset</label>
          <select v-model="filters.asset" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Assets</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Status</label>
          <select v-model="filters.status" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div class="flex items-end">
          <Button @click="exportBalances" variant="secondary" class="w-full">
            📥 Export
          </Button>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-8">
        <p class="text-gray-600">Loading balances...</p>
      </div>
      <div v-else-if="filteredAndSortedBalances.length === 0" class="text-center py-8">
        <p class="text-gray-600">No balances found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-gray-900 cursor-pointer" @click="sortBy = 'id'; sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'">
                ID {{ sortBy === 'id' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
              </th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900 cursor-pointer" @click="sortBy = 'asset'; sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'">
                Asset {{ sortBy === 'asset' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
              </th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900 cursor-pointer" @click="sortBy = 'currency'; sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'">
                Currency {{ sortBy === 'currency' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
              </th>
              <th class="px-4 py-3 text-right font-semibold text-gray-900 cursor-pointer" @click="sortBy = 'balance'; sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'">
                Balance {{ sortBy === 'balance' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
              </th>
              <th class="px-4 py-3 text-right font-semibold text-gray-900">Available</th>
              <th class="px-4 py-3 text-right font-semibold text-gray-900">On Hold</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900">Created</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900">Updated</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="balance in filteredAndSortedBalances" :key="balance.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-900 font-medium">{{ balance.id }}</td>
              <td class="px-4 py-3 text-gray-900">{{ balance.asset }}</td>
              <td class="px-4 py-3 text-gray-900">{{ balance.currency }}</td>
              <td class="px-4 py-3 text-right text-gray-900 font-semibold">{{ formatCurrency(balance.balance) }}</td>
              <td class="px-4 py-3 text-right text-green-600 font-semibold">{{ formatCurrency(balance.available) }}</td>
              <td class="px-4 py-3 text-right text-orange-600 font-semibold">{{ formatCurrency(balance.onHold) }}</td>
              <td class="px-4 py-3">
                <span :class="`font-semibold ${getStatusColor(balance.status)}`">{{ balance.status }}</span>
              </td>
              <td class="px-4 py-3 text-gray-600 text-sm">{{ new Date(balance.createdAt).toLocaleDateString() }}</td>
              <td class="px-4 py-3 text-gray-600 text-sm">{{ new Date(balance.updatedAt).toLocaleDateString() }}</td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <Button @click="openForm(balance)" variant="ghost" size="sm">Edit</Button>
                  <Button @click="deleteBalance(balance.id)" variant="ghost" size="sm" class="text-red-600">Delete</Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <Modal v-if="showForm" :model-value="true" @update:model-value="closeForm" title="Update Balance">
      <!-- Form will go here -->
    </Modal>
  </div>
</template>
