<template>
    <div class="app">
        <AppHeader v-if="!isFullscreenPage" />

        <router-view v-slot="{ Component, route }">
            <transition name="fade" mode="out-in">
                <ProtectedRoute v-if="route.meta.requiresAuth">
                    <component :is="Component" />
                </ProtectedRoute>
                <component v-else :is="Component" />
            </transition>
        </router-view>

        <AppFooter v-if="!isFullscreenPage" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ProtectedRoute from '@/components/auth/ProtectedRoute.vue'

const route = useRoute()

const isFullscreenPage = computed(() => route.meta.hideLayout || false)
</script>

<style>
@import 'tailwindcss';
@import '@/assets/styles/var.css';

:root {
    font-family: var(--font-family-primary);
    line-height: 1.6;
    color-scheme: light dark;
    color: var(--color-text);
    background-color: var(--color-bg);
    font-weight: var(--font-weight-normal);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 0;
    background-color: var(--color-bg);
    color: var(--color-text);
    transition: background-color 0.3s ease, color 0.3s ease;
    font-family: var(--font-family-primary);
    font-weight: var(--font-weight-normal);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-family-heading);
    font-weight: var(--font-weight-semibold);
    line-height: 1.2;
    margin: 0;
}

h1 {
    font-size: 2.5rem;
    font-weight: var(--font-weight-bold);
}

h2 {
    font-size: 2rem;
    font-weight: var(--font-weight-semibold);
}

h3 {
    font-size: 1.5rem;
    font-weight: var(--font-weight-medium);
}

h4 {
    font-size: 1.25rem;
    font-weight: var(--font-weight-medium);
}

p {
    margin: 0 0 1rem 0;
    line-height: 1.6;
}

/* Button typography */
button {
    font-family: var(--font-family-primary);
    font-weight: var(--font-weight-medium);
}

/* Input typography */
input, select, textarea {
    font-family: var(--font-family-primary);
    font-weight: var(--font-weight-normal);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    max-width: 1560px;
    margin: 0 auto;
    padding: 0 20px;
    background-color: var(--color-bg);
    color: var(--color-text);
}
</style>