import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useMediaStore } from './stores/mediaStore'

import App from './App.vue'

const pinia = createPinia()
import router from './router'

// Initialize theme before app creation
const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'auto'
    const isDark = savedTheme === 'dark' ||
                   (savedTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

// Initialize theme
initializeTheme()

const app = createApp(App)
app.use(router)
app.use(pinia)

// Инициализируем избранное после создания приложения
const mediaStore = useMediaStore()
mediaStore.initFavorites()

app.mount('#app')