<script setup lang="ts">
import { ref, computed } from 'vue'

interface Template {
  id: string
  name: string
  description: string
  type: string
  sourceCount: number
  destCount: number
  avgAmount: number
  createdAt: string
}

const templates = ref<Template[]>([
  { id: 't1', name: 'Daily Settlement', description: 'End of day settlement to main account', type: 'SIMPLE', sourceCount: 1, destCount: 1, avgAmount: 50000, createdAt: '2025-10-15' },
  { id: 't2', name: 'Multi-Account Distribution', description: 'Distribute funds across 5 accounts', type: 'COMPLEX', sourceCount: 1, destCount: 5, avgAmount: 100000, createdAt: '2025-10-10' }
])

const selectedTemplate = ref<string>('')

const selectedTemplateData = computed(() => {
  return templates.value.find(t => t.id === selectedTemplate.value)
})

const formatDate = (date: string) => new Date(date).toLocaleDateString()
const formatAmount = (amount: number) => '$' + amount.toLocaleString()
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Transaction Templates</h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Templates List -->
      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h3 class="font-semibold text-gray-900">Available Templates</h3>
        </div>

        <div class="divide-y divide-gray-200">
          <button
            v-for="template in templates"
            :key="template.id"
            @click="selectedTemplate = template.id"
            :class="['w-full text-left p-4 hover:bg-blue-50 transition', selectedTemplate === template.id ? 'bg-blue-100 border-l-4 border-blue-600' : '']"
          >
            <p class="font-semibold text-gray-900">{{ template.name }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ template.description }}</p>
          </button>
        </div>
      </div>

      <!-- Template Details -->
      <div v-if="selectedTemplateData" class="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h3 class="font-semibold text-gray-900">Template Details</h3>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Type</span>
            <span class="font-semibold text-gray-900">{{ selectedTemplateData.type }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Sources</span>
            <span class="font-semibold text-gray-900">{{ selectedTemplateData.sourceCount }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Destinations</span>
            <span class="font-semibold text-gray-900">{{ selectedTemplateData.destCount }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Avg Amount</span>
            <span class="font-semibold text-gray-900">{{ formatAmount(selectedTemplateData.avgAmount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Created</span>
            <span class="font-semibold text-gray-900">{{ formatDate(selectedTemplateData.createdAt) }}</span>
          </div>
        </div>

        <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Use This Template
        </button>
      </div>

      <div v-else class="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center text-gray-500">
        <p>Select a template to view details</p>
      </div>
    </div>
  </div>
</template>
