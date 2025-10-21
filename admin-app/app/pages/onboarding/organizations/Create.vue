<template>
  <div class="space-y-6">
    <nav class="flex items-center space-x-2 text-sm">
      <RouterLink to="/dashboard" class="text-blue-600 hover:text-blue-800">Dashboard</RouterLink>
      <span class="text-gray-400">/</span>
      <RouterLink to="/organizations" class="text-blue-600 hover:text-blue-800">Organizations</RouterLink>
      <span class="text-gray-400">/</span>
      <span class="text-gray-900 font-medium">Create</span>
    </nav>

    <div>
      <h1 class="text-3xl font-bold text-gray-900">Create Organization</h1>
      <p class="text-gray-600 mt-1">Add a new organization to the system</p>
    </div>

    <div class="bg-white rounded-lg shadow p-6 max-w-2xl">
      <OrganizationForm
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
import { useOrganizationsStore } from "@/stores/organizations";
import { OrganizationForm } from "@/components/organizations";
import type { CreateOrganizationDto } from "@/types";

const router = useRouter();
const organizationsStore = useOrganizationsStore();

const loading = ref(false);
const toast = ref({ show: false, message: "", type: "success" as "success" | "error" });

const handleSubmit = async (formData: CreateOrganizationDto) => {
  loading.value = true;
  try {
    await organizationsStore.create(formData);
    showToast("Organization created successfully", "success");
    setTimeout(() => router.push("/organizations"), 1500);
  } catch (error) {
    showToast("Failed to create organization", "error");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => router.push("/organizations");

const showToast = (message: string, type: "success" | "error" = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3000);
};
</script>
