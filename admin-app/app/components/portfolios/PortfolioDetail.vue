<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ portfolio?.name }}</h2>
          <p class="text-gray-600 text-sm mt-1">{{ portfolio?.description || "No description" }}</p>
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

      <!-- Portfolio Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 uppercase">Status</label>
          <p class="mt-2">
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                portfolio?.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800',
              ]"
            >
              {{ portfolio?.status }}
            </span>
          </p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 uppercase">Accounts</label>
          <p class="mt-2 text-lg font-semibold text-gray-900">
            {{ portfolio?.accountsCount || 0 }}
          </p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 uppercase">Created</label>
          <p class="mt-2 text-sm text-gray-900">{{ formatDate(portfolio?.createdAt) }}</p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 uppercase">ID</label>
          <p class="mt-2 text-xs font-mono text-gray-600 truncate">{{ portfolio?.id }}</p>
        </div>
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
        No accounts linked to this portfolio
      </div>

      <!-- Link Account Section -->
      <div v-if="availableAccounts.length > 0" class="mt-6 pt-6 border-t border-gray-200">
        <label class="block text-sm font-medium text-gray-700 mb-2">Link Account</label>
        <div class="flex gap-2">
          <select
            v-model="selectedAccountId"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select account to link</option>
            <option v-for="account in availableAccounts" :key="account.id" :value="account.id">
              {{ account.name }} ({{ account.id }})
            </option>
          </select>
          <button
            @click="handleLinkAccount"
            :disabled="!selectedAccountId || linkingAccount"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium text-sm"
          >
            {{ linkingAccount ? "Linking..." : "Link" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Metadata Section -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Metadata</h3>
      <pre class="bg-gray-50 p-4 rounded overflow-auto text-sm font-mono">{{
        JSON.stringify(portfolio?.metadata || {}, null, 2)
      }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, withDefaults } from "vue";
import type { Portfolio } from "@/types";

interface Account {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface Props {
  portfolio?: Portfolio;
  accounts?: Account[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "back"): void;
  (e: "link-account", accountId: string): void;
  (e: "unlink-account", accountId: string): void;
}>();

const selectedAccountId = ref("");
const linkingAccount = ref(false);

const linkedAccounts = computed(() => {
  if (!Array.isArray(props.accounts)) return [];
  return props.accounts.filter((a) => a.id); // Filter linked accounts
});

const availableAccounts = computed(() => {
  if (!Array.isArray(props.accounts)) return [];
  return props.accounts.filter((a) => !linkedAccounts.value.some((l) => l.id === a.id));
});

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

const handleLinkAccount = async () => {
  if (!selectedAccountId.value) return;

  linkingAccount.value = true;
  try {
    emit("link-account", selectedAccountId.value);
    selectedAccountId.value = "";
  } finally {
    linkingAccount.value = false;
  }
};
</script>
