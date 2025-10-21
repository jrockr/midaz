<template>
  <div class="space-y-6">
    <nav class="flex items-center space-x-2 text-sm">
      <RouterLink to="/dashboard" class="text-blue-600 hover:text-blue-800">Dashboard</RouterLink>
      <span class="text-gray-400">/</span>
      <RouterLink to="/transactions" class="text-blue-600 hover:text-blue-800">Transactions</RouterLink>
      <span class="text-gray-400">/</span>
      <RouterLink to="/transactions/routes" class="text-blue-600 hover:text-blue-800">Routes</RouterLink>
      <span class="text-gray-400">/</span>
      <span class="text-gray-900 font-medium">Edit</span>
    </nav>

    <div>
      <h1 class="text-3xl font-bold text-gray-900">Edit Transaction Route</h1>
      <p class="text-gray-600 mt-1">Update routing configuration</p>
    </div>

    <div class="bg-white rounded-lg shadow p-6 max-w-2xl">
      <TransactionRouteForm
        :transaction-route="route_"
        :loading="loading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />

      <div v-if="route_" class="mt-8 pt-6 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
        <button
          @click="showDeleteModal = true"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
        >
          Delete Route
        </button>
      </div>
    </div>

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to delete this transaction route?</p>
        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            :disabled="deleteLoading"
            class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 font-medium"
          >
            {{ deleteLoading ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="toast.show"
      :class="[
        'fixed bottom-4 right-4 px-4 py-3 rounded-lg text-white',
        toast.type === 'success' ? 'bg-green-500' : 'bg-red-500',
      ]"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useTransactionsStore } from "@/stores/transactions";
import { TransactionRouteForm } from "@/components/transactions";
import type { TransactionRoute } from "@/types";

const router = useRouter();
const route = useRoute();
const transactionsStore = useTransactionsStore();

const loading = ref(false);
const deleteLoading = ref(false);
const showDeleteModal = ref(false);
const toast = ref({
  show: false,
  message: "",
  type: "success" as "success" | "error",
});

const routeId = computed(() => route.params.id as string);
const route_ = computed(() => transactionsStore.getItemById(routeId.value));

const handleSubmit = async (formData: Partial<TransactionRoute>) => {
  if (!routeId.value) return;
  loading.value = true;
  try {
    await transactionsStore.update(routeId.value, formData);
    showToast("Transaction route updated successfully", "success");
    setTimeout(() => router.push("/transactions/routes"), 1500);
  } catch (error) {
    showToast("Failed to update transaction route", "error");
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  if (!routeId.value) return;
  deleteLoading.value = true;
  try {
    await transactionsStore.delete(routeId.value);
    showToast("Transaction route deleted successfully", "success");
    setTimeout(() => router.push("/transactions/routes"), 1500);
  } catch (error) {
    showToast("Failed to delete transaction route", "error");
  } finally {
    deleteLoading.value = false;
    showDeleteModal.value = false;
  }
};

const handleCancel = () => {
  router.push("/transactions/routes");
};

const showToast = (message: string, type: "success" | "error" = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3000);
};

onMounted(async () => {
  try {
    await transactionsStore.fetch(routeId.value);
  } catch (error) {
    showToast("Failed to load transaction route", "error");
  }
});
</script>
