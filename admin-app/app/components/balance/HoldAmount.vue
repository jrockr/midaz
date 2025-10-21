<script setup lang="ts">
import { computed } from "vue"
interface Hold {
  id: string
  reason: string
  amount: number
  createdAt: string
  expiresAt?: string
}

const props = withDefaults(
  defineProps<{
    holds?: Hold[]
  }>(),
  {
    holds: () => [
      { id: '1', reason: 'Pending Transaction', amount: 5000, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 24 * 3600000).toISOString() }
    ]
  }
)

const totalHeld = () => props.holds.reduce((s, h) => s + h.amount, 0)
const formatCurrency = (amt: number) => '$' + amt.toLocaleString()
</script>

<template>
  <div class="space-y-4">
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p class="text-sm text-yellow-600">Total On Hold</p>
      <p class="text-2xl font-bold text-yellow-900 mt-1">{{ formatCurrency(totalHeld()) }}</p>
    </div>

    <div v-if="holds.length" class="space-y-2">
      <div v-for="hold in holds" :key="hold.id" class="text-sm border border-yellow-200 rounded p-3">
        <div class="flex justify-between">
          <span class="font-medium text-gray-900">{{ hold.reason }}</span>
          <span class="font-bold text-yellow-600">{{ formatCurrency(hold.amount) }}</span>
        </div>
        <p v-if="hold.expiresAt" class="text-xs text-gray-600 mt-1">Expires: {{ new Date(hold.expiresAt).toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
</template>
