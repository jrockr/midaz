<script setup lang="ts">
const title = "LiquidityView"
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div class="space-y-2 text-sm"><div class="flex justify-between"><span>Liquid Assets</span><span class="font-bold text-green-600">$75,000</span></div><div class="flex justify-between"><span>Illiquid Assets</span><span class="font-bold text-orange-600">$25,000</span></div></div>
  </div>
</template>
