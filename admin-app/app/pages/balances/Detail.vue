<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, Button, Breadcrumb, Alert } from '@/components'

const route = useRoute()
const router = useRouter()

const balanceId = computed(() => route.params.balanceId as string)
const balance = ref<any>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const showEditForm = ref(false)

onMounted(async () => {
  await loadBalance()
})

const loadBalance = async () => {
  isLoading.value = true
  error.value = null
  try {
    balance.value = {
      id: balanceId.value,
      account: 'Main Account',
      asset: 'USD',
      currency: 'USD',
      balance: 50000,
      available: 45000,
      onHold: 5000,
      status: 'ACTIVE',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: { tier: 'premium', notifications: true }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load balance'
  } finally {
    isLoading.value = false
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="p-6">
    <Breadcrumb :items="[
      { label: 'Transactions', route: '/transactions' },
      { label: 'Balances', route: '/transactions/balances' },
      { label: balanceId }
    ]" />

    <div class="mt-6 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Balance Details</h1>
      <div class="flex gap-2">
        <Button @click="() => showEditForm = true" variant="primary">Edit</Button>
        <Button @click="goBack" variant="secondary">Back</Button>
      </div>
    </div>

    <Alert v-if="error" type="error" class="mt-4">{{ error }}</Alert>

    <div v-if="isLoading" class="text-center py-8">
      <p class="text-gray-600">Loading balance...</p>
    </div>
    <div v-else-if="balance" class="mt-6 space-y-6">
      <!-- Balance Information -->
      <Card class="p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Balance Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-gray-600">Balance ID</p>
            <p class="text-lg font-semibold text-gray-900">{{ balance.id }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Account</p>
            <p class="text-lg font-semibold text-gray-900">{{ balance.account }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Asset</p>
            <p class="text-lg font-semibold text-gray-900">{{ balance.asset }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Status</p>
            <span class="text-lg font-semibold text-green-600">{{ balance.status }}</span>
          </div>
        </div>
      </Card>

      <!-- Balance Amounts -->
      <Card class="p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Balance Amounts</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-600 mb-2">Total Balance</p>
            <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(balance.balance) }}</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-600 mb-2">Available</p>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(balance.available) }}</p>
          </div>
          <div class="p-4 bg-orange-50 rounded-lg">
            <p class="text-sm text-gray-600 mb-2">On Hold</p>
            <p class="text-2xl font-bold text-orange-600">{{ formatCurrency(balance.onHold) }}</p>
          </div>
        </div>
      </Card>

      <!-- Metadata -->
      <Card class="p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Metadata</h2>
        <pre class="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">{{ JSON.stringify(balance.metadata, null, 2) }}</pre>
      </Card>

      <!-- Timestamps -->
      <Card class="p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Timestamps</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-gray-600">Created</p>
            <p class="text-gray-900">{{ new Date(balance.createdAt).toLocaleString() }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Last Updated</p>
            <p class="text-gray-900">{{ new Date(balance.updatedAt).toLocaleString() }}</p>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
