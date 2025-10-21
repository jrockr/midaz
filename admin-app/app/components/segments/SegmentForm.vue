<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Organization Selector -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Organization <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.organizationId"
        :disabled="isEditing"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        @blur="validateOrganization"
      >
        <option value="">Select an organization</option>
        <option v-for="org in organizations" :key="org.id" :value="org.id">
          {{ org.name }}
        </option>
      </select>
      <p v-if="errors.organizationId" class="mt-1 text-sm text-red-500">
        {{ errors.organizationId }}
      </p>
    </div>

    <!-- Code (Unique Identifier) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Code <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.code"
        type="text"
        placeholder="e.g., SEG-001"
        :disabled="isEditing"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        @blur="validateCode"
      />
      <p v-if="errors.code" class="mt-1 text-sm text-red-500">
        {{ errors.code }}
      </p>
      <p class="mt-1 text-sm text-gray-500">Unique identifier for the segment</p>
    </div>

    <!-- Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Name <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.name"
        type="text"
        placeholder="e.g., Retail Segment"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="validateName"
      />
      <p v-if="errors.name" class="mt-1 text-sm text-red-500">
        {{ errors.name }}
      </p>
    </div>

    <!-- Parent Segment (Optional) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Parent Segment (Optional)
      </label>
      <select
        v-model="form.parentSegmentId"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">None (Top Level)</option>
        <option v-for="segment in availableParents" :key="segment.id" :value="segment.id">
          {{ segment.name }}
        </option>
      </select>
      <p class="mt-1 text-sm text-gray-500">Select a parent to create a hierarchical segment</p>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <textarea
        v-model="form.description"
        placeholder="Enter segment description"
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Status -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Status
      </label>
      <div class="flex gap-4">
        <label class="flex items-center">
          <input
            v-model="form.status"
            type="radio"
            value="ACTIVE"
            class="mr-2"
          />
          <span>Active</span>
        </label>
        <label class="flex items-center">
          <input
            v-model="form.status"
            type="radio"
            value="INACTIVE"
            class="mr-2"
          />
          <span>Inactive</span>
        </label>
      </div>
    </div>

    <!-- Metadata -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Metadata (JSON)
      </label>
      <button
        type="button"
        @click="showMetadataModal = true"
        class="inline-block px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
      >
        Edit Metadata
      </button>
      <p class="mt-1 text-sm text-gray-500">
        {{ metadataPreview }}
      </p>
    </div>

    <!-- Metadata Modal -->
    <div
      v-if="showMetadataModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Edit Metadata</h3>
        <textarea
          v-model="form.metadata"
          rows="6"
          placeholder='{"key": "value"}'
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
        <div v-if="metadataError" class="mt-2 text-sm text-red-500">
          {{ metadataError }}
        </div>
        <div class="mt-6 flex gap-2">
          <button
            type="button"
            @click="closeMetadataModal"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="confirmMetadata"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex gap-3 pt-6">
      <button
        type="submit"
        :disabled="loading"
        class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        {{ loading ? "Saving..." : isEditing ? "Update" : "Create" }}
      </button>
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useOrganizationsStore } from "@/stores/organizations";
import type { Segment } from "@/types";

interface Props {
  segment?: Segment;
  segments?: Segment[];
  loading?: boolean;
}

interface Emits {
  (e: "submit", data: Partial<Segment>): void;
  (e: "cancel"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const route = useRoute();
const organizationsStore = useOrganizationsStore();

const form = ref({
  organizationId: "",
  code: "",
  name: "",
  parentSegmentId: "",
  description: "",
  status: "ACTIVE",
  metadata: "{}",
});

const errors = ref({
  organizationId: "",
  code: "",
  name: "",
});

const showMetadataModal = ref(false);
const metadataError = ref("");

const isEditing = computed(() => {
  return !!(route.params.id && form.value.organizationId);
});

const metadataPreview = computed(() => {
  try {
    const meta = JSON.parse(form.value.metadata);
    const keys = Object.keys(meta);
    if (keys.length === 0) return "No metadata";
    return `${keys.length} field(s)`;
  } catch {
    return "Invalid JSON";
  }
});

const organizations = computed(() => organizationsStore.items || []);

const availableParents = computed(() => {
  const segments = props.segments || [];
  return segments.filter((s) => s.id !== props.segment?.id);
});

const validateOrganization = () => {
  if (!form.value.organizationId) {
    errors.value.organizationId = "Organization is required";
  } else {
    errors.value.organizationId = "";
  }
};

const validateCode = () => {
  if (!form.value.code.trim()) {
    errors.value.code = "Code is required";
  } else {
    errors.value.code = "";
  }
};

const validateName = () => {
  if (!form.value.name.trim()) {
    errors.value.name = "Name is required";
  } else {
    errors.value.name = "";
  }
};

const closeMetadataModal = () => {
  metadataError.value = "";
  showMetadataModal.value = false;
};

const confirmMetadata = () => {
  try {
    JSON.parse(form.value.metadata);
    metadataError.value = "";
    closeMetadataModal();
  } catch (e) {
    metadataError.value = "Invalid JSON format";
  }
};

const handleSubmit = () => {
  validateOrganization();
  validateCode();
  validateName();

  if (errors.value.organizationId || errors.value.code || errors.value.name) {
    return;
  }

  const formData: Partial<Segment> = {
    organizationId: form.value.organizationId,
    code: form.value.code,
    name: form.value.name,
    parentSegmentId: form.value.parentSegmentId || undefined,
    description: form.value.description,
    status: { code: form.value.status },
    metadata: form.value.metadata ? JSON.parse(form.value.metadata) : {},
  };

  emit("submit", formData);
};


onMounted(async () => {
  await organizationsStore.fetch();
  
  if (props.segment) {
    form.value = {
      organizationId: props.segment.organizationId || "",
      code: props.segment.code || "",
      name: props.segment.name || "",
      parentSegmentId: props.segment.parentSegmentId || "",
      description: props.segment.description || "",
      status: props.segment.status || "ACTIVE",
      metadata: props.segment.metadata ? JSON.stringify(props.segment.metadata, null, 2) : "{}",
    };
  }
});
</script>
