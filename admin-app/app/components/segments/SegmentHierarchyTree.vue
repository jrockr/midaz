<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700 mb-3">Segment Hierarchy</label>
    
    <div class="space-y-1">
      <button
        v-for="segment in hierarchyTree"
        :key="segment.id"
        @click="$emit('select', segment.id)"
        :style="{ marginLeft: `${segment.depth * 1.5}rem` }"
        :class="[
          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
          'hover:bg-blue-50 border border-transparent hover:border-blue-200',
          selectedIds.includes(segment.id)
            ? 'bg-blue-100 border-blue-300 text-blue-900'
            : 'text-gray-700'
        ]"
      >
        <div class="flex items-center gap-2">
          <span v-if="segment.hasChildren" class="text-xs text-gray-400">📁</span>
          <span v-else class="text-xs text-gray-400">├─</span>
          <span class="font-medium">{{ segment.name }}</span>
          <span class="text-xs text-gray-500 ml-auto">{{ segment.accountsCount || 0 }} accounts</span>
        </div>
      </button>
    </div>

    <div v-if="hierarchyTree.length === 0" class="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded">
      No segments found
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Segment } from "@/types";

interface HierarchyNode extends Segment {
  depth: number;
  hasChildren?: boolean;
}

interface Props {
  segments: Segment[];
  selectedIds?: string[];
  expandedIds?: string[];
}

withDefaults(defineProps<Props>(), {
  selectedIds: () => [],
  expandedIds: () => [],
});

defineEmits<{
  (e: "select", id: string): void;
  (e: "toggle-expand", id: string): void;
}>();

const hierarchyTree = computed(() => {
  const tree: HierarchyNode[] = [];
  const depthMap = new Map<string, number>();
  const childrenMap = new Map<string | null, string[]>();

  // Group segments by parent
  props.segments.forEach((segment) => {
    const parentId = (segment as any).parentSegmentId || null;
    if (!childrenMap.has(parentId)) {
      childrenMap.set(parentId, []);
    }
    childrenMap.get(parentId)!.push(segment.id);
  });

  // Build hierarchy
  const buildTree = (parentId: string | null = null, depth: number = 0) => {
    const children = childrenMap.get(parentId) || [];
    const segmentMap = new Map(props.segments.map((s) => [s.id, s]));

    children.forEach((id) => {
      const segment = segmentMap.get(id);
      if (segment) {
        const hasChildren = childrenMap.has(id) && childrenMap.get(id)!.length > 0;
        tree.push({
          ...segment,
          depth,
          hasChildren,
        });
        if (hasChildren && props.expandedIds.includes(id)) {
          buildTree(id, depth + 1);
        }
      }
    });
  };

  buildTree();
  return tree;
});
</script>
