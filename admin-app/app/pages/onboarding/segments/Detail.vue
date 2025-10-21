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
      <span class="text-gray-900 font-medium">Detail</span>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-gray-600">Loading segment...</div>
    </div>

    <!-- Content -->
    <div v-else-if="segment" class="space-y-6">
      <SegmentDetail
        :segment="segment"
        :accounts="accounts"
        :child-segments="childSegments"
        :parent-segment="parentSegment"
        :loading="accountsLoading"
        @edit="goToEdit"
        @back="goToList"
        @view-parent="goToParent"
        @view-child="goToChild"
        @link-account="handleLinkAccount"
        @unlink-account="handleUnlinkAccount"
      />
    </div>

    <!-- Not Found -->
    <div v-else class="bg-white rounded-lg shadow p-6 text-center">
      <p class="text-gray-600">Segment not found</p>
    </div>

    <!-- Toast Notifications -->
    <div
      v-if="toast.show"
      :class="[
        'fixed bottom-4 right-4 px-4 py-3 rounded-lg text-white z-50',
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
import { useSegmentsStore } from "@/stores/segments";
import { SegmentDetail } from "@/components/segments";
import type { Segment } from "@/types";

interface Account {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface SegmentWithRelations extends Segment {
  parentSegmentId?: string;
  childSegmentIds?: string[];
  accountsCount?: number;
}

const router = useRouter();
const route = useRoute();
const segmentsStore = useSegmentsStore();

const loading = ref(false);
const accountsLoading = ref(false);
const accounts = ref<Account[]>([]);

const toast = ref({
  show: false,
  message: "",
  type: "success" as "success" | "error",
});

const segmentId = computed(() => route.params.id as string);

const segment = computed(() => {
  return segmentsStore.getItemById(segmentId.value) as SegmentWithRelations | undefined;
});

const parentSegment = computed(() => {
  if (!segment.value?.parentSegmentId) return undefined;
  return segmentsStore.getParentSegment(segmentId.value);
});

const childSegments = computed(() => {
  return segmentsStore.getChildSegments(segmentId.value);
});

const handleLinkAccount = async (accountId: string) => {
  try {
    await segmentsStore.linkAccount(segmentId.value, accountId);
    showToast("Account linked successfully", "success");
  } catch (error) {
    showToast("Failed to link account", "error");
  }
};

const handleUnlinkAccount = async (accountId: string) => {
  try {
    await segmentsStore.unlinkAccount(segmentId.value, accountId);
    showToast("Account unlinked successfully", "success");
  } catch (error) {
    showToast("Failed to unlink account", "error");
  }
};

const loadAccounts = async () => {
  accountsLoading.value = true;
  try {
    // Mock accounts - replace with actual API call
    accounts.value = [
      {
        id: "acc-001",
        name: "Checking Account",
        type: "CHECKING",
        status: "ACTIVE",
      },
      {
        id: "acc-002",
        name: "Savings Account",
        type: "SAVINGS",
        status: "ACTIVE",
      },
      {
        id: "acc-003",
        name: "Investment Account",
        type: "INVESTMENT",
        status: "ACTIVE",
      },
    ];
  } catch (error) {
    showToast("Failed to load accounts", "error");
  } finally {
    accountsLoading.value = false;
  }
};

const showToast = (message: string, type: "success" | "error" = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const goToEdit = () => {
  router.push(`/onboarding/segments/${segmentId.value}/edit`);
};

const goToList = () => {
  router.push("/onboarding/segments");
};

const goToParent = () => {
  if (parentSegment.value) {
    router.push(`/onboarding/segments/${parentSegment.value.id}`);
  }
};

const goToChild = (childId: string) => {
  router.push(`/onboarding/segments/${childId}`);
};

onMounted(async () => {
  loading.value = true;
  try {
    await segmentsStore.fetch(segmentId.value);
    await segmentsStore.fetchAll();
    await loadAccounts();
  } finally {
    loading.value = false;
  }
});
</script>
