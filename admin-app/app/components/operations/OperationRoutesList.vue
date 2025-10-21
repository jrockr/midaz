<template>
  <div class="space-y-4">
    <!-- Search and Filters -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by account ID..."
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        v-model="statusFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>

      <select
        v-model="pageLimit"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="10">10 per page</option>
        <option value="25">25 per page</option>
        <option value="50">50 per page</option>
      </select>
    </div>

    <!-- Create Button -->
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold">Operation Routes</h2>
      <button
        @click="$emit('create')"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
      >
        + Create Route
      </button>
    </div>

    <!-- Table -->
    <OperationRoutesTable
      :items="filteredItems"
      :pagination="pagination"
      @test="openTestModal"
      @edit="$emit('edit', $event)"
      @delete="showDeleteModal = true; deleteTargetId = $event"
      @next-page="handleNextPage"
      @previous-page="handlePreviousPage"
    />

    <!-- Test Modal -->
    <OperationRouteTestModal
      v-if="showTestModal && selectedRouteId"
      :route-id="selectedRouteId"
      @close="closeTestModal"
    />

    <!-- Delete Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this operation route?
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
import { useOperationsStore } from "@/stores/operations";
import OperationRoutesTable from "./OperationRoutesTable.vue";
import OperationRouteTestModal from "./OperationRouteTestModal.vue";
import type { OperationRoute } from "@/types";

defineEmits<{
  (e: "create"): void;
  (e: "edit", id: string): void;
}>();

const operationsStore = useOperationsStore();

const searchQuery = ref("");
const statusFilter = ref("");
const pageLimit = ref(10);
const currentPage = ref(1);
const showDeleteModal = ref(false);
const deleteTargetId = ref<string | null>(null);
const deleteLoading = ref(false);
const showTestModal = ref(false);
const selectedRouteId = ref<string | null>(null);

const toast = ref({
  show: false,
  message: "",
  type: "success" as "success" | "error",
});

const pagination = computed(() => ({
  page: currentPage.value,
  limit: Number(pageLimit.value),
  total: operationsStore.total || 0,
}));

const filteredItems = computed(() => {
  return operationsStore.items.filter((item: OperationRoute) => {
    const searchLower = searchQuery.value.toLowerCase();
    const matchesSearch = 
      item.sourceAccountId.toLowerCase().includes(searchLower) ||
      item.destinationAccountId.toLowerCase().includes(searchLower);
    const matchesStatus = !statusFilter.value || item.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const openTestModal = (routeId: string) => {
  selectedRouteId.value = routeId;
  showTestModal.value = true;
};

const closeTestModal = () => {
  showTestModal.value = false;
  selectedRouteId.value = null;
};

const handleNextPage = async () => {
  if (currentPage.value * Number(pageLimit.value) < (operationsStore.total || 0)) {
    currentPage.value++;
    await loadRoutes();
  }
};

const handlePreviousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await loadRoutes();
  }
};

const handleDelete = async () => {
  if (!deleteTargetId.value) return;

  deleteLoading.value = true;
  try {
    await operationsStore.delete(deleteTargetId.value);
    showDeleteModal.value = false;
    deleteTargetId.value = null;
    showToast("Route deleted successfully", "success");
    await loadRoutes();
  } catch (error) {
    showToast("Failed to delete route", "error");
  } finally {
    deleteLoading.value = false;
  }
};

const loadRoutes = async () => {
  try {
    await operationsStore.fetchAll({
      limit: Number(pageLimit.value),
      page: currentPage.value,
    });
  } catch (error) {
    showToast("Failed to load routes", "error");
  }
};

const showToast = (message: string, type: "success" | "error" = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

onMounted(() => {
  loadRoutes();
});
</script>
