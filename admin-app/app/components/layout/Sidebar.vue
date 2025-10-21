<script setup lang="ts">
interface Props {
  open?: boolean
}

withDefaults(defineProps<Props>(), {
  open: true,
})

const emit = defineEmits<{
  toggle: []
}>()

const navigationItems = [
  { label: 'Dashboard', icon: 'M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M9 9h6m-6 0H4m16 0h-5', href: '#' },
  { label: 'Organizations', icon: 'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z', href: '#' },
  { label: 'Ledgers', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', href: '#' },
  { label: 'Accounts', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4', href: '#' },
  { label: 'Transactions', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V4m0 4v8m-6-9c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M6 9V5m0 4v4', href: '#' },
  { label: 'Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', href: '#' },
  { label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', href: '#' },
]
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
      <a
        v-for="item in navigationItems"
        :key="item.label"
        :href="item.href"
        :class="`
          flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
          hover:bg-gray-800 focus:outline-none focus:bg-gray-800
          ${open ? '' : 'justify-center'}
        `"
      >
        <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
        </svg>
        <span v-if="open" class="text-sm font-medium">{{ item.label }}</span>
      </a>
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
