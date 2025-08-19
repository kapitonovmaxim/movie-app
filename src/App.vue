<template>
    <div class="app">
        <AppHeader v-if="!isFullscreenPage" />

        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component" />
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

const route = useRoute()

const isFullscreenPage = computed(() => route.meta.hideLayout || false)
</script>

<style>
@import 'tailwindcss';
@import '@/assets/styles/var.css';

:root {
    font-family: 'Arial', sans-serif;
    line-height: 1.5;
    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}
</style>