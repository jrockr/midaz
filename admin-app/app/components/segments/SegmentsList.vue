<template>
  <div class="space-y-4">
    <!-- Organization & Ledger Selectors -->
    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Organization <span class="text-red-500">*</span>
          </label>
          <input
            v-model="orgSearchQuery"
            type="text"
            placeholder="Search organizations..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            v-model="selectedOrgId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an organization</option>
            <option v-for="org in filteredOrganizations" :key="org.id" :value="org.id">
              {{ org.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ledger <span class="text-red-500">*</span>
          </label>
          <input
            v-model="ledgerSearchQuery"
            type="text"
            placeholder="Search ledgers..."
            :disabled="!selectedOrgId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <select
            v-model="selectedLedgerId"
            :disabled="!selectedOrgId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select a ledger</option>
            <option v-for="ledger in filteredLedgers" :key="ledger.id" :value="ledger.id">
              {{ ledger.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div v-if="selectedOrgId && selectedLedgerId" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name or code..."
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
      <h2 class="text-lg font-semibold">Segments</h2>
      <button
        @click="$emit('create')"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
      >
        + Create Segment
      </button>
    </div>

    <!-- Table -->
    <SegmentsTable
      v-if="selectedOrgId && selectedLedgerId"
      :items="filteredItems"
      :pagination="pagination"
      @view="$emit('view', $event)"
      @edit="$emit('edit', $event)"
      @delete="showDeleteModal = true; deleteTargetId = $event"
      @next-page="handleNextPage"
      @previous-page="handlePreviousPage"
    />
    <div v-else class="bg-white rounded-lg shadow p-8 text-center text-gray-500">
      <p>Please select an organization and ledger to view segments</p>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this segment? This action cannot be
          undone.
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
import { ref, computed, onMounted, watch } from "vue";
import { useSegmentsStore } from "@/stores/segments";
import { useOrganizationsStore } from "@/stores/organizations";
import { useLedgersStore } from "@/stores/ledgers";
import SegmentsTable from "./SegmentsTable.vue";
import type { Segment } from "@/types";

defineEmits<{
  (e: "create"): void;
  (e: "view", id: string): void;
  (e: "edit", id: string): void;
}>();

const segmentsStore = useSegmentsStore();
const organizationsStore = useOrganizationsStore();
const ledgersStore = useLedgersStore();

const searchQuery = ref("");
const orgSearchQuery = ref("");
const ledgerSearchQuery = ref("");
const selectedOrgId = ref("");
const selectedLedgerId = ref("");
const statusFilter = ref("");
const pageLimit = ref(10);
const currentPage = ref(1);
const showDeleteModal = ref(false);
const deleteTargetId = ref<string | null>(null);
const deleteLoading = ref(false);

const toast = ref({
  show: false,
  message: "",
  type: "success" as "success" | "error",
});

const filteredOrganizations = computed(() => {
  if (!orgSearchQuery.value) return organizationsStore.items;
  const query = orgSearchQuery.value.toLowerCase();
  return organizationsStore.items.filter(org => 
    org.name.toLowerCase().includes(query) || org.id.toLowerCase().includes(query)
  );
});

const filteredLedgers = computed(() => {
  if (!ledgerSearchQuery.value) return ledgersStore.items;
  const query = ledgerSearchQuery.value.toLowerCase();
  return ledgersStore.items.filter(ledger => 
    ledger.name.toLowerCase().includes(query) || ledger.id.toLowerCase().includes(query)
  );
});

const pagination = computed(() => ({
  page: currentPage.value,
  limit: Number(pageLimit.value),
  total: segmentsStore.total || 0,
}));

const filteredItems = computed(() => {
  return segmentsStore.items.filter((item: Segment) => {
    const searchLower = searchQuery.value.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchLower) ||
      item.code.toLowerCase().includes(searchLower) ||
      (item.description && item.description.toLowerCase().includes(searchLower));
    const matchesStatus = !statusFilter.value || item.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const handleNextPage = async () => {
  if (currentPage.value * Number(pageLimit.value) < (segmentsStore.total || 0)) {
    currentPage.value++;
    await loadSegments();
  }
};

const handlePreviousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await loadSegments();
  }
};

const handleDelete = async () => {
  if (!deleteTargetId.value) return;

  deleteLoading.value = true;
  try {
    await segmentsStore.delete(deleteTargetId.value);
    showDeleteModal.value = false;
    deleteTargetId.value = null;
    showToast("Segment deleted successfully", "success");
    await loadSegments();
  } catch (error) {
    showToast("Failed to delete segment", "error");
  } finally {
    deleteLoading.value = false;
  }
};

const loadSegments = async () => {
  if (!selectedOrgId.value || !selectedLedgerId.value) {
    showToast("Please select organization and ledger first", "error");
    return;
  }
  try {
    await segmentsStore.fetchAll({
      organizationId: selectedOrgId.value,
      ledgerId: selectedLedgerId.value,
      limit: Number(pageLimit.value),
      page: currentPage.value,
    });
  } catch (error) {
    showToast("Failed to load segments", "error");
  }
};

const showToast = (message: string, type: "success" | "error" = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

watch(selectedOrgId, async (newOrgId) => {
  if (newOrgId) {
    selectedLedgerId.value = "";
    await ledgersStore.fetchAll({ organizationId: newOrgId, limit: 100 });
  }
});

watch(selectedLedgerId, (newLedgerId) => {
  if (newLedgerId && selectedOrgId.value) {
    loadSegments();
  }
});

onMounted(() => {
  organizationsStore.fetchAll({ limit: 100 });
});
</script>
