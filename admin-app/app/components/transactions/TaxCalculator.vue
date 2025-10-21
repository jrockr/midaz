<script setup lang="ts">
const title = "TaxCalculator"
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div class="space-y-2 text-sm"><div class="flex justify-between"><span>Subtotal</span><span>$1,000</span></div><div class="flex justify-between"><span>Tax (10%)</span><span>$100</span></div><div class="border-t pt-1 flex justify-between font-bold"><span>Total</span><span>$1,100</span></div></div>
  </div>
</template>
