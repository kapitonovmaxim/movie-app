<template>
    <button class="theme-toggle" @click="toggleTheme">
        <span v-if="isDark">🌙</span>
        <span v-else>☀️</span>
    </button>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'

// Используем localStorage для сохранения темы
const themeStorage = useStorage('theme', 'auto')
const isDark = ref(false)

// Функция для применения темы
const applyTheme = (isDarkMode) => {
    isDark.value = isDarkMode
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
}

// Функция переключения темы
const toggleTheme = () => {
    const newTheme = !isDark.value
    applyTheme(newTheme)
    themeStorage.value = newTheme ? 'dark' : 'light'
}

// Инициализация темы при загрузке
onMounted(() => {
    let initialTheme = false

    if (themeStorage.value === 'auto') {
        // Автоопределение по системным настройкам
        initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
        // Используем сохранённую тему
        initialTheme = themeStorage.value === 'dark'
    }

    applyTheme(initialTheme)
})

// Следим за изменением системной темы (только если выбран auto)
watch(
    () => themeStorage.value,
    (newValue) => {
        if (newValue === 'auto') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            applyTheme(systemDark)
        }
    }
)

// Также можно добавить слушатель системных изменений
onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e) => {
        if (themeStorage.value === 'auto') {
            applyTheme(e.matches)
        }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
})
</script>

<style scoped>
.theme-toggle {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 8px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
}

.theme-toggle:hover {
    background: var(--color-bg-tertiary);
    transform: translateY(-1px);
}
</style>