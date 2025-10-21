<script setup lang="ts">
const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const user = {
  name: 'Admin User',
  email: 'admin@midaz.io',
  avatar: 'A',
}
</script>

<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Left Side -->
      <div class="flex items-center gap-4">
        <button
          @click="emit('toggle-sidebar')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
        >
          <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="flex items-center gap-2">
          <h2 class="text-xl font-semibold text-gray-900">Dashboard</h2>
        </div>
      </div>

      <!-- Right Side -->
      <div class="flex items-center gap-6">
        <!-- Search -->
        <div class="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            class="bg-transparent text-sm focus:outline-none w-32"
          />
        </div>

        <!-- Notifications -->
        <button class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none">
          <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </button>

        <!-- User Menu -->
        <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
            <p class="text-xs text-gray-500">{{ user.email }}</p>
          </div>
          <button class="h-9 w-9 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors focus:outline-none flex items-center justify-center">
            {{ user.avatar }}
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
