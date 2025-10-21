<script setup lang="ts">
const title = "FilterBuilder"
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div class="space-y-2"><input type="text" placeholder="Add filter..." class="w-full px-2 py-1 border border-gray-300 rounded text-sm"><button class="w-full px-2 py-1 bg-blue-600 text-white rounded text-sm">+ Add Filter</button></div>
  </div>
</template>
