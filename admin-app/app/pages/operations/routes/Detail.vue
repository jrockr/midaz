<template>
  <div class="space-y-6">
    <!-- Breadcrumbs -->
    <nav class="flex items-center space-x-2 text-sm">
      <RouterLink to="/dashboard" class="text-blue-600 hover:text-blue-800">
        Dashboard
      </RouterLink>
      <span class="text-gray-400">/</span>
      <RouterLink to="/operations" class="text-blue-600 hover:text-blue-800">
        Operations
      </RouterLink>
      <span class="text-gray-400">/</span>
      <RouterLink to="/operations/routes" class="text-blue-600 hover:text-blue-800">
        Routes
      </RouterLink>
      <span class="text-gray-400">/</span>
      <span class="text-gray-900 font-medium">Detail</span>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-gray-600">Loading...</div>
    </div>

    <!-- Content -->
    <div v-else-if="operationRoute" class="space-y-6">
      <!-- Header with Actions -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Operation Route</h1>
          <p class="text-gray-600 mt-1">
            {{ truncateId(operationRoute.sourceAccountId) }} →
            {{ truncateId(operationRoute.destinationAccountId) }}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            @click="goToEdit"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Edit
          </button>
          <button
            @click="goToList"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Back
          </button>
        </div>
      </div>

      <!-- Details Grid -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Route Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Ledger</label>
            <p class="mt-1 text-gray-900">{{ getLedgerName(operationRoute.ledgerId) }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Rate</label>
            <p class="mt-1 text-gray-900 font-semibold text-lg">
              {{ operationRoute.rate.toFixed(4) }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Source Account</label>
            <p class="mt-1 text-gray-900 font-mono text-sm break-all">
              {{ operationRoute.sourceAccountId }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Destination Account</label>
            <p class="mt-1 text-gray-900 font-mono text-sm break-all">
              {{ operationRoute.destinationAccountId }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <p class="mt-1">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  operationRoute.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ operationRoute.status }}
              </span>
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Created</label>
            <p class="mt-1 text-gray-900">{{ formatDate(operationRoute.createdAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div v-if="operationRoute.description" class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Description</h3>
        <p class="text-gray-700">{{ operationRoute.description }}</p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="bg-white rounded-lg shadow p-6 text-center">
      <p class="text-gray-600">Operation route not found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useOperationsStore } from "@/stores/operations";
import { useLedgersStore } from "@/stores/ledgers";
import type { OperationRoute } from "@/types";

const router = useRouter();
const route = useRoute();
const operationsStore = useOperationsStore();
const ledgersStore = useLedgersStore();

const loading = ref(false);

const routeId = computed(() => route.params.id as string);

const operationRoute = computed(() => {
  return operationsStore.getItemById(routeId.value);
});

const truncateId = (id: string): string => {
  return id.substring(0, 8) + "...";
};

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

const getLedgerName = (ledgerId: string): string => {
  const ledger = ledgersStore.getItemById(ledgerId);
  return ledger?.name || "Unknown";
};

const goToEdit = () => {
  router.push(`/operations/routes/${routeId.value}/edit`);
};

const goToList = () => {
  router.push("/operations/routes");
};

onMounted(async () => {
  loading.value = true;
  try {
    await operationsStore.fetch(routeId.value);
    await ledgersStore.fetchAll();
  } finally {
    loading.value = false;
  }
});
</script>
