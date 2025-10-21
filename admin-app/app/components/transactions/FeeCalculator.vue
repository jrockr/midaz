<script setup lang="ts">
const title = "FeeCalculator"
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div class="space-y-2 text-sm"><input type="number" placeholder="Amount" class="w-full px-2 py-1 border rounded"><div class="flex justify-between"><span>Fee</span><span class="font-bold">$2.50</span></div></div>
  </div>
</template>
