<template>
  <div class="space-y-6">
    <nav class="flex items-center space-x-2 text-sm">
      <RouterLink to="/dashboard" class="text-blue-600 hover:text-blue-800">Dashboard</RouterLink>
      <span class="text-gray-400">/</span>
      <RouterLink to="/transactions" class="text-blue-600 hover:text-blue-800">Transactions</RouterLink>
      <span class="text-gray-400">/</span>
      <RouterLink to="/transactions/routes" class="text-blue-600 hover:text-blue-800">Routes</RouterLink>
      <span class="text-gray-400">/</span>
      <span class="text-gray-900 font-medium">Create</span>
    </nav>

    <div>
      <h1 class="text-3xl font-bold text-gray-900">Create Transaction Route</h1>
      <p class="text-gray-600 mt-1">Add a new transaction routing configuration</p>
    </div>

    <div class="bg-white rounded-lg shadow p-6 max-w-2xl">
      <TransactionRouteForm
        :loading="loading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTransactionsStore } from "@/stores/transactions";
import { TransactionRouteForm } from "@/components/transactions";
import type { TransactionRoute } from "@/types";

const router = useRouter();
const transactionsStore = useTransactionsStore();

const loading = ref(false);
const toast = ref({
  show: false,
  message: "",
  type: "success" as "success" | "error",
});

const handleSubmit = async (formData: Partial<TransactionRoute>) => {
  loading.value = true;
  try {
    await transactionsStore.create(formData);
    showToast("Transaction route created successfully", "success");
    setTimeout(() => router.push("/transactions/routes"), 1500);
  } catch (error) {
    showToast("Failed to create transaction route", "error");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.push("/transactions/routes");
};

const showToast = (message: string, type: "success" | "error" = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3000);
};
</script>
