<script setup lang="ts">
const title = "WebhookLogs"
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div class="space-y-2 text-xs"><div class="p-2 bg-green-50 rounded">✓ POST /webhook/transaction - 200</div><div class="p-2 bg-red-50 rounded">✗ POST /webhook/balance - 500</div></div>
  </div>
</template>
