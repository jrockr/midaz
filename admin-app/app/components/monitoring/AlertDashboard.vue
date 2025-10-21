<script setup lang="ts">
const title = "AlertDashboard"
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div class="space-y-2"><div class="p-2 bg-red-50 rounded text-red-800 text-sm">• Critical: 1 issue</div><div class="p-2 bg-yellow-50 rounded text-yellow-800 text-sm">• Warning: 3 issues</div><div class="p-2 bg-blue-50 rounded text-blue-800 text-sm">• Info: 2 messages</div></div>
  </div>
</template>
