<template>
    <div class="movies">
        <h1 class="page-title">Фильмы</h1>

        <MovieFilters @filter="handleFilter" />

        <div class="summary" v-if="totalResults > 0">
            Найдено: {{ totalResults.toLocaleString() }}
        </div>

        <div class="movie-list">
            <MovieCard
                v-for="movie in movies"
                :key="movie.id"
                :movie="movie"
                @click="goToMovie(movie.id)"
            />
        </div>

        <!-- Пагинация (простая навигация) -->
        <div class="pagination" v-if="totalPages > 1">
            <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Назад</button>
            <span>{{ currentPage }} / {{ totalPages }}</span>
            <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Вперед</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import tmdbApi from '@/services/tmdbApi'
import MovieFilters from '@/components/MovieFilters.vue'
import MovieCard from '@/components/MovieCard.vue'

const router = useRouter()

const movies = ref([])
const totalResults = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const currentFilters = ref({})

const handleFilter = async (filters) => {
    currentFilters.value = filters
    currentPage.value = 1
    await loadMovies()
}

const changePage = async (page) => {
    currentPage.value = page
    await loadMovies()
}

const loadMovies = async () => {
    try {
        const params = {
            ...currentFilters.value,
            page: currentPage.value
        }
        const data = await tmdbApi.discoverMovies(params)
        movies.value = data.results
        totalResults.value = data.total_results
        totalPages.value = data.total_pages
    } catch (error) {
        console.error('Error loading movies:', error)
    }
}
</script>

<style scoped>
.movies {
    padding: 20px 0;
}

.page-title {
    margin-bottom: 1rem;
}

.summary {
    margin: 0.5rem 0 1rem;
    opacity: 0.8;
}

.movie-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.pagination {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
}

.pagination button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>


