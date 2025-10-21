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
      <RouterLink to="/segments" class="text-blue-600 hover:text-blue-800">
        Segments
      </RouterLink>
      <span class="text-gray-400">/</span>
      <span class="text-gray-900 font-medium">Create</span>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-96">
      <div class="text-gray-600">Loading...</div>
    </div>

    <!-- Form -->
    <div v-else class="bg-white rounded-lg shadow p-6 max-w-2xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Create Segment</h1>
      <SegmentForm
        :segments="segments"
        :loading="submitting"
        @submit="handleSubmit"
        @cancel="goToList"
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSegmentsStore } from "@/stores/segments";
import SegmentForm from "./SegmentForm.vue";
import type { Segment } from "@/types";

const router = useRouter();
const segmentsStore = useSegmentsStore();

const loading = ref(false);
const submitting = ref(false);
const segments = ref<Segment[]>([]);

const toast = ref({
  show: false,
  message: "",
  type: "success" as "success" | "error",
});

const handleSubmit = async (formData: Partial<Segment>) => {
  submitting.value = true;
  try {
    await segmentsStore.create(formData);
    showToast("Segment created successfully", "success");
    setTimeout(() => {
      goToList();
    }, 1500);
  } catch (error) {
    showToast("Failed to create segment", "error");
    console.error(error);
  } finally {
    submitting.value = false;
  }
};

const showToast = (message: string, type: "success" | "error" = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const goToList = () => {
  router.push("/segments");
};

onMounted(async () => {
  loading.value = true;
  try {
    await segmentsStore.fetchAll();
    segments.value = segmentsStore.items;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>
