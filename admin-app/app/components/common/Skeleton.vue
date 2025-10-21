<script setup lang="ts" generic="T extends 'line' | 'box' | 'table-row' | 'avatar'">
defineProps<{
  type?: T
  count?: number
  animated?: boolean
}>()

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
    />
  </div>

  <div v-else-if="type === 'box'" class="space-y-4">
    <div
      v-for="i in count"
      :key="i"
      :class="[
        'h-32 bg-gray-200 rounded-lg',
        animated ? 'animate-pulse' : '',
      ]"
    />
  </div>

  <div v-else-if="type === 'table-row'" class="space-y-3">
    <div
      v-for="i in count"
      :key="i"
      class="flex gap-4 p-4 bg-gray-50 rounded-lg"
    >
      <div
        :class="[
          'h-4 bg-gray-200 rounded flex-1',
          animated ? 'animate-pulse' : '',
        ]"
      />
      <div
        :class="[
          'h-4 bg-gray-200 rounded flex-1',
          animated ? 'animate-pulse' : '',
        ]"
      />
      <div
        :class="[
          'h-4 bg-gray-200 rounded flex-1',
          animated ? 'animate-pulse' : '',
        ]"
      />
    </div>
  </div>

  <div v-else-if="type === 'avatar'" class="flex gap-4">
    <div
      v-for="i in count"
      :key="i"
      class="flex items-center gap-3"
    >
      <div
        :class="[
          'w-12 h-12 bg-gray-200 rounded-full',
          animated ? 'animate-pulse' : '',
        ]"
      />
      <div class="space-y-2 flex-1">
        <div
          :class="[
            'h-4 bg-gray-200 rounded w-24',
            animated ? 'animate-pulse' : '',
          ]"
        />
        <div
          :class="[
            'h-3 bg-gray-200 rounded w-32',
            animated ? 'animate-pulse' : '',
          ]"
        />
      </div>
    </div>
  </div>
</template>
