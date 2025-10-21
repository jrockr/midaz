<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { Card, Spinner } from '@/components'
import { useOrganizationsStore } from '@/stores'

const organizationsStore = useOrganizationsStore()

const stats = reactive({
  organizations: 0,
  ledgers: 0,
  accounts: 0,
  transactions: 0,
})

onMounted(async () => {
  try {
    await organizationsStore.fetch({ limit: 1 })
    stats.organizations = organizationsStore.items.length
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
  }
})
</script>

<template>
  <main class="flex-1 overflow-auto">
    <div class="px-6 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-2">Welcome to Midaz Admin Console</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Organizations</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.organizations }}</p>
            </div>
            <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Ledgers</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.ledgers }}</p>
            </div>
            <div class="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Accounts</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.accounts }}</p>
            </div>
            <div class="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Transactions</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.transactions }}</p>
            </div>
            <div class="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <!-- Quick Info -->
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Getting Started</h2>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 mt-1">
              <div class="flex items-center justify-center h-5 w-5 rounded-md bg-blue-600">
                <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Create an Organization</h3>
              <p class="text-gray-600 text-sm">Start by creating your first organization to manage your operations.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 mt-1">
              <div class="flex items-center justify-center h-5 w-5 rounded-md bg-blue-600">
                <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Setup Ledgers</h3>
              <p class="text-gray-600 text-sm">Create ledgers to organize and track your financial operations.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 mt-1">
              <div class="flex items-center justify-center h-5 w-5 rounded-md bg-blue-600">
                <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Manage Accounts</h3>
              <p class="text-gray-600 text-sm">Create and manage accounts within your ledgers for transactions.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </main>
</template>
