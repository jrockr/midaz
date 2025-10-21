<template>
  <div class="space-y-6">
    <!-- Breadcrumbs -->
    <nav class="flex items-center space-x-2 text-sm">
      <RouterLink to="/dashboard" class="text-blue-600 hover:text-blue-800">
        Dashboard
      </RouterLink>
      <span class="text-gray-400">/</span>
      <RouterLink to="/onboarding" class="text-blue-600 hover:text-blue-800">
        Onboarding
      </RouterLink>
      <span class="text-gray-400">/</span>
      <RouterLink to="/onboarding/portfolios" class="text-blue-600 hover:text-blue-800">
        Portfolios
      </RouterLink>
      <span class="text-gray-400">/</span>
      <span class="text-gray-900 font-medium">Edit</span>
    </nav>

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Edit Portfolio</h1>
      <p class="text-gray-600 mt-1">Update portfolio details</p>
    </div>

    <!-- Form Card -->
    <div class="bg-white rounded-lg shadow p-6 max-w-2xl">
      <PortfolioForm
        :portfolio="portfolio"
        :loading="loading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />

      <!-- Delete Section -->
      <div v-if="portfolio" class="mt-8 pt-6 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
        <button
          @click="showDeleteModal = true"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
        >
          Delete Portfolio
        </button>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "{{ portfolio?.name }}"? This action
          cannot be undone.
        </p>
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
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { usePortfoliosStore } from "@/stores/portfolios";
import { PortfolioForm } from "@/components/portfolios";
import type { Portfolio } from "@/types";

const router = useRouter();
const route = useRoute();
const portfoliosStore = usePortfoliosStore();

const loading = ref(false);
const deleteLoading = ref(false);
const showDeleteModal = ref(false);
const toast = ref({
  show: false,
  message: "",
  type: "success" as "success" | "error",
});

const portfolioId = computed(() => route.params.id as string);

const portfolio = computed(() => {
  return portfoliosStore.getItemById(portfolioId.value);
});

const handleSubmit = async (formData: Partial<Portfolio>) => {
  if (!portfolioId.value) return;

  loading.value = true;
  try {
    await portfoliosStore.update(portfolioId.value, formData);
    showToast("Portfolio updated successfully", "success");
    setTimeout(() => {
      router.push("/onboarding/portfolios");
    }, 1500);
  } catch (error) {
    showToast("Failed to update portfolio", "error");
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  if (!portfolioId.value) return;

  deleteLoading.value = true;
  try {
    await portfoliosStore.delete(portfolioId.value);
    showToast("Portfolio deleted successfully", "success");
    setTimeout(() => {
      router.push("/onboarding/portfolios");
    }, 1500);
  } catch (error) {
    showToast("Failed to delete portfolio", "error");
  } finally {
    deleteLoading.value = false;
    showDeleteModal.value = false;
  }
};

const handleCancel = () => {
  router.push("/onboarding/portfolios");
};

const showToast = (message: string, type: "success" | "error" = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

onMounted(async () => {
  try {
    await portfoliosStore.fetch(portfolioId.value);
  } catch (error) {
    showToast("Failed to load portfolio", "error");
  }
});
</script>
