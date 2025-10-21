<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b border-gray-200 bg-gray-50">
          <th
            class="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
            @click="sortBy('name')"
          >
            Name {{ sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓') }}
          </th>
          <th
            class="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
            @click="sortBy('organization')"
          >
            Organization {{ sortField === 'organization' && (sortOrder === 'asc' ? '↑' : '↓') }}
          </th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">
            Status
          </th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">
            Created
          </th>
          <th class="px-6 py-3 text-right text-sm font-semibold text-gray-900">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-if="items.length === 0"
          class="border-b border-gray-200 hover:bg-gray-50"
        >
          <td colspan="5" class="px-6 py-4 text-center text-gray-500">
            No portfolios found
          </td>
        </tr>
        <tr
          v-for="item in items"
          :key="item.id"
          class="border-b border-gray-200 hover:bg-gray-50"
        >
          <td class="px-6 py-4 text-sm text-gray-900">
            {{ item.name }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-600">
            {{ getOrganizationName(item.organizationId) }}
          </td>
          <td class="px-6 py-4 text-sm">
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                item.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800',
              ]"
            >
              {{ item.status }}
            </span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-600">
            {{ formatDate(item.createdAt) }}
          </td>
          <td class="px-6 py-4 text-right">
            <div class="flex gap-2 justify-end">
              <button
                @click="$emit('view', item.id)"
                class="px-3 py-1 text-sm border border-blue-300 text-blue-600 rounded hover:bg-blue-50"
              >
                View
              </button>
              <button
                @click="$emit('edit', item.id)"
                class="px-3 py-1 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', item.id)"
                class="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div v-if="pagination.total > 0" class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
        {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of
        {{ pagination.total }} portfolios
      </div>
      <div class="flex gap-2">
        <button
          @click="$emit('previous-page')"
          :disabled="pagination.page <= 1"
          class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div class="flex items-center gap-2">
          <span class="text-sm">Page {{ pagination.page }} of {{ totalPages }}</span>
        </div>
        <button
          @click="$emit('next-page')"
          :disabled="pagination.page >= totalPages"
          class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useOrganizationsStore } from "@/stores/organizations";
import type { Portfolio } from "@/types";

interface Props {
  items: Portfolio[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

defineProps<Props>();

defineEmits<{
  (e: "view", id: string): void;
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
  (e: "next-page"): void;
  (e: "previous-page"): void;
  (e: "sort", field: string): void;
}>();

const organizationsStore = useOrganizationsStore();
const sortField = ref<string>("name");
const sortOrder = ref<"asc" | "desc">("asc");

const totalPages = computed(() => {
  return Math.ceil((props.pagination.total || 1) / props.pagination.limit);
});

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

const getOrganizationName = (organizationId: string): string => {
  const org = organizationsStore.getItemById(organizationId);
  return org?.name || "Unknown";
};

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
};
</script>
