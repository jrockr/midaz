<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      :disabled="disabled"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="">{{ placeholder }}</option>
      <optgroup v-for="group in groupedPortfolios" :key="group.status" :label="group.status">
        <option v-for="portfolio in group.items" :key="portfolio.id" :value="portfolio.id">
          {{ portfolio.name }} ({{ portfolio.id }})
        </option>
      </optgroup>
    </select>
    <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Portfolio } from "@/types";

interface Props {
  modelValue?: string;
  portfolios: Portfolio[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

withDefaults(defineProps<Props>(), {
  label: "Portfolio",
  placeholder: "Select a portfolio",
  required: false,
  disabled: false,
});

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const groupedPortfolios = computed(() => {
  const groups: Record<string, { status: string; items: Portfolio[] }> = {};

  props.portfolios.forEach((portfolio) => {
    const status = portfolio.status || "ACTIVE";
    if (!groups[status]) {
      groups[status] = { status, items: [] };
    }
    groups[status].items.push(portfolio);
  });

  return Object.values(groups).sort((a, b) => (a.status === "ACTIVE" ? -1 : 1));
});
</script>
