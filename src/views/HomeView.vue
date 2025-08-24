<template>
    <div class="home">

        <MovieBanner v-if="featuredMovie" :movie="featuredMovie" :loading="bannerLoading" />

        <!-- Секция с трендовыми фильмами -->
        <section v-if="!bannerLoading" class="trending-section">
            <h2>Сейчас в тренде</h2>
            <div class="movie-grid">
                <MediaCard
                    v-for="movie in trendingMovies"
                    :key="movie.id"
                    :media="movie"
                    @click="goToMovie(movie.id)"
                    :show-favorite-button="true"
                />
            </div>
        </section>

        <div v-if="bannerLoading" class="loading">Загрузка баннера...</div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import tmdbApi from '@/services/tmdbApi'
import MediaCard from '@/components/MediaCard.vue'
// import Pagination from '@/components/ui/Pagination.vue'
import MovieBanner from '@/components/MovieBanner.vue'

const router = useRouter()
const featuredMovie = ref(null)

const trendingMovies = ref([])
const bannerLoading = ref(false)


// Загрузка данных при монтировании
onMounted(async () => {
    try {
        bannerLoading.value = true

        // Загружаем трендовые фильмы
        const trending = await tmdbApi.fetchTrending()
        trendingMovies.value = trending

        // Берем первый фильм для баннера и загружаем детали
        if (trending.length > 0) {
            const movieId = trending[0].id
            featuredMovie.value = await tmdbApi.fetchMovieDetails(movieId)
        }
    } catch (error) {
        console.error('Error loading home page data:', error)
    } finally {
        bannerLoading.value = false
    }
})

// С главной удалены поиск/фильтры/пагинация. Остается баннер и блок трендов.

// Переход на страницу фильма
const goToMovie = (id) => {
    router.push(`/movie/${id}`)
}
</script>

<style scoped>
.home {
    padding: 20px;
    color: var(--color-text);
}

.trending-section {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.trending-section h2 {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    color: var(--color-text);
}

.movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
}

.loading {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
    color: var(--color-text);
}
</style>