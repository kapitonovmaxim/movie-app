<template>
    <!-- Основной контейнер приложения -->
    <div class="app">
        <!-- Навигационное меню (опционально) -->
        <AppHeader v-if="!isFullscreenPage" />

        <!-- Роутер-вью (здесь отображаются страницы) -->
        <router-view v-slot="{ Component }">
            <!-- Анимация перехода между страницами -->
            <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>

        <!-- Футер (опционально) -->
        <AppFooter v-if="!isFullscreenPage" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const route = useRoute()

// Скрываем хедер/футер на странице 404 или деталях фильма (пример)
const isFullscreenPage = computed(() => route.meta.hideLayout || false)
</script>

<style>
@import 'tailwindcss';

/* Глобальные стили */
:root {
    font-family: 'Arial', sans-serif;
    line-height: 1.5;
    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;
}

/* Анимация переходов */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Адаптивность */
.app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}
</style>