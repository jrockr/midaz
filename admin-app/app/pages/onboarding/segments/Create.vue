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
      <RouterLink to="/onboarding/segments" class="text-blue-600 hover:text-blue-800">
        Segments
      </RouterLink>
      <span class="text-gray-400">/</span>
      <span class="text-gray-900 font-medium">Create</span>
    </nav>

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Create Segment</h1>
      <p class="text-gray-600 mt-1">Add a new segment to your organization</p>
    </div>

    <!-- Form Card -->
    <div class="bg-white rounded-lg shadow p-6 max-w-2xl">
      <SegmentForm
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
import { useSegmentsStore } from "@/stores/segments";
import { SegmentForm } from "@/components/segments";
import type { Segment } from "@/types";

const router = useRouter();
const segmentsStore = useSegmentsStore();

const loading = ref(false);
const toast = ref({
  show: false,
  message: "",
  type: "success" as "success" | "error",
});

const handleSubmit = async (formData: Partial<Segment>) => {
  loading.value = true;
  try {
    await segmentsStore.create(formData);
    showToast("Segment created successfully", "success");
    setTimeout(() => {
      router.push("/onboarding/segments");
    }, 1500);
  } catch (error) {
    showToast("Failed to create segment", "error");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.push("/onboarding/segments");
};

const showToast = (message: string, type: "success" | "error" = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};
</script>
