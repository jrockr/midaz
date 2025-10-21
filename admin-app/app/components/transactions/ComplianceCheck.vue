<script setup lang="ts">
const title = "ComplianceCheck"
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div class="space-y-1 text-sm"><div class="p-1 bg-green-50 text-green-800">✓ AML Check Passed</div><div class="p-1 bg-green-50 text-green-800">✓ Sanctions Check Passed</div></div>
  </div>
</template>
