<template>
    <div class="home">
        <!-- Шапка с поиском -->
        <header class="header">
            <h1 class="logo">MovieFinder</h1>
            <SearchInput @search="handleSearch" />
        </header>

        <!-- Баннер (опционально) -->
        <MovieBanner v-if="featuredMovie" :movie="featuredMovie" />

        <!-- Фильтры -->
        <MovieFilters :genres="genres" @filter="applyFilters" />

        <!-- Список фильмов -->
        <div class="movie-list">
            <MovieCard
                v-for="movie in movies"
                :key="movie.id"
                :movie="movie"
                @click="goToMovie(movie.id)"
            />
        </div>

        <!-- Пагинация -->
        <Pagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="changePage"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import tmdbApi from '@/services/tmdbApi'
import SearchInput from '@/components/ui/SearchInput.vue'
import MovieCard from '@/components/MovieCard.vue'
// import MovieFilters from '@/components/MovieFilters.vue'
// import Pagination from '@/components/ui/Pagination.vue'
// import MovieBanner from '@/components/MovieBanner.vue'

const router = useRouter()
const movies = ref([])
const featuredMovie = ref(null)
const genres = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref('')

// Загрузка данных при монтировании
onMounted(async () => {
    const [trending, genresList] = await Promise.all([tmdbApi.fetchTrending(), tmdbApi.fetchGenres()])

    movies.value = trending
    genres.value = genresList
    featuredMovie.value = trending[0] // Первый фильм в трендах для баннера
})

// Поиск фильмов
const handleSearch = async (query) => {
    searchQuery.value = query
    currentPage.value = 1
    await loadMovies()
}

// Применение фильтров
const applyFilters = (filters) => {
    console.log('Фильтры:', filters) // Можно добавить логику фильтрации
}

// Пагинация
const changePage = (page) => {
    currentPage.value = page
    loadMovies()
}

// Загрузка фильмов
const loadMovies = async () => {
    const data = searchQuery.value
        ? await tmdbApi.searchMovies(searchQuery.value, currentPage.value)
        : await tmdbApi.fetchTrending()

    movies.value = data.results || data
    totalPages.value = data.total_pages || 1
}

// Переход на страницу фильма
const goToMovie = (id) => {
    router.push(`/movie/${id}`)
}
</script>

<style scoped>
.home {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.movie-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}
</style>