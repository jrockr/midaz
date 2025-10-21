<script setup lang="ts">
const title = "SearchHistory"
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div class="space-y-1 text-sm"><button class="block w-full text-left p-2 hover:bg-gray-100">⏱️ Large transactions > $10K</button><button class="block w-full text-left p-2 hover:bg-gray-100">📅 Transactions this week</button></div>
  </div>
</template>
