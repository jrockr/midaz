<template>
  <div class="space-y-6">
    <nav class="flex items-center space-x-2 text-sm">
      <RouterLink to="/dashboard" class="text-blue-600 hover:text-blue-800">Dashboard</RouterLink>
      <span class="text-gray-400">/</span>
      <RouterLink to="/accounts" class="text-blue-600 hover:text-blue-800">Accounts</RouterLink>
      <span class="text-gray-400">/</span>
      <span class="text-gray-900 font-medium">Create</span>
    </nav>

    <div>
      <h1 class="text-3xl font-bold text-gray-900">Create Account</h1>
      <p class="text-gray-600 mt-1">Add a new account to the system</p>
    </div>

    <div class="bg-white rounded-lg shadow p-6 max-w-2xl">
      <AccountForm
        :is-loading="loading"
        :is-editing="false"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>

    <div
      v-if="toast.show"
      :class="['fixed bottom-4 right-4 px-4 py-3 rounded-lg text-white', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAccountsStore } from "@/stores/accounts";
import { AccountForm } from "@/components/accounts";
import type { CreateAccountDto } from "@/types";

const router = useRouter();
const accountsStore = useAccountsStore();

const loading = ref(false);
const toast = ref({ show: false, message: "", type: "success" as "success" | "error" });

const handleSubmit = async (formData: CreateAccountDto) => {
  loading.value = true;
  try {
    await accountsStore.create(formData);
    showToast("Account created successfully", "success");
    setTimeout(() => router.push("/accounts"), 1500);
  } catch (error) {
    showToast("Failed to create account", "error");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => router.push("/accounts");

const showToast = (message: string, type: "success" | "error" = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3000);
};
</script>
