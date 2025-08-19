<template>
    <div class="movie-details" v-if="movie">
        <div class="movie-backdrop" :style="backdropStyle"></div>

        <div class="movie-content">
            <!-- Основная информация -->
            <div class="movie-header">
                <img
                    :src="posterUrl"
                    :alt="movie.title"
                    class="movie-poster"
                    @error="handleImageError"
                />

                <div class="movie-info">
                    <h1 class="movie-title">{{ movie.title }}</h1>

                    <div class="movie-meta">
                        <span class="release-year">{{ releaseYear }}</span>
                        <span class="runtime">{{ formattedRuntime }}</span>
                        <span class="rating">⭐ {{ movie.vote_average?.toFixed(1) }}</span>
                        <span class="vote-count">({{ movie.vote_count }} оценок)</span>
                    </div>

                    <div class="genres">
                        <span
                            v-for="genre in movie.genres"
                            :key="genre.id"
                            class="genre-tag"
                        >{{ genre.name }}</span>
                    </div>

                    <div class="action-buttons">
                        <button
                            class="btn btn-primary"
                            @click="watchTrailer"
                            v-if="hasTrailer"
                        >▶️ Смотреть трейлер</button>

                        <button
                            class="btn btn-secondary"
                            :class="{ 'btn-active': isFavorited }"
                            @click="toggleFavorite"
                        >{{ isFavorited ? '❤️ В избранном' : '🤍 В избранное' }}</button>
                    </div>
                </div>
            </div>

            <!-- Описание -->
            <section class="movie-description">
                <h2>Описание</h2>
                <p>{{ movie.overview || 'Описание отсутствует' }}</p>
            </section>

            <!-- Актерский состав -->
            <section class="cast-section" v-if="cast.length > 0">
                <h2>Актерский состав</h2>
                <div class="cast-grid">
                    <div v-for="actor in mainCast" :key="actor.id" class="cast-card">
                        <img
                            :src="actorProfileUrl(actor)"
                            :alt="actor.name"
                            class="cast-photo"
                            @error="handleCastImageError"
                        />
                        <div class="cast-info">
                            <h4>{{ actor.name }}</h4>
                            <p>{{ actor.character }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Похожие фильмы -->
            <section class="similar-movies" v-if="similarMovies.length > 0">
                <h2>Похожие фильмы</h2>
                <div class="similar-grid">
                    <MovieCard
                        v-for="similarMovie in similarMovies.slice(0, 6)"
                        :key="similarMovie.id"
                        :movie="similarMovie"
                        @click="goToMovie(similarMovie.id)"
                    />
                </div>
            </section>

            <!-- Дополнительная информация -->
            <section class="additional-info">
                <h2>Детали</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Бюджет:</strong>
                        <span>{{ formattedBudget }}</span>
                    </div>
                    <div class="info-item">
                        <strong>Сборы:</strong>
                        <span>{{ formattedRevenue }}</span>
                    </div>
                    <div class="info-item">
                        <strong>Статус:</strong>
                        <span>{{ movie.status }}</span>
                    </div>
                    <div class="info-item">
                        <strong>Оригинальный язык:</strong>
                        <span>{{ originalLanguage }}</span>
                    </div>
                </div>
            </section>
        </div>

        <!-- Модальное окно для трейлера -->
        <Teleport to="body">
            <TrailerModal v-if="showTrailer" :video-key="trailerKey" @close="showTrailer = false" />
        </Teleport>

        <!-- Загрузка -->
        <div v-if="loading" class="loading-overlay">
            <div class="loading-spinner"></div>
            <p>Загрузка деталей фильма...</p>
        </div>
    </div>

    <div v-else-if="error" class="error-state">
        <h2>Фильм не найден</h2>
        <p>Возможно, он был удален или произошла ошибка загрузки.</p>
        <button class="btn btn-primary" @click="$router.push('/')">← На главную</button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movieStore'
import tmdbApi from '@/services/tmdbApi'
import MovieCard from '@/components/MovieCard.vue'
import TrailerModal from '@/components/TrailerModal.vue'

const route = useRoute()
const router = useRouter()
const movieStore = useMovieStore()

const movie = ref(null)
const loading = ref(true)
const error = ref(null)
const showTrailer = ref(false)

// Получаем ID фильма из параметров маршрута
const movieId = computed(() => route.params.id)

// Вычисляемые свойства
const backdropStyle = computed(() => ({
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backdropUrl})`,
}))

const backdropUrl = computed(() => {
    if (!movie.value?.backdrop_path) return '/placeholder-backdrop.jpg'
    return `https://image.tmdb.org/t/p/w1280${movie.value.backdrop_path}`
})

const posterUrl = computed(() => {
    if (!movie.value?.poster_path) return '/placeholder-poster.jpg'
    return `https://image.tmdb.org/t/p/w500${movie.value.poster_path}`
})

const releaseYear = computed(() => {
    return movie.value?.release_date?.split('-')[0] || 'Неизвестно'
})

const formattedRuntime = computed(() => {
    if (!movie.value?.runtime) return 'Неизвестно'
    const hours = Math.floor(movie.value.runtime / 60)
    const minutes = movie.value.runtime % 60
    return `${hours}ч ${minutes}мин`
})

const cast = computed(() => {
    return movie.value?.credits?.cast || []
})

const mainCast = computed(() => {
    return cast.value.slice(0, 12) // Первые 12 актеров
})

