<template>
  <div v-if="loading" class="flex items-center justify-center min-h-screen">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
  <div v-else-if="!user" class="flex flex-col items-center justify-center min-h-screen">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Требуется авторизация
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Для доступа к этой странице необходимо войти в систему
      </p>
      <button
        @click="showAuthModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
      >
        Войти
      </button>
    </div>

    <!-- Auth Modal -->
    <AuthModal
      :is-open="showAuthModal"
      @close="showAuthModal = false"
    />
  </div>
  <slot v-else />
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import AuthModal from './AuthModal.vue'

const { user, loading } = useAuth()
const showAuthModal = ref(false)
</script>
