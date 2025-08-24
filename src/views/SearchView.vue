<template>
    <div class="search-page">
        <h1>Поиск</h1>
        <div class="search-layout">
            <aside class="sidebar">
                <h3>Категории</h3>
                <div class="category" :class="{ active: activeCategory === 'all' }" @click="setCategory('all')">
                    Все результаты: ({{ totalResults }})
                </div>
                <div class="category" :class="{ active: activeCategory === 'movies' }" @click="setCategory('movies')">
                    Фильмы: ({{ movieResults.length }})
                </div>
                <div class="category" :class="{ active: activeCategory === 'tv' }" @click="setCategory('tv')">
    Сериалы: ({{ tvResults.length }})
</div>
            </aside>
            <main class="content">
                <div v-if="loading">Загрузка...</div>
                <div v-else-if="currentResults.length === 0">Результаты не найдены</div>
                <div v-else>
                    <h2>{{ getCategoryTitle() }}</h2>
                    <div class="results">
                        <!-- Для фильмов используем MediaCard -->
                        <template v-if="activeCategory === 'movies' || activeCategory === 'all'">
                            <div class="movie-results" v-if="movieResults.length > 0">
                                <h3 v-if="activeCategory === 'all'">Фильмы</h3>
                                <div class="movie-grid">
                                    <MediaCard
                                        v-for="movie in movieResults"
                                        :key="movie.id"
                                        :media="movie"
                                        @click="goToMovie(movie.id)"
                                    />
                                </div>
                            </div>
                        </template>

                        <!-- Для сериалов используем MediaCard -->
                        <template v-if="activeCategory === 'tv' || activeCategory === 'all'">
                            <div class="tv-results" v-if="tvResults.length > 0">
                                <h3 v-if="activeCategory === 'all'">Сериалы</h3>
                                <div class="tv-grid">
                                    <MediaCard
                                        v-for="tv in tvResults"
                                        :key="tv.id"
                                        :media="tv"
                                        @click="goToTV(tv.id)"
                                    />
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import tmdbApi from '@/services/tmdbApi'
import MediaCard from '@/components/MediaCard.vue'

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const loading = ref(false)
const movieResults = ref([])
const tvResults = ref([])
const totalResults = ref(0)
const activeCategory = ref('all')

const currentResults = computed(() => {
    switch (activeCategory.value) {
        case 'movies': return movieResults.value
        case 'tv': return tvResults.value
        default: return [...movieResults.value, ...tvResults.value]
    }
})

const getCategoryTitle = () => {
    switch (activeCategory.value) {
        case 'movies': return 'Фильмы'
        case 'tv': return 'Сериалы'
        default: return 'Все результаты'
    }
}

const getPosterUrl = (item) => {
    return item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : '/placeholder-poster.jpg'
}

const getYear = (item) => {
    const date = item.release_date || item.first_air_date
    return date ? new Date(date).getFullYear() : ''
}

const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + '...' : text
}

const setCategory = (category) => {
    activeCategory.value = category
}

const goToMovie = (id) => {
    router.push(`/movie/${id}`)
}

const goToTV = (id) => {
    router.push(`/tv/${id}`)
}

const goToItem = (item) => {
    if (item.media_type === 'tv') {
        router.push(`/tv/${item.id}`)
    } else {
        router.push(`/movie/${item.id}`)
    }
}

const performSearch = async () => {
    if (!searchQuery.value.trim()) return

    loading.value = true
    try {
        const [movieData, tvData] = await Promise.all([
    tmdbApi.searchMovies(searchQuery.value.trim(), 1),
    tmdbApi.searchTVShows(searchQuery.value.trim(), 1)
])

movieResults.value = movieData.results || []
tvResults.value = tvData.results || []
totalResults.value = (movieData.total_results || 0) + (tvData.total_results || 0)
    } catch (error) {
        console.error('Search error:', error)
    } finally {
        loading.value = false
    }
}

const handleHeaderSearch = (event) => {
    searchQuery.value = event.detail.query
    performSearch()
}

onMounted(() => {
    if (route.query.q) {
        searchQuery.value = route.query.q
        performSearch()
    }
    window.addEventListener('header-search', handleHeaderSearch)
})

onUnmounted(() => {
    window.removeEventListener('header-search', handleHeaderSearch)
})

watch(() => route.query.q, (newQuery) => {
    if (newQuery !== searchQuery.value) {
        searchQuery.value = newQuery || ''
        if (searchQuery.value) performSearch()
    }
})
</script>

<style scoped>
.search-page {
    padding: 20px;
    color: var(--color-text);
}

.search-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    margin-top: 2rem;
}

.sidebar {
    background: var(--color-bg-secondary);
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    height: fit-content;
}

.sidebar h3 {
    margin-bottom: 1rem;
    font-weight: var(--font-weight-semibold);
}

.category {
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 0.5rem;
    background: var(--color-bg);
}

.category:hover {
    background: var(--color-bg-tertiary);
}

.category.active {
    background: var(--color-primary);
    color: white;
}

.content {
    min-height: 500px;
}

.results {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.movie-results,
.tv-results {
    margin-bottom: 2rem;
}

.movie-results h3,
.tv-results h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
}

.movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
}

.tv-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.result {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
}

.result:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.result-poster-container {
    position: relative;
    width: 80px;
    height: 120px;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--color-bg-secondary);
    flex-shrink: 0;
}

.result-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--radius-md);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.result-poster.loaded {
    opacity: 1;
}

.result-poster.error {
    opacity: 0;
}

.result-placeholder,
.result-error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.result h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: var(--font-weight-semibold);
}

.result p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
}

@media (max-width: 768px) {
    .search-layout {
        grid-template-columns: 1fr;
    }

    .movie-grid,
.tv-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }

    .result {
        flex-direction: column;
        text-align: center;
    }

    .result-poster-container {
        width: 100%;
        height: 200px;
        margin: 0 auto;
    }
}
</style>
