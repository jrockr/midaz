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
      <span class="text-gray-900 font-medium">Create</span>
    </nav>

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Create Operation Route</h1>
      <p class="text-gray-600 mt-1">Add a new operation route</p>
    </div>

    <!-- Form Card -->
    <div class="bg-white rounded-lg shadow p-6 max-w-2xl">
      <OperationRouteForm
        :loading="loading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>

    <!-- Toast Notifications -->
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
import { useOperationsStore } from "@/stores/operations";
import { OperationRouteForm } from "@/components/operations";
import type { OperationRoute } from "@/types";

const router = useRouter();
const operationsStore = useOperationsStore();

const loading = ref(false);
const toast = ref({
  show: false,
  message: "",
  type: "success" as "success" | "error",
});

const handleSubmit = async (formData: Partial<OperationRoute>) => {
  loading.value = true;
  try {
    await operationsStore.create(formData);
    showToast("Operation route created successfully", "success");
    setTimeout(() => {
      router.push("/operations/routes");
    }, 1500);
  } catch (error) {
    showToast("Failed to create operation route", "error");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.push("/operations/routes");
};

const showToast = (message: string, type: "success" | "error" = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};
</script>
