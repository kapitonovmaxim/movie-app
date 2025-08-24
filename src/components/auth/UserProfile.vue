<template>
  <div class="relative">
    <!-- User menu button -->
    <button
      @click="toggleMenu"
      class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
        {{ userInitials }}
      </div>
      <span class="hidden md:block">{{ user?.email }}</span>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isMenuOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isMenuOpen"
      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
    >
      <!-- User info -->
      <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user?.email }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Пользователь</p>
      </div>

      <!-- Menu items -->
      <button
        @click="handleLogout"
        :disabled="loading"
        class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        <span v-if="loading">Выход...</span>
        <span v-else>Выйти</span>
      </button>
    </div>

    <!-- Click outside to close -->
    <div
      v-if="isMenuOpen"
      class="fixed inset-0 z-40"
      @click="closeMenu"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { user, logout, loading } = useAuth()

const isMenuOpen = ref(false)

const userInitials = computed(() => {
  if (!user.value?.email) return '?'
  return user.value.email.charAt(0).toUpperCase()
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLogout = async () => {
  try {
    await logout()
    closeMenu()
  } catch (err) {
    console.error('Ошибка при выходе:', err)
  }
}
</script>
