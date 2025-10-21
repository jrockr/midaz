<script setup lang="ts">
const title = "BatchStatus"
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div class="space-y-2 text-sm"><div class="flex justify-between"><span>Total</span><span>1,000</span></div><div class="flex justify-between"><span>Processed</span><span class="text-green-600">950</span></div><div class="flex justify-between"><span>Failed</span><span class="text-red-600">50</span></div></div>
  </div>
</template>
