<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 grid place-items-center p-4">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

    <!-- Modal -->
    <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 z-10 max-h-[90vh] overflow-y-auto my-4" style="transform: translateY(50%);">
      <!-- Close button -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ isLogin ? 'Вход' : 'Регистрация' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          {{ isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт' }}
        </p>
      </div>

      <!-- Error message -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Пароль
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
          />
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLogin ? 'Вход...' : 'Регистрация...' }}
          </span>
          <span v-else>
            {{ isLogin ? 'Войти' : 'Зарегистрироваться' }}
          </span>
        </button>
      </form>

      <!-- Divider -->
      <div class="my-6 flex items-center">
        <div class="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        <span class="px-3 text-gray-500 dark:text-gray-400 text-sm">или</span>
        <div class="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
      </div>

      <!-- Google login -->
      <button
        @click="handleGoogleLogin"
        :disabled="loading"
        class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
      >
        <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Войти через Google
      </button>

      <!-- Toggle mode -->
      <div class="mt-6 text-center">
        <button
          @click="toggleMode"
          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
        >
          {{ isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const { login, register, loginWithGoogle, loading, error } = useAuth()

const isLogin = ref(true)
const form = ref({
  email: '',
  password: ''
})

const closeModal = () => {
  emit('close')
  form.value = { email: '', password: '' }
  error.value = null
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = null
}

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await login(form.value.email, form.value.password)
    } else {
      await register(form.value.email, form.value.password)
    }
    closeModal()
  } catch (err) {
    // Error is handled in the composable
  }
}

const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle()
    closeModal()
  } catch (err) {
    // Error is handled in the composable
  }
}
</script>
