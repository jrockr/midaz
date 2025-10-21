<script setup lang="ts">
import { Card } from '@/components'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="flex-1 overflow-auto">
    <div class="px-6 py-8">
      <button @click="router.back()" class="text-blue-600 hover:text-blue-900 font-medium mb-4">
        ← Back
      </button>
      <h1 class="text-3xl font-bold text-gray-900">Transaction Detail</h1>
      <p class="text-gray-600 mt-2">Coming soon...</p>
      <Card class="mt-6 p-8 text-center">
        <p class="text-gray-500">This page will display transaction details.</p>
      </Card>
    </div>
  </main>
</template>
