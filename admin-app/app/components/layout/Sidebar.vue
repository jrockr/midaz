<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  open?: boolean
}

withDefaults(defineProps<Props>(), {
  open: true,
})

const emit = defineEmits<{
  toggle: []
}>()

const router = useRouter()

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M9 9h6m-6 0H4m16 0h-5' },
  // Onboarding Section
  { label: 'Onboarding', isSection: true },
  { label: 'Organizations', path: '/organizations', icon: 'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z' },
  { label: 'Ledgers', path: '/ledgers', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Assets', path: '/assets', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V4m0 4v8' },
  { label: 'Accounts', path: '/accounts', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
  { label: 'Portfolios', path: '/onboarding/portfolios', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9' },
  { label: 'Segments', path: '/onboarding/segments', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
  // Operations Section
  { label: 'Operations', isSection: true },
  { label: 'Operation Routes', path: '/operations/routes', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  // Transactions Section
  { label: 'Transactions', isSection: true },
  { label: 'Transaction Routes', path: '/transactions/routes', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V4m0 4v8' },
  { label: 'Balances', path: '/balances', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8' },
  { label: 'Asset Rates', path: '/asset-rates', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
]

const isActive = (path: string) => {
  return router.currentRoute.value.path === path || router.currentRoute.value.path.startsWith(path + '/')
}

const navigate = (path: string) => {
  router.push(path)
}
</script>

<template>
  <aside
    :class="`
      ${open ? 'w-64' : 'w-20'}
      bg-gray-900 text-white transition-all duration-300 overflow-y-auto flex flex-col
    `"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-800">
      <h1 v-if="open" class="text-xl font-bold">Midaz</h1>
      <button
        @click="emit('toggle')"
        class="p-2 hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2">
      <template v-for="item in navigationItems" :key="item.label">
        <!-- Section Header -->
        <div
          v-if="item.isSection"
          :class="`
            px-4 py-3 text-xs font-semibold uppercase tracking-wider
            ${open ? 'text-gray-400 mt-4' : 'hidden'}
          `"
        >
          {{ item.label }}
        </div>
        <!-- Menu Item -->
        <button
          v-else
          @click="navigate(item.path)"
          :class="`
            w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
            ${isActive(item.path)
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-800 text-gray-300'
            }
            ${open ? '' : 'justify-center'}
          `"
        >
          <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
          </svg>
          <span v-if="open" class="text-sm font-medium">{{ item.label }}</span>
        </button>
      </template>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-800">
      <button
        :class="`
          flex items-center gap-3 w-full px-4 py-3 rounded-lg
          hover:bg-gray-800 transition-colors focus:outline-none
          ${open ? '' : 'justify-center'}
        `"
      >
        <svg class="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
            clip-rule="evenodd"
          />
        </svg>
        <span v-if="open" class="text-sm font-medium">Support</span>
      </button>
    </div>
  </aside>
</template>