const similarMovies = computed(() => {
    return movie.value?.similar?.results || []
})

const hasTrailer = computed(() => {
    return !!trailerKey.value
})

const trailerKey = computed(() => {
    const trailer = movie.value?.videos?.results?.find((video) => video.type === 'Trailer' && video.site === 'YouTube')
    return trailer?.key || null
})

const isFavorited = computed(() => {
    return movieStore.favorites.some((fav) => fav.id === movie.value?.id)
})

const formattedBudget = computed(() => {
    if (!movie.value?.budget) return 'Неизвестно'
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'USD',
    }).format(movie.value.budget)
})

const formattedRevenue = computed(() => {
    if (!movie.value?.revenue) return 'Неизвестно'
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'USD',
    }).format(movie.value.revenue)
})

const originalLanguage = computed(() => {
    const languages = {
        en: 'Английский',
        ru: 'Русский',
        es: 'Испанский',
        fr: 'Французский',
        de: 'Немецкий',
        ja: 'Японский',
        ko: 'Корейский',
        zh: 'Китайский',
    }
    return languages[movie.value?.original_language] || movie.value?.original_language || 'Неизвестно'
})

// Методы
const loadMovieDetails = async () => {
    loading.value = true
    error.value = null

    try {
        const data = await tmdbApi.fetchMovieDetails(movieId.value)
        movie.value = data
        movieStore.setCurrentMovie(data)
    } catch (err) {
        console.error('Error loading movie details:', err)
        error.value = 'Не удалось загрузить информацию о фильме'
    } finally {
        loading.value = false
    }
}

const watchTrailer = () => {
    if (trailerKey.value) {
        showTrailer.value = true
    }
}

const toggleFavorite = () => {
    if (!movie.value) return

    if (isFavorited.value) {
        movieStore.removeFromFavorites(movie.value.id)
    } else {
        movieStore.addToFavorites(movie.value)
    }
}

const goToMovie = (id) => {
    router.push(`/movie/${id}`)
}

const actorProfileUrl = (actor) => {
    if (!actor.profile_path) return '/placeholder-avatar.jpg'
    return `https://image.tmdb.org/t/p/w200${actor.profile_path}`
}

const handleImageError = (event) => {
    event.target.src = '/placeholder-poster.jpg'
}

const handleCastImageError = (event) => {
    event.target.src = '/placeholder-avatar.jpg'
}

// Загрузка данных при монтировании и изменении ID
onMounted(() => {
    loadMovieDetails()
})

watch(movieId, (newId) => {
    if (newId) {
        loadMovieDetails()
    }
})
</script>

<style scoped>
.movie-details {
    min-height: 100vh;
    position: relative;
}

.movie-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-size: cover;
    background-position: center;
    z-index: -1;
    opacity: 0.3;
}

.movie-content {
    position: relative;
    z-index: 1;
    background: linear-gradient(transparent, var(--color-bg) 20%);
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.movie-header {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
    align-items: start;
}

.movie-poster {
    width: 100%;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
}

.movie-info {
    color: var(--color-text);
}

.movie-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    line-height: 1.2;
}

.movie-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    align-items: center;
}

.movie-meta span {
    background: var(--color-bg-secondary);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    font-weight: 500;
}

.genres {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.genre-tag {
    background: var(--color-primary);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
}

.action-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.btn {
    padding: 1rem 2rem;
    border: none;
    border-radius: var(--radius-md);
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background: var(--color-primary);
    color: white;
}

.btn-primary:hover {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
}

.btn-secondary {
    background: var(--color-bg-secondary);
    color: var(--color-text);
    border: 2px solid var(--color-border);
}

.btn-secondary:hover,
.btn-secondary.btn-active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.movie-description {
    margin-bottom: 3rem;
    max-width: 800px;
}

.movie-description h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.movie-description p {
    line-height: 1.6;
    font-size: 1.1rem;
}

.cast-section,
.similar-movies,
.additional-info {
    margin-bottom: 3rem;
}

.cast-section h2,
.similar-movies h2,
.additional-info h2 {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
}

.cast-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
}

.cast-card {
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: transform 0.3s ease;
}

.cast-card:hover {
    transform: translateY(-5px);
}

.cast-photo {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.cast-info {
    padding: 1rem;
}

.cast-info h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
}

.cast-info p {
    margin: 0;
    font-size: 0.8rem;
    color: var(--color-text-secondary);
}

.similar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.info-item {
    background: var(--color-bg-secondary);
    padding: 1rem;
    border-radius: var(--radius-md);
}

.info-item strong {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text-secondary);
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    z-index: 1000;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid transparent;
    border-top: 3px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.error-state {
    text-align: center;
    padding: 3rem;
    color: var(--color-text);
}

.error-state h2 {
    margin-bottom: 1rem;
    color: var(--color-error);
}

/* Адаптивность */
@media (max-width: 768px) {
    .movie-content {
        padding: 1rem;
    }

    .movie-header {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .movie-poster {
        max-width: 250px;
        margin: 0 auto;
    }

    .movie-title {
        font-size: 2rem;
    }

    .action-buttons {
        flex-direction: column;
    }

    .cast-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }

    .similar-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
}

@media (max-width: 480px) {
    .movie-title {
        font-size: 1.5rem;
    }

    .movie-meta {
        flex-direction: column;
        gap: 0.5rem;
    }

    .cast-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>