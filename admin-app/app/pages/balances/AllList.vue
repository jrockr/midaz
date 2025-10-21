<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button, Card, Input, Table, Modal, Alert, Breadcrumb } from '@/components'

const balances = ref<any[]>([])
const filters = ref({
  ledger: '',
  account: '',
  asset: '',
  search: ''
})

const sortBy = ref('balance')
const sortOrder = ref<'asc' | 'desc'>('desc')
const isLoading = ref(false)
const error = ref<string | null>(null)
const showForm = ref(false)
const selectedBalance = ref<any>(null)
const selectedBalances = ref<string[]>([])

onMounted(async () => {
  await loadBalances()
})

const loadBalances = async () => {
  isLoading.value = true
  error.value = null
  try {
    balances.value = [
      {
        id: 'BAL-001',
        account: 'Main Account',
        accountAlias: 'main',
        ledger: 'General',
        asset: 'USD',
        balance: 50000,
        available: 45000,
        onHold: 5000,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'BAL-002',
        account: 'Reserve Account',
        accountAlias: 'reserve',
        ledger: 'General',
        asset: 'EUR',
        balance: 25000,
        available: 25000,
        onHold: 0,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'BAL-003',
        account: 'Trading Account',
        accountAlias: 'trading',
        ledger: 'Trading',
        asset: 'GBP',
        balance: 15000,
        available: 12000,
        onHold: 3000,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'BAL-004',
        account: 'Main Account',
        accountAlias: 'main',
        ledger: 'General',
        asset: 'JPY',
        balance: 1000000,
        available: 900000,
        onHold: 100000,
        lastUpdated: new Date().toISOString()
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

  if (filters.value.ledger) {
    result = result.filter(b => b.ledger === filters.value.ledger)
  }

  if (filters.value.account) {
    result = result.filter(b => b.account === filters.value.account)
  }

  if (filters.value.asset) {
    result = result.filter(b => b.asset === filters.value.asset)
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(b => 
      b.account.toLowerCase().includes(search) ||
      b.asset.toLowerCase().includes(search) ||
      b.id.toLowerCase().includes(search)
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

const ledgers = computed(() => [...new Set(balances.value.map(b => b.ledger))])
const accounts = computed(() => [...new Set(balances.value.map(b => b.account))])
const assets = computed(() => [...new Set(balances.value.map(b => b.asset))])

const totalBalance = computed(() => filteredAndSortedBalances.value.reduce((sum, b) => sum + b.balance, 0))
const totalAvailable = computed(() => filteredAndSortedBalances.value.reduce((sum, b) => sum + b.available, 0))
const totalOnHold = computed(() => filteredAndSortedBalances.value.reduce((sum, b) => sum + b.onHold, 0))

const toggleBalance = (id: string) => {
  const idx = selectedBalances.value.indexOf(id)
  if (idx > -1) {
    selectedBalances.value.splice(idx, 1)
  } else {
    selectedBalances.value.push(id)
  }
}

const toggleAllBalances = () => {
  if (selectedBalances.value.length === filteredAndSortedBalances.value.length) {
    selectedBalances.value = []
  } else {
    selectedBalances.value = filteredAndSortedBalances.value.map(b => b.id)
  }
}

const exportBalances = () => {
  const dataToExport = selectedBalances.value.length > 0 
    ? filteredAndSortedBalances.value.filter(b => selectedBalances.value.includes(b.id))
    : filteredAndSortedBalances.value

  const csv = [
    ['ID', 'Account', 'Ledger', 'Asset', 'Balance', 'Available', 'On Hold', 'Last Updated'],
    ...dataToExport.map(b => [
      b.id, b.account, b.ledger, b.asset, b.balance, b.available, b.onHold, 
      new Date(b.lastUpdated).toLocaleDateString()
    ])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `balances-export-${new Date().toISOString()}.csv`
  link.click()
}

const handleBulkAction = (action: string) => {
  if (selectedBalances.value.length === 0) {
    error.value = 'Please select at least one balance'
    return
  }

  switch (action) {
    case 'export':
      exportBalances()
      break
    case 'delete':
      if (confirm('Are you sure you want to delete selected balances?')) {
        selectedBalances.value.forEach(id => {
          balances.value = balances.value.filter(b => b.id !== id)
        })
        selectedBalances.value = []
      }
      break
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
</script>

<template>
  <div class="p-6">
    <Breadcrumb :items="[
      { label: 'Dashboard', route: '/dashboard' },
      { label: 'Transactions', route: '/transactions' },
      { label: 'All Balances' }
    ]" />

    <div class="mt-6 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">All Balances</h1>
      <Button @click="exportBalances" variant="primary">📥 Export All</Button>
    </div>

    <Alert v-if="error" type="error" class="mt-4">{{ error }}</Alert>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <Card class="p-6">
        <div class="text-center">
          <p class="text-sm text-gray-600 mb-2">Total Balance</p>
          <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalBalance) }}</p>
        </div>
      </Card>
      <Card class="p-6">
        <div class="text-center">
          <p class="text-sm text-gray-600 mb-2">Available</p>
          <p class="text-2xl font-bold text-green-600">{{ formatCurrency(totalAvailable) }}</p>
        </div>
      </Card>
      <Card class="p-6">
        <div class="text-center">
          <p class="text-sm text-gray-600 mb-2">On Hold</p>
          <p class="text-2xl font-bold text-orange-600">{{ formatCurrency(totalOnHold) }}</p>
        </div>
      </Card>
    </div>

    <!-- Filters -->
    <Card class="mt-6 p-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label class="text-sm font-medium text-gray-700">Search</label>
          <Input v-model="filters.search" placeholder="Search by account, asset..." class="mt-1" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Ledger</label>
          <select v-model="filters.ledger" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Ledgers</option>
            <option v-for="ledger in ledgers" :key="ledger" :value="ledger">{{ ledger }}</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Account</label>
          <select v-model="filters.account" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Accounts</option>
            <option v-for="account in accounts" :key="account" :value="account">{{ account }}</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Asset</label>
          <select v-model="filters.asset" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Assets</option>
            <option v-for="asset in assets" :key="asset" :value="asset">{{ asset }}</option>
          </select>
        </div>
        <div class="flex items-end gap-2">
          <Button v-if="selectedBalances.length > 0" @click="handleBulkAction('export')" variant="secondary" class="flex-1">
            Export Selected
          </Button>
          <Button v-if="selectedBalances.length > 0" @click="handleBulkAction('delete')" variant="secondary" class="flex-1 text-red-600">
            Delete
          </Button>
        </div>
      </div>

      <!-- Table -->
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
              <th class="px-4 py-3 text-left">
                <input type="checkbox" :checked="selectedBalances.length === filteredAndSortedBalances.length" @change="toggleAllBalances" />
              </th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900">Account</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900">Ledger</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900">Asset</th>
              <th class="px-4 py-3 text-right font-semibold text-gray-900">Balance</th>
              <th class="px-4 py-3 text-right font-semibold text-gray-900">Available</th>
              <th class="px-4 py-3 text-right font-semibold text-gray-900">On Hold</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900">Last Updated</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="balance in filteredAndSortedBalances" :key="balance.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <input type="checkbox" :checked="selectedBalances.includes(balance.id)" @change="toggleBalance(balance.id)" />
              </td>
              <td class="px-4 py-3 text-gray-900 font-medium">{{ balance.account }}</td>
              <td class="px-4 py-3 text-gray-900">{{ balance.ledger }}</td>
              <td class="px-4 py-3 text-gray-900 font-semibold">{{ balance.asset }}</td>
              <td class="px-4 py-3 text-right text-gray-900 font-semibold">{{ formatCurrency(balance.balance) }}</td>
              <td class="px-4 py-3 text-right text-green-600 font-semibold">{{ formatCurrency(balance.available) }}</td>
              <td class="px-4 py-3 text-right text-orange-600 font-semibold">{{ formatCurrency(balance.onHold) }}</td>
              <td class="px-4 py-3 text-gray-600 text-sm">{{ new Date(balance.lastUpdated).toLocaleDateString() }}</td>
              <td class="px-4 py-3 text-center">
                <Button variant="ghost" size="sm">View Details</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>
