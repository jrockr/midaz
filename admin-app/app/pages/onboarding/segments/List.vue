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
      <span class="text-gray-900 font-medium">Segments</span>
    </nav>

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Segments</h1>
      <p class="text-gray-600 mt-1">
        Manage segment categories for your organizations
      </p>
    </div>

    <!-- List Component -->
    <SegmentsList
      @create="goToCreate"
      @view="goToDetail"
      @edit="goToEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { SegmentsList } from "@/components/segments";

const router = useRouter();

const goToCreate = () => {
  router.push("/onboarding/segments/create");
};

const goToDetail = (id: string) => {
  router.push(`/onboarding/segments/${id}`);
};

const goToEdit = (id: string) => {
  router.push(`/onboarding/segments/${id}/edit`);
};
</script>
