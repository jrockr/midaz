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

    <!-- Source Account -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Source Account <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.sourceAccountId"
        type="text"
        placeholder="Account ID"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="validateSourceAccount"
      />
      <p v-if="errors.sourceAccountId" class="mt-1 text-sm text-red-500">
        {{ errors.sourceAccountId }}
      </p>
    </div>

    <!-- Destination Account -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Destination Account <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.destinationAccountId"
        type="text"
        placeholder="Account ID"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="validateDestinationAccount"
      />
      <p v-if="errors.destinationAccountId" class="mt-1 text-sm text-red-500">
        {{ errors.destinationAccountId }}
      </p>
    </div>

    <!-- Rate -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Rate <span class="text-red-500">*</span>
      </label>
      <input
        v-model.number="form.rate"
        type="number"
        step="0.0001"
        placeholder="1.0"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="validateRate"
      />
      <p v-if="errors.rate" class="mt-1 text-sm text-red-500">
        {{ errors.rate }}
      </p>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <textarea
        v-model="form.description"
        placeholder="Enter route description"
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
import type { OperationRoute } from "@/types";

interface Props {
  operationRoute?: OperationRoute;
  loading?: boolean;
}

interface Emits {
  (e: "submit", data: Partial<OperationRoute>): void;
  (e: "cancel"): void;
}

defineProps<Props>();
defineEmits<Emits>();

const route = useRoute();
const ledgersStore = useLedgersStore();

const form = ref({
  ledgerId: "",
  sourceAccountId: "",
  destinationAccountId: "",
  rate: 1,
  description: "",
  status: "ACTIVE",
});

const errors = ref({
  ledgerId: "",
  sourceAccountId: "",
  destinationAccountId: "",
  rate: "",
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

const validateSourceAccount = () => {
  if (!form.value.sourceAccountId.trim()) {
    errors.value.sourceAccountId = "Source account is required";
  } else {
    errors.value.sourceAccountId = "";
  }
};

const validateDestinationAccount = () => {
  if (!form.value.destinationAccountId.trim()) {
    errors.value.destinationAccountId = "Destination account is required";
  } else {
    errors.value.destinationAccountId = "";
  }
};

const validateRate = () => {
  if (form.value.rate <= 0) {
    errors.value.rate = "Rate must be greater than 0";
  } else {
    errors.value.rate = "";
  }
};

const handleSubmit = () => {
  validateLedger();
  validateSourceAccount();
  validateDestinationAccount();
  validateRate();

  if (errors.value.ledgerId || errors.value.sourceAccountId || errors.value.destinationAccountId || errors.value.rate) {
    return;
  }

  const formData: Partial<OperationRoute> = {
    ledgerId: form.value.ledgerId,
    sourceAccountId: form.value.sourceAccountId,
    destinationAccountId: form.value.destinationAccountId,
    rate: form.value.rate,
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
