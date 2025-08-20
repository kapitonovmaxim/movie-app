<template>
    <header class="header">
        <div class="container">
            <!-- Логотип -->
            <router-link to="/" class="logo">
                <img src="@/assets/logo.svg" alt="Watchary" />
                <span>Watchary</span>
            </router-link>

            <!-- Навигация (десктоп) -->
            <nav class="nav-desktop">
                <router-link to="/">Главная</router-link>
                <router-link to="/movies">Фильмы</router-link>
                <!-- <router-link to="/favorites">Избранное</router-link> -->
                <SearchInput />
                <ThemeToggle />
            </nav>

            <!-- Бургер-меню (мобильные) -->
            <button class="burger" @click="isMobileMenuOpen = !isMobileMenuOpen">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <!-- Мобильное меню -->
            <div class="nav-mobile" :class="{ active: isMobileMenuOpen }">
                <router-link to="/" @click="closeMenu">Главная</router-link>
                <router-link to="/movies" @click="closeMenu">Фильмы</router-link>
                <!-- <router-link to="/favorites" @click="closeMenu">Избранное</router-link> -->
                <SearchInput @search="closeMenu" />
                <ThemeToggle />
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const isMobileMenuOpen = ref(false)

const closeMenu = () => {
    isMobileMenuOpen.value = false
}
</script>

<style scoped>
.header {
    background: var(--color-header-bg);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    font-size: 1.5rem;
    color: var(--color-text);
    text-decoration: none;
}

.logo img {
    height: 40px;
}

.nav-desktop {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.nav-desktop a {
    color: var(--color-text);
    text-decoration: none;
    transition: opacity 0.3s;
}

.nav-desktop a:hover {
    opacity: 0.8;
}

.nav-desktop a.router-link-active {
    color: var(--color-primary);
}

.burger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 10px;
}

.burger span {
    display: block;
    width: 25px;
    height: 3px;
    background: var(--color-text);
    margin: 5px 0;
    transition: transform 0.3s;
}

.nav-mobile {
    display: none;
    flex-direction: column;
    gap: 1rem;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--color-header-bg);
    padding: 2rem;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    transform: translateY(-150%);
    transition: transform 0.3s;
}

.nav-mobile.active {
    transform: translateY(0);
}

.nav-mobile a {
    color: var(--color-text);
    text-decoration: none;
    padding: 0.5rem 0;
}

/* Адаптивность */
@media (max-width: 768px) {
    .nav-desktop {
        display: none;
    }

    .burger {
        display: block;
    }

    .nav-mobile {
        display: flex;
    }
}
</style>