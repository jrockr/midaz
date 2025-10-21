<script setup lang="ts">
import { ref } from 'vue'

interface ApprovalRequest {
  id: string
  transaction: string
  amount: number
  requester: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

const requests = ref<ApprovalRequest[]>([
  { id: 'req1', transaction: 'TXN-001', amount: 50000, requester: 'John Doe', status: 'PENDING', createdAt: '2025-10-21' },
  { id: 'req2', transaction: 'TXN-002', amount: 75000, requester: 'Jane Smith', status: 'APPROVED', createdAt: '2025-10-20' }
])

const handleApprove = (id: string) => {
  const req = requests.value.find(r => r.id === id)
  if (req) req.status = 'APPROVED'
}

const handleReject = (id: string) => {
  const req = requests.value.find(r => r.id === id)
  if (req) req.status = 'REJECTED'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'APPROVED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Transaction Approvals</h2>

    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="p-6 border-b border-gray-200 grid grid-cols-3 gap-4">
        <div>
          <p class="text-sm text-gray-600">Pending</p>
          <p class="text-2xl font-bold text-yellow-600">{{ requests.filter(r => r.status === 'PENDING').length }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Approved</p>
          <p class="text-2xl font-bold text-green-600">{{ requests.filter(r => r.status === 'APPROVED').length }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Rejected</p>
          <p class="text-2xl font-bold text-red-600">{{ requests.filter(r => r.status === 'REJECTED').length }}</p>
        </div>
      </div>

      <div class="divide-y divide-gray-200">
        <div v-for="req in requests" :key="req.id" class="p-6 hover:bg-gray-50 transition">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="font-mono text-sm font-semibold text-gray-900">{{ req.transaction }}</p>
              <p class="text-sm text-gray-600 mt-1">{{ req.requester }}</p>
            </div>
            <span :class="['px-3 py-1 rounded-full text-xs font-medium', getStatusColor(req.status)]">
              {{ req.status }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-900">${{ req.amount.toLocaleString() }}</span>
            <div v-if="req.status === 'PENDING'" class="flex gap-2">
              <button @click="handleApprove(req.id)" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                ✓ Approve
              </button>
              <button @click="handleReject(req.id)" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                ✕ Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
