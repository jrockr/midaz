<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Ledger Selector -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Ledger <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.ledgerId"
        :disabled="isEditing"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        @blur="validateLedger"
      >
        <option value="">Select a ledger</option>
        <option v-for="ledger in ledgers" :key="ledger.id" :value="ledger.id">
          {{ ledger.name }}
        </option>
      </select>
      <p v-if="errors.ledgerId" class="mt-1 text-sm text-red-500">
        {{ errors.ledgerId }}
      </p>
    </div>

    <!-- Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Route Name <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.name"
        type="text"
        placeholder="e.g., Multi-Step Transfer Route"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="validateName"
      />
      <p v-if="errors.name" class="mt-1 text-sm text-red-500">
        {{ errors.name }}
      </p>
    </div>

    <!-- Number of Steps -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Processing Steps <span class="text-red-500">*</span>
      </label>
      <input
        v-model.number="form.steps"
        type="number"
        min="1"
        max="10"
        placeholder="Number of steps"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="validateSteps"
      />
      <p v-if="errors.steps" class="mt-1 text-sm text-red-500">
        {{ errors.steps }}
      </p>
      <p class="mt-1 text-sm text-gray-500">Between 1 and 10 processing steps</p>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <textarea
        v-model="form.description"
        placeholder="Describe the transaction routing flow"
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

    <!-- Submit Button -->
    <div class="flex gap-3 pt-6">
      <button
        type="submit"
        :disabled="loading"
        class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium"
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
import { useLedgersStore } from "@/stores/ledgers";
import type { TransactionRoute } from "@/types";

interface Props {
  transactionRoute?: TransactionRoute;
  loading?: boolean;
}

interface Emits {
  (e: "submit", data: Partial<TransactionRoute>): void;
  (e: "cancel"): void;
}

defineProps<Props>();
defineEmits<Emits>();

const route = useRoute();
const ledgersStore = useLedgersStore();

const form = ref({
  ledgerId: "",
  name: "",
  steps: 1,
  description: "",
  status: "ACTIVE",
});

const errors = ref({
  ledgerId: "",
  name: "",
  steps: "",
});

const isEditing = computed(() => {
  return !!(route.params.id && form.value.ledgerId);
});

const ledgers = computed(() => ledgersStore.items);

const validateLedger = () => {
  if (!form.value.ledgerId) {
    errors.value.ledgerId = "Ledger is required";
  } else {
    errors.value.ledgerId = "";
  }
};

const validateName = () => {
  if (!form.value.name.trim()) {
    errors.value.name = "Route name is required";
  } else {
    errors.value.name = "";
  }
};

const validateSteps = () => {
  if (form.value.steps < 1 || form.value.steps > 10) {
    errors.value.steps = "Steps must be between 1 and 10";
  } else {
    errors.value.steps = "";
  }
};

const handleSubmit = () => {
  validateLedger();
  validateName();
  validateSteps();

  if (errors.value.ledgerId || errors.value.name || errors.value.steps) {
    return;
  }

  const formData: Partial<TransactionRoute> = {
    ledgerId: form.value.ledgerId,
    name: form.value.name,
    steps: form.value.steps,
    description: form.value.description,
    status: form.value.status,
  };

  emit("submit", formData);
};

const emit = defineEmits<Emits>();

onMounted(() => {
  ledgersStore.fetchAll();
});
</script>
