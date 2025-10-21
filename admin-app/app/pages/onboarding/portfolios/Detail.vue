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
      <span class="text-gray-900 font-medium">Detail</span>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-gray-600">Loading...</div>
    </div>

    <!-- Content -->
    <div v-else-if="portfolio" class="space-y-6">
      <!-- Header with Actions -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ portfolio.name }}</h1>
          <p class="text-gray-600 mt-1">{{ portfolio.description || "No description" }}</p>
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
        <h3 class="text-lg font-semibold mb-4">Portfolio Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Organization</label>
            <p class="mt-1 text-gray-900">{{ getOrganizationName(portfolio.organizationId) }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <p class="mt-1">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  portfolio.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ portfolio.status }}
              </span>
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Created</label>
            <p class="mt-1 text-gray-900">{{ formatDate(portfolio.createdAt) }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Modified</label>
            <p class="mt-1 text-gray-900">{{ formatDate(portfolio.updatedAt) }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">ID</label>
            <p class="mt-1 text-gray-900 font-mono text-sm break-all">{{ portfolio.id }}</p>
          </div>
        </div>
      </div>

      <!-- Metadata -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Metadata</h3>
        <pre class="bg-gray-50 p-4 rounded overflow-auto text-sm">{{
          JSON.stringify(portfolio.metadata || {}, null, 2)
        }}</pre>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="bg-white rounded-lg shadow p-6 text-center">
      <p class="text-gray-600">Portfolio not found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { usePortfoliosStore } from "@/stores/portfolios";
import { useOrganizationsStore } from "@/stores/organizations";
import type { Portfolio } from "@/types";

const router = useRouter();
const route = useRoute();
const portfoliosStore = usePortfoliosStore();
const organizationsStore = useOrganizationsStore();

const loading = ref(false);

const portfolioId = computed(() => route.params.id as string);

const portfolio = computed(() => {
  return portfoliosStore.getItemById(portfolioId.value);
});

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

const getOrganizationName = (organizationId: string): string => {
  const org = organizationsStore.getItemById(organizationId);
  return org?.name || "Unknown";
};

const goToEdit = () => {
  router.push(`/onboarding/portfolios/${portfolioId.value}/edit`);
};

const goToList = () => {
  router.push("/onboarding/portfolios");
};

onMounted(async () => {
  loading.value = true;
  try {
    await portfoliosStore.fetch(portfolioId.value);
    await organizationsStore.fetchAll();
  } finally {
    loading.value = false;
  }
});
</script>
