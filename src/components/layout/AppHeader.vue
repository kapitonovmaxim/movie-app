<template>
    <header class="header">
        <div class="container1">
            <!-- Логотип -->
            <router-link to="/" class="logo">
                <img src="@/assets/logo.svg" alt="Watchary" />
                <span>Watchary</span>
            </router-link>

            <!-- Навигация (десктоп) -->
            <nav class="nav-desktop">
                <router-link to="/">Главная</router-link>
                <router-link to="/movies">Фильмы</router-link>
                <router-link to="/tv">Сериалы</router-link>
                <router-link to="/favorites" class="favorites-link">
                    Избранное
                    <span v-if="favoritesCount > 0" class="favorites-count">{{ favoritesCount }}</span>
                </router-link>
                <SearchInput
                    v-model="searchQuery"
                    @search="handleSearch"
                    @clear="handleClearSearch"
                />
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
                <router-link to="/tv" @click="closeMenu">Сериалы</router-link>
                <router-link to="/favorites" @click="closeMenu" class="favorites-link">
                    Избранное
                    <span v-if="favoritesCount > 0" class="favorites-count">{{ favoritesCount }}</span>
                </router-link>
                <SearchInput
                    v-model="searchQuery"
                    @search="handleSearch"
                    @clear="handleClearSearch"
                />
                <ThemeToggle />
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMediaStore } from '@/stores/mediaStore'
import SearchInput from '@/components/ui/SearchInput.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const route = useRoute()
const router = useRouter()
const mediaStore = useMediaStore()
const isMobileMenuOpen = ref(false)
const searchQuery = ref('')

const favoritesCount = computed(() => mediaStore.favoritesCount)

// Обработка поиска
const handleSearch = (query) => {
    if (query.trim()) {
        // Если мы на странице поиска, передаем поисковый запрос
        if (route.name === 'search') {
            // Эмитим событие для родительского компонента
            window.dispatchEvent(new CustomEvent('header-search', {
                detail: { query: query.trim() }
            }))
        } else {
            // Если не на странице поиска, переходим на страницу поиска с поисковым запросом
            router.push({
                name: 'search',
                query: { q: query.trim() }
            })
        }
    }
}

const handleClearSearch = () => {
    searchQuery.value = ''
    if (route.name === 'search') {
        window.dispatchEvent(new CustomEvent('header-search', {
            detail: { query: '' }
        }))
    }
}

const closeMenu = () => {
    isMobileMenuOpen.value = false
}

// Синхронизация с URL параметрами
watch(() => route.query.q, (newSearch) => {
    if (newSearch !== searchQuery.value) {
        searchQuery.value = newSearch || ''
    }
}, { immediate: true })
</script>

<style scoped>
.header {
    background: var(--color-header-bg);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
    /* box-shadow: var(--shadow-sm); */
    backdrop-filter: blur(10px);
}

.container1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* max-width: 1200px; */
    margin: 0 auto;
    /* padding: 0 20px; */
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: var(--font-weight-bold);
    font-size: 1.5rem;
    color: var(--color-text);
    text-decoration: none;
    font-family: var(--font-family-heading);
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
    font-weight: var(--font-weight-medium);
    font-size: 0.95rem;
}

.nav-desktop a:hover {
    opacity: 0.8;
}

.nav-desktop a.router-link-active {
    color: var(--color-primary);
    font-weight: var(--font-weight-semibold);
}

.favorites-link {
    position: relative;
}

.favorites-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: var(--color-primary);
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: var(--font-weight-bold);
    min-width: 18px;
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
    box-shadow: var(--shadow-md);
    transform: translateY(-150%);
    transition: transform 0.3s;
    backdrop-filter: blur(10px);
}

.nav-mobile.active {
    transform: translateY(0);
}

.nav-mobile a {
    color: var(--color-text);
    text-decoration: none;
    padding: 0.5rem 0;
    font-weight: var(--font-weight-medium);
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