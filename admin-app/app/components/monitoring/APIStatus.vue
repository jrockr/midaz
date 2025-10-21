<script setup lang="ts">
const title = "APIStatus"
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div class="space-y-2 text-sm"><div class="flex justify-between"><span>API Server</span><span class="font-bold text-green-600">✅ UP</span></div><div class="flex justify-between"><span>Database</span><span class="font-bold text-green-600">✅ UP</span></div></div>
  </div>
</template>
