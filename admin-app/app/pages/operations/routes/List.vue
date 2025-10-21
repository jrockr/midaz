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
      <span class="text-gray-900 font-medium">Routes</span>
    </nav>

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Operation Routes</h1>
      <p class="text-gray-600 mt-1">
        Manage operation routes with testing capabilities
      </p>
    </div>

    <!-- List Component -->
    <OperationRoutesList
      @create="goToCreate"
      @edit="goToEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { OperationRoutesList } from "@/components/operations";

const router = useRouter();

const goToCreate = () => {
  router.push("/operations/routes/create");
};

const goToEdit = (id: string) => {
  router.push(`/operations/routes/${id}/edit`);
};
</script>
