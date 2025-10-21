<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :value="modelValue"
        @input="handleInput"
        type="text"
        placeholder="Type to search..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <!-- Dropdown -->
      <div
        v-if="showDropdown && filteredSegments.length > 0"
        class="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-auto mt-1"
      >
        <button
          v-for="segment in filteredSegments"
          :key="segment.id"
          @click="selectSegment(segment)"
          type="button"
          class="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 flex items-center gap-2"
        >
          <span class="text-xs text-gray-500">{{ segment.id }}</span>
          <span class="font-medium text-gray-900">{{ segment.name }}</span>
          <span v-if="segment.depth" class="text-xs text-gray-400 ml-auto">Level {{ segment.depth }}</span>
        </button>
      </div>
    </div>
    <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Segment } from "@/types";

interface Props {
  modelValue?: string;
  segments: (Segment & { depth?: number })[];
  label?: string;
  required?: boolean;
  error?: string;
  excludeSegmentId?: string;
  maxDepth?: number;
}

withDefaults(defineProps<Props>(), {
  label: "Parent Segment",
  required: false,
  maxDepth: 5,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const searchInput = ref("");
const showDropdown = ref(false);

const filteredSegments = computed(() => {
  return props.segments.filter((segment) => {
    const matchesSearch =
      segment.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      segment.id.toLowerCase().includes(searchInput.value.toLowerCase());
    const isNotExcluded = !props.excludeSegmentId || segment.id !== props.excludeSegmentId;
    const isWithinMaxDepth = !props.maxDepth || !segment.depth || segment.depth < props.maxDepth;

    return matchesSearch && isNotExcluded && isWithinMaxDepth;
  });
});

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  searchInput.value = target.value;
  showDropdown.value = true;
};

const selectSegment = (segment: Segment) => {
  emit("update:modelValue", segment.id);
  searchInput.value = segment.name;
  showDropdown.value = false;
};

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const selected = props.segments.find((s) => s.id === newVal);
    if (selected) {
      searchInput.value = selected.name;
    }
  } else {
    searchInput.value = "";
  }
});
</script>
