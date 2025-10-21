<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
      <h3 class="text-lg font-semibold mb-4">Test Operation Route</h3>

      <!-- Test Input -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Test Amount
          </label>
          <input
            v-model.number="testAmount"
            type="number"
            step="0.01"
            placeholder="Enter amount to test"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Test Result -->
        <div v-if="testResult" class="p-4 bg-blue-50 rounded-lg">
          <h4 class="font-semibold text-blue-900 mb-2">Test Result</h4>
          <div class="space-y-2 text-sm text-blue-800">
            <div>
              <span class="font-medium">Input Amount:</span>
              {{ testAmount }}
            </div>
            <div>
              <span class="font-medium">Route Rate:</span>
              {{ testResult.rate }}
            </div>
            <div>
              <span class="font-medium">Output Amount:</span>
              {{ (testAmount * testResult.rate).toFixed(2) }}
            </div>
            <div>
              <span class="font-medium">Status:</span>
              <span :class="testResult.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-600'">
                {{ testResult.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="testError" class="p-4 bg-red-50 rounded-lg">
          <p class="text-sm text-red-800">{{ testError }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-6 flex gap-3">
        <button
          @click="runTest"
          :disabled="testing || !testAmount"
          class="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 font-medium"
        >
          {{ testing ? "Testing..." : "Run Test" }}
        </button>
        <button
          @click="$emit('close')"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useOperationsStore } from "@/stores/operations";
import type { OperationRoute } from "@/types";

interface Props {
  routeId: string;
}

defineProps<Props>();
defineEmits<{
  (e: "close"): void;
}>();

const operationsStore = useOperationsStore();

const testAmount = ref<number | null>(null);
const testing = ref(false);
const testResult = ref<any>(null);
const testError = ref<string>("");
const route = ref<OperationRoute | null>(null);

const runTest = async () => {
  if (!testAmount.value || !route.value) return;

  testing.value = true;
  testError.value = "";
  testResult.value = null;

  try {
    // Simulate test response
    testResult.value = {
      rate: route.value.rate,
      status: route.value.status,
      sourceAccountId: route.value.sourceAccountId,
      destinationAccountId: route.value.destinationAccountId,
    };
  } catch (error) {
    testError.value = "Test failed. Please try again.";
  } finally {
    testing.value = false;
  }
};

onMounted(async () => {
  try {
    route.value = operationsStore.getItemById(props.routeId) || null;
  } catch (error) {
    testError.value = "Failed to load route details";
  }
});
</script>
