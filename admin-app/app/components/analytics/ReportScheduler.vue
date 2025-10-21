<script setup lang="ts">
import { ref } from 'vue'

const reportConfig = ref({
  name: '',
  frequency: 'WEEKLY',
  recipientEmail: '',
  format: 'PDF'
})

const scheduleReport = () => {
  console.log('Scheduling report:', reportConfig.value)
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
    <h3 class="font-semibold text-gray-900">Schedule Report</h3>
    <div class="space-y-3">
      <input v-model="reportConfig.name" type="text" placeholder="Report Name" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      <select v-model="reportConfig.frequency" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
        <option>DAILY</option><option>WEEKLY</option><option>MONTHLY</option>
      </select>
      <input v-model="reportConfig.recipientEmail" type="email" placeholder="Email" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      <button @click="scheduleReport" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
        Schedule
      </button>
    </div>
  </div>
</template>
