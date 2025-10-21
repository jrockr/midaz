<script setup lang="ts">
const props = defineProps<{
  available: number
  total: number
  asset?: string
}>()

const percentage = () => Math.round((props.available / props.total) * 100)
const formatCurrency = (amt: number) => '$' + amt.toLocaleString()
</script>

<template>
  <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
    <p class="text-sm opacity-90">Available Balance</p>
    <p class="text-3xl font-bold mt-2">{{ formatCurrency(available) }}</p>
    <div class="mt-4 flex items-end gap-2">
      <div class="flex-1 bg-white bg-opacity-20 rounded-full h-2">
        <div class="bg-white h-2 rounded-full" :style="{ width: percentage() + '%' }" />
      </div>
      <p class="text-sm font-semibold">{{ percentage() }}%</p>
    </div>
    <p class="text-xs opacity-75 mt-2">of {{ formatCurrency(total) }} {{ asset || 'USD' }}</p>
  </div>
</template>
