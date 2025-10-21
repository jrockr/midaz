<script setup lang="ts">
const title = "TransactionStats"
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div class="grid grid-cols-2 gap-2 text-center text-sm"><div class="p-2 bg-blue-50 rounded"><p>Total</p><p class="font-bold">$2.5M</p></div><div class="p-2 bg-green-50 rounded"><p>Avg</p><p class="font-bold">$5K</p></div></div>
  </div>
</template>
