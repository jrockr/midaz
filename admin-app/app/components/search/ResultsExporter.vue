<script setup lang="ts">
const title = "Results Exporter"
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div class="space-y-2"><select class="w-full px-2 py-1 border border-gray-300 rounded text-sm"><option>CSV</option><option>JSON</option><option>PDF</option></select><button class="w-full px-2 py-1 bg-green-600 text-white rounded text-sm">Export</button></div>
  </div>
</template>
