<script setup lang="ts">
import { computed } from 'vue'

interface Amount {
  accountId?: string
  amount: number
  asset: string
}

interface Asset {
  code: string
  name: string
}

const props = withDefaults(
  defineProps<{
    modelValue: Amount
    assets?: Asset[]
  }>(),
  {
    assets: () => [
      { code: 'USD', name: 'US Dollar' },
      { code: 'EUR', name: 'Euro' },
      { code: 'GBP', name: 'British Pound' },
      { code: 'BTC', name: 'Bitcoin' }
    ]
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: Amount]
}>()

const amount = computed({
  get: () => props.modelValue.amount || 0,
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      amount: parseFloat(value as any) || 0
    })
  }
})

const asset = computed({
  get: () => props.modelValue.asset || 'USD',
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      asset: value
    })
  }
})

const formattedAmount = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: asset.value
  }).format(amount.value)
})
</script>

<template>
  <div class="amount-input-container space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Amount Input -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Amount
        </label>
        <div class="relative">
          <input
            v-model="amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span class="absolute right-4 top-2 text-gray-500 text-sm">
            {{ asset }}
          </span>
        </div>
      </div>

      <!-- Asset Selector -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Asset
        </label>
        <select
          v-model="asset"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option v-for="a in assets" :key="a.code" :value="a.code">
            {{ a.code }}
          </option>
        </select>
      </div>
    </div>

    <!-- Amount Display -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <p class="text-sm text-gray-600">Total Amount:</p>
      <p class="text-2xl font-bold text-blue-600">{{ formattedAmount }}</p>
    </div>
  </div>
</template>

<style scoped>
input:focus,
select:focus {
  outline: none;
}
</style>
