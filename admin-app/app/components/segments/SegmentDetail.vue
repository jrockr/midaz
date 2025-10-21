<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <!-- Breadcrumb hierarchy -->
            <span v-for="(crumb, idx) in breadcrumbs" :key="idx" class="flex items-center gap-2">
              <span v-if="idx > 0" class="text-gray-400">/</span>
              <span :class="idx === breadcrumbs.length - 1 ? 'font-semibold text-gray-900' : 'text-gray-600'">
                {{ crumb }}
              </span>
            </span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">{{ segment?.name }}</h2>
          <p class="text-gray-600 text-sm mt-1">{{ segment?.description || "No description" }}</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="$emit('edit')"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
          >
            Edit
          </button>
          <button
            @click="$emit('back')"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
          >
            Back
          </button>
        </div>
      </div>

      <!-- Segment Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 uppercase">Status</label>
          <p class="mt-2">
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                segment?.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800',
              ]"
            >
              {{ segment?.status }}
            </span>
          </p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 uppercase">Accounts</label>
          <p class="mt-2 text-lg font-semibold text-gray-900">
            {{ segment?.accountsCount || 0 }}
          </p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 uppercase">Created</label>
          <p class="mt-2 text-sm text-gray-900">{{ formatDate(segment?.createdAt) }}</p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 uppercase">ID</label>
          <p class="mt-2 text-xs font-mono text-gray-600 truncate">{{ segment?.id }}</p>
        </div>
      </div>
    </div>

    <!-- Hierarchy Breadcrumb -->
    <div v-if="parentSegment" class="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <p class="text-sm text-gray-600">
        <span class="font-medium">Parent Segment:</span>
        <button
          @click="$emit('view-parent')"
          class="ml-1 text-blue-600 hover:text-blue-800 underline"
        >
          {{ parentSegment.name }}
        </button>
      </p>
    </div>

    <!-- Child Segments Section -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Child Segments</h3>
      <div v-if="childSegments.length > 0" class="space-y-2">
        <div v-for="child in childSegments" :key="child.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p class="font-medium text-gray-900">{{ child.name }}</p>
            <p class="text-xs text-gray-600">{{ child.id }}</p>
          </div>
          <button
            @click="$emit('view-child', child.id)"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View
          </button>
        </div>
      </div>
      <div v-else class="text-center py-6 text-gray-500">
        No child segments
      </div>
    </div>

    <!-- Linked Accounts Section -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Linked Accounts</h3>
      <div v-if="linkedAccounts.length > 0" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50">
              <th class="px-4 py-2 text-left font-medium text-gray-700">Account ID</th>
              <th class="px-4 py-2 text-left font-medium text-gray-700">Name</th>
              <th class="px-4 py-2 text-left font-medium text-gray-700">Type</th>
              <th class="px-4 py-2 text-left font-medium text-gray-700">Status</th>
              <th class="px-4 py-2 text-right font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="account in linkedAccounts" :key="account.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="px-4 py-2 font-mono text-xs text-gray-600">{{ account.id }}</td>
              <td class="px-4 py-2 text-gray-900">{{ account.name }}</td>
              <td class="px-4 py-2 text-gray-600">{{ account.type }}</td>
              <td class="px-4 py-2">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    account.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ account.status }}
                </span>
              </td>
              <td class="px-4 py-2 text-right">
                <button
                  @click="$emit('unlink-account', account.id)"
                  class="text-red-600 hover:text-red-800 text-xs font-medium"
                >
                  Unlink
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        No accounts linked to this segment
      </div>
    </div>

    <!-- Metadata Section -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Metadata & Audit</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase">Created By</label>
          <p class="mt-1 text-gray-900">{{ segment?.createdBy || "System" }}</p>
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase">Updated</label>
          <p class="mt-1 text-gray-900">{{ formatDate(segment?.updatedAt) }}</p>
        </div>
      </div>
      <label class="text-xs font-medium text-gray-500 uppercase block mb-2">Metadata</label>
      <pre class="bg-gray-50 p-4 rounded overflow-auto text-sm font-mono">{{
        JSON.stringify(segment?.metadata || {}, null, 2)
      }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults } from "vue";
import type { Segment } from "@/types";

interface Account {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface Props {
  segment?: Segment & { parentSegmentId?: string };
  accounts?: Account[];
  childSegments?: (Segment & { parentSegmentId?: string })[];
  parentSegment?: Segment;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "back"): void;
  (e: "view-parent"): void;
  (e: "view-child", id: string): void;
  (e: "link-account", accountId: string): void;
  (e: "unlink-account", accountId: string): void;
}>();

const linkedAccounts = computed(() => {
  if (!Array.isArray(props.accounts)) return [];
  return props.accounts.filter((a) => a.id);
});

const breadcrumbs = computed(() => {
  const crumbs = [];
  let current = props.segment;

  while (current) {
    crumbs.unshift(current.name);
    current = props.parentSegment;
    if (crumbs.length > 1) break;
  }

  return crumbs;
});

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};
</script>
