<script setup lang="ts">
const report = {
  date: new Date().toLocaleDateString(),
  matched: 150,
  pending: 5,
  discrepancies: 2,
  totalAmount: 500000
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
    <h3 class="font-semibold text-gray-900">Reconciliation Report</h3>
    <div class="grid grid-cols-2 gap-3 text-sm">
      <div class="text-center p-2 bg-green-50 rounded">
        <p class="text-gray-600">Matched</p>
        <p class="text-xl font-bold text-green-600">{{ report.matched }}</p>
      </div>
      <div class="text-center p-2 bg-yellow-50 rounded">
        <p class="text-gray-600">Pending</p>
        <p class="text-xl font-bold text-yellow-600">{{ report.pending }}</p>
      </div>
      <div class="text-center p-2 bg-red-50 rounded">
        <p class="text-gray-600">Discrepancies</p>
        <p class="text-xl font-bold text-red-600">{{ report.discrepancies }}</p>
      </div>
      <div class="text-center p-2 bg-blue-50 rounded">
        <p class="text-gray-600">Total Amount</p>
        <p class="text-lg font-bold text-blue-600">${{ (report.totalAmount / 1000).toFixed(0) }}K</p>
      </div>
    </div>
  </div>
</template>
