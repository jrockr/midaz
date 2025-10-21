<script setup lang="ts">
const data = {
  revenues: 500000,
  expenses: 150000,
  taxes: 35000,
  netIncome: 315000
}

const margin = Math.round((data.netIncome / data.revenues) * 100)
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
    <h3 class="font-semibold text-gray-900">Income Statement</h3>
    <div class="space-y-3 text-sm border-t border-gray-200 pt-4">
      <div class="flex justify-between"><span>Total Revenues</span><span class="font-semibold">$500,000</span></div>
      <div class="flex justify-between text-red-600"><span>Total Expenses</span><span class="font-semibold">-$150,000</span></div>
      <div class="flex justify-between text-yellow-600"><span>Taxes</span><span class="font-semibold">-$35,000</span></div>
      <div class="border-t pt-3 flex justify-between text-lg font-bold text-green-600">
        <span>Net Income</span><span>$315,000</span>
      </div>
      <div class="flex justify-between text-xs text-gray-600 pt-2">
        <span>Net Margin</span><span>{{ margin }}%</span>
      </div>
    </div>
  </div>
</template>
