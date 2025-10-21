<script setup lang="ts">
const title = "SLA Tracking"
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div class="space-y-3"><div class="flex justify-between text-sm"><span>Uptime SLA</span><span class="font-bold">99.99%</span></div><div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-green-600 h-2 rounded-full" style="width: 99.99%"></div></div></div>
  </div>
</template>
