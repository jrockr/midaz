<script setup lang="ts" generic="T extends 'line' | 'box' | 'table-row' | 'avatar'">
withDefaults(
  defineProps<{
    type?: T
    count?: number
    animated?: boolean
  }>(),
  {
    type: 'line',
    count: 1,
    animated: true,
  }
)
</script>

<template>
  <div v-if="type === 'line'" class="space-y-2">
    <div
      v-for="i in count"
      :key="i"
      :class="[
        'h-4 bg-gray-200 rounded',
        animated ? 'animate-pulse' : '',
      ]"
    ></div>
  </div>

  <div v-else-if="type === 'box'" class="space-y-3">
    <div
      v-for="i in count"
      :key="i"
      :class="[
        'h-12 bg-gray-200 rounded-lg',
        animated ? 'animate-pulse' : '',
      ]"
    ></div>
  </div>

  <div v-else-if="type === 'table-row'" class="space-y-2">
    <div
      v-for="i in count"
      :key="i"
      class="flex gap-4 items-center"
    >
      <div
        :class="[
          'h-4 bg-gray-200 rounded flex-1',
          animated ? 'animate-pulse' : '',
        ]"
      ></div>
      <div
        :class="[
          'h-4 bg-gray-200 rounded flex-1',
          animated ? 'animate-pulse' : '',
        ]"
      ></div>
      <div
        :class="[
          'h-4 bg-gray-200 rounded flex-1',
          animated ? 'animate-pulse' : '',
        ]"
      ></div>
    </div>
  </div>

  <div v-else-if="type === 'avatar'" class="flex gap-2">
    <div
      v-for="i in count"
      :key="i"
      :class="[
        'w-10 h-10 bg-gray-200 rounded-full',
        animated ? 'animate-pulse' : '',
      ]"
    ></div>
  </div>
</template>
