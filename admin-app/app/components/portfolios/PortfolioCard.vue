<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="portfolio in portfolios"
      :key="portfolio.id"
      class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 cursor-pointer"
      @click="$emit('select', portfolio.id)"
    >
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900">{{ portfolio.name }}</h3>
          <p class="text-xs text-gray-500 mt-1">{{ portfolio.id }}</p>
        </div>
        <span
          :class="[
            'px-2 py-1 rounded text-xs font-medium',
            portfolio.status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800',
          ]"
        >
          {{ portfolio.status }}
        </span>
      </div>

      <p v-if="portfolio.description" class="text-sm text-gray-600 line-clamp-2 mb-3">
        {{ portfolio.description }}
      </p>

      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="bg-gray-50 p-2 rounded">
          <p class="text-gray-500">Accounts</p>
          <p class="font-semibold text-gray-900">{{ portfolio.accountsCount || 0 }}</p>
        </div>
        <div class="bg-gray-50 p-2 rounded">
          <p class="text-gray-500">Created</p>
          <p class="font-semibold text-gray-900">{{ formatDate(portfolio.createdAt) }}</p>
        </div>
      </div>

      <div class="mt-3 flex gap-2">
        <button
          @click.stop="$emit('view', portfolio.id)"
          class="flex-1 text-center px-2 py-1 text-xs border border-blue-300 text-blue-600 rounded hover:bg-blue-50"
        >
          View
        </button>
        <button
          @click.stop="$emit('edit', portfolio.id)"
          class="flex-1 text-center px-2 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
        >
          Edit
        </button>
      </div>
    </div>

    <div v-if="portfolios.length === 0" class="col-span-full text-center py-8 text-gray-500">
      No portfolios found
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Portfolio } from "@/types";

interface Props {
  portfolios: Portfolio[];
}

defineProps<Props>();

defineEmits<{
  (e: "select", id: string): void;
  (e: "view", id: string): void;
  (e: "edit", id: string): void;
}>();

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};
</script>
