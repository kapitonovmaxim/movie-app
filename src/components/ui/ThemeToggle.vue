<template>
    <button class="theme-toggle" @click="toggleTheme">
        <span v-if="isDark">🌙</span>
        <span v-else>☀️</span>
    </button>
</template>

<script setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleTheme = useToggle(isDark)
</script>

<style scoped>
.theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 5px;
}
</style>