<template>
    <div class="movies">
        <h1 class="page-title">Фильмы</h1>

        <div class="movies-layout">
            <!-- Sidebar with filters -->
            <Sidebar>
                <MovieFilters @filter="handleFilter" />
            </Sidebar>

            <!-- Main content -->
            <div class="movies-content">
                <div class="summary" v-if="totalResults > 0">
                    Найдено: {{ totalResults.toLocaleString() }}
                </div>

                <div v-if="loading" class="loading">
                    <div class="loading-spinner"></div>
                    <p>Загрузка фильмов...</p>
                </div>

                <div v-else-if="movies.length === 0" class="no-results">
                    <p>Фильмы не найдены</p>
                    <p>Попробуйте изменить фильтры</p>
                </div>

                <div v-else class="movie-list">
                    <MediaCard
                        v-for="movie in movies"
                        :key="movie.id"
                        :media="movie"
                        :show-favorite-button="true"
                        @click="goToMovie(movie.id)"
                    />
                </div>

                <div class="pagination" v-if="totalPages > 1">
                    <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Назад</button>
                    <span>{{ currentPage }} / {{ totalPages }}</span>
                    <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Вперед</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import tmdbApi from '@/services/tmdbApi'
import MovieFilters from '@/components/MovieFilters.vue'
import MediaCard from '@/components/MediaCard.vue'
import Sidebar from '@/components/layout/Sidebar.vue'

const router = useRouter()

const movies = ref([])
const totalResults = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const currentFilters = ref({})
const loading = ref(false)

const handleFilter = async (filters) => {
    currentFilters.value = filters
    currentPage.value = 1
    await loadMovies()
}

const changePage = async (page) => {
    currentPage.value = page
    await loadMovies()
}

onMounted(() => {
    loadMovies()
})

const loadMovies = async () => {
    loading.value = true

    try {
        const params = {
            ...currentFilters.value,
            page: currentPage.value
        }
        const data = await tmdbApi.discoverMovies(params)

        movies.value = data.results || []
        totalResults.value = data.total_results || 0
        totalPages.value = data.total_pages || 1

    } catch (error) {
        console.error('Error loading movies:', error)
        movies.value = []
        totalResults.value = 0
        totalPages.value = 1
    } finally {
        loading.value = false
    }
}

const goToMovie = (id) => {
    router.push(`/movie/${id}`)
}
</script>

<style scoped>
.movies {
    padding: 20px 0;
    color: var(--color-text);
}

.page-title {
    margin-bottom: 1.5rem;
    color: var(--color-text);
    font-size: 2.5rem;
    font-weight: var(--font-weight-bold);
    font-family: var(--font-family-heading);
}

.movies-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 2rem;
    align-items: start;
}

.movies-content {
    min-height: 500px;
}

.summary {
    margin: 0 0 1.5rem 0;
    opacity: 0.8;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: var(--color-text-secondary);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-border);
    border-top: 3px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.no-results {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary);
}

.no-results p {
    margin: 0.5rem 0;
}

.movie-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.pagination {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
}

.pagination button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg-secondary);
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: var(--font-family-primary);
    font-weight: var(--font-weight-medium);
}

.pagination button:hover:not(:disabled) {
    background: var(--color-bg-tertiary);
    border-color: var(--color-border-hover);
}

.pagination button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination span {
    color: var(--color-text-secondary);
    font-weight: 500;
}

/* Mobile responsive */
@media (max-width: 768px) {
    .movies-layout {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .page-title {
        margin-bottom: 1rem;
        font-size: 2rem;
    }

    .movie-list {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }
}

@media (max-width: 480px) {
    .movies {
        padding: 10px 0;
    }

    .movie-list {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>


