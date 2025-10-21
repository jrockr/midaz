<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface BreadcrumbItem {
  label: string
  path?: string
  active: boolean
}

const breadcrumbs = computed((): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [
    {
      label: 'Home',
      path: '/dashboard',
      active: false,
    },
  ]

  // Parse route path for breadcrumbs
  const pathSegments = route.path.split('/').filter(Boolean)
  let currentPath = ''

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1

    // Format label (e.g., 'organizations' -> 'Organizations')
    let label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    // Handle IDs - show as "Detail" instead
    if (segment.match(/^[a-f0-9]{8,}$/i)) {
      label = 'Detail'
    }

    items.push({
      label,
      path: isLast ? undefined : currentPath,
      active: isLast,
    })
  })

  return items
})

const navigate = (path?: string) => {
  if (path) {
    router.push(path)
  }
}
</script>

<template>
  <nav class="flex items-center space-x-2 text-sm text-gray-600" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <li v-for="(item, index) in breadcrumbs" :key="index" class="flex items-center">
        <button
          v-if="item.path"
          @click="navigate(item.path)"
          class="text-blue-600 hover:text-blue-900 hover:underline transition-colors"
        >
          {{ item.label }}
        </button>
        <span v-else :class="['font-medium', item.active ? 'text-gray-900' : 'text-gray-600']">
          {{ item.label }}
        </span>

        <span v-if="index < breadcrumbs.length - 1" class="mx-2 text-gray-400">/</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
nav {
  user-select: none;
}
</style>
