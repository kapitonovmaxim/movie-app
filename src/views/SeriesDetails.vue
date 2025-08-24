<template>
    <div class="series-details" v-if="series">
        <div class="series-backdrop" :style="backdropStyle"></div>

        <div class="series-content">
            <!-- Основная информация -->
            <div class="series-header">
                <div class="poster-container">
                    <img
                        :src="posterUrl"
                        :alt="series.name"
                        class="series-poster"
                        @load="posterLoaded = true"
                        @error="posterError = true"
                        :class="{ 'loaded': posterLoaded, 'error': posterError }"
                    />

                    <!-- Loading placeholder -->
                    <div v-if="!posterLoaded && !posterError" class="poster-placeholder">
                        <svg width="100%" height="100%" viewBox="0 0 300 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="300" height="450" fill="var(--color-bg-secondary)"/>
                            <rect x="0" y="0" width="300" height="450" fill="var(--color-border)" opacity="0.3"/>
                            <g transform="translate(125, 175)">
                                <rect x="0" y="0" width="50" height="50" rx="8" fill="var(--color-text-secondary)"/>
                                <rect x="8" y="8" width="34" height="34" rx="4" fill="var(--color-text-muted)"/>
                                <circle cx="25" cy="25" r="8" fill="var(--color-bg)"/>
                                <circle cx="25" cy="25" r="4" fill="var(--color-text-secondary)"/>
                            </g>
                        </svg>
                    </div>

                    <!-- Error placeholder -->
                    <div v-if="posterError" class="poster-error">
                        <svg width="100%" height="100%" viewBox="0 0 300 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="300" height="450" fill="var(--color-bg-secondary)"/>
                            <rect x="0" y="0" width="300" height="450" fill="var(--color-border)" opacity="0.3"/>
                            <g transform="translate(125, 175)">
                                <circle cx="25" cy="25" r="25" fill="var(--color-error)" opacity="0.1"/>
                                <circle cx="25" cy="25" r="20" fill="var(--color-error)" opacity="0.2"/>
                                <path d="M15 15 L35 35 M35 15 L15 35" stroke="var(--color-error)" stroke-width="2" stroke-linecap="round"/>
                            </g>
                        </svg>
                    </div>
                </div>

                <div class="series-info">
                    <h1 class="series-title">{{ series.name }}</h1>

                    <div class="series-meta">
                        <span class="air-year">{{ airYear }}</span>
                        <span class="seasons-count" v-if="series.number_of_seasons">{{ series.number_of_seasons }} сезонов</span>
                        <span class="episodes-count" v-if="series.number_of_episodes">{{ series.number_of_episodes }} эпизодов</span>
                        <span class="rating">⭐ {{ series.vote_average?.toFixed(1) }}</span>
                        <span class="vote-count">({{ series.vote_count }} оценок)</span>
                    </div>

                    <div class="genres" v-if="series.genres">
                        <span
                            v-for="genre in series.genres"
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
            <section class="series-description">
                <h2>Описание</h2>
                <p>{{ series.overview || 'Описание отсутствует' }}</p>
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

            <!-- Сезоны -->
            <section class="seasons-section" v-if="series.seasons && series.seasons.length > 0">
                <h2>Сезоны</h2>
                <div class="seasons-grid">
                    <div v-for="season in series.seasons" :key="season.id" class="season-card">
                        <img
                            :src="seasonPosterUrl(season)"
                            :alt="season.name"
                            class="season-poster"
                            @error="handleSeasonImageError"
                        />
                        <div class="season-info">
                            <h4>{{ season.name }}</h4>
                            <p v-if="season.air_date">{{ new Date(season.air_date).getFullYear() }}</p>
                            <p v-if="season.episode_count">{{ season.episode_count }} эпизодов</p>
                            <p v-if="season.overview" class="season-overview">{{ season.overview }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Похожие сериалы -->
            <section class="similar-series" v-if="similarSeries.length > 0">
                <h2>Похожие сериалы</h2>
                <div class="similar-grid">
                    <SeriesCard
                        v-for="similarShow in similarSeries.slice(0, 6)"
                        :key="similarShow.id"
                        :series="similarShow"
                        @click="goToSeries(similarShow.id)"
                    />
                </div>
            </section>

            <!-- Дополнительная информация -->
            <section class="additional-info">
                <h2>Детали</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Статус:</strong>
                        <span>{{ series.status }}</span>
                    </div>
                    <div class="info-item">
                        <strong>Оригинальный язык:</strong>
                        <span>{{ originalLanguage }}</span>
                    </div>
                    <div class="info-item" v-if="series.networks && series.networks.length > 0">
                        <strong>Сеть:</strong>
                        <span>{{ series.networks.map(network => network.name).join(', ') }}</span>
                    </div>
                    <div class="info-item" v-if="series.type">
                        <strong>Тип:</strong>
                        <span>{{ series.type }}</span>
                    </div>
                    <div class="info-item" v-if="series.original_name && series.original_name !== series.name">
                        <strong>Оригинальное название:</strong>
                        <span>{{ series.original_name }}</span>
                    </div>
                    <div class="info-item" v-if="series.first_air_date">
                        <strong>Премьера:</strong>
                        <span>{{ new Date(series.first_air_date).toLocaleDateString('ru-RU') }}</span>
                    </div>
                    <div class="info-item" v-if="series.last_air_date">
                        <strong>Последний эпизод:</strong>
                        <span>{{ new Date(series.last_air_date).toLocaleDateString('ru-RU') }}</span>
                    </div>
                    <div class="info-item" v-if="series.episode_run_time && series.episode_run_time.length > 0">
                        <strong>Длительность эпизода:</strong>
                        <span>{{ series.episode_run_time[0] }} мин</span>
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
            <p>Загрузка деталей сериала...</p>
        </div>
    </div>

    <div v-else-if="error" class="error-state">
        <h2>Сериал не найден</h2>
        <p>Возможно, он был удален или произошла ошибка загрузки.</p>
        <button class="btn btn-primary" @click="$router.push('/')">На главную</button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movieStore'
import tmdbApi from '@/services/tmdbApi'
import SeriesCard from '@/components/SeriesCard.vue'
import TrailerModal from '@/components/ui/TrailerModal.vue'

const route = useRoute()
const router = useRouter()
const movieStore = useMovieStore()

const series = ref(null)
const loading = ref(true)
const error = ref(null)
const showTrailer = ref(false)
const posterLoaded = ref(false)
const posterError = ref(false)

// Получаем ID сериала из параметров маршрута
const seriesId = computed(() => route.params.id)

// Вычисляемые свойства
const backdropStyle = computed(() => ({
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backdropUrl})`,
}))

const backdropUrl = computed(() => {
    if (!series.value?.backdrop_path) return '/placeholder-backdrop.jpg'
    return `https://image.tmdb.org/t/p/w1280${series.value.backdrop_path}`
})

const posterUrl = computed(() => {
    if (!series.value?.poster_path) return '/placeholder-poster.jpg'
    return `https://image.tmdb.org/t/p/w500${series.value.poster_path}`
})

const airYear = computed(() => {
    return series.value?.first_air_date?.split('-')[0] || 'Неизвестно'
})

const cast = computed(() => {
    return series.value?.credits?.cast || []
})

const mainCast = computed(() => {
    return cast.value.slice(0, 12) // Первые 12 актеров
})

const similarSeries = computed(() => {
    return series.value?.similar?.results || []
})

const hasTrailer = computed(() => {
    return !!trailerKey.value
})

const trailerKey = computed(() => {
    const trailer = series.value?.videos?.results?.find((video) => video.type === 'Trailer' && video.site === 'YouTube')
    return trailer?.key || null
})

const isFavorited = computed(() => {
    return movieStore.favorites.some((fav) => fav.id === series.value?.id)
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
    return languages[series.value?.original_language] || series.value?.original_language || 'Неизвестно'
})

// Методы
const loadSeriesDetails = async () => {
    loading.value = true
    error.value = null

    try {
        const data = await tmdbApi.fetchTVShowDetails(seriesId.value)
        series.value = data
        movieStore.setCurrentMovie(data)
    } catch (err) {
        console.error('Error loading series details:', err)
        error.value = 'Не удалось загрузить информацию о сериале'
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
    if (!series.value) return

    if (isFavorited.value) {
        movieStore.removeFromFavorites(series.value.id)
    } else {
        movieStore.addToFavorites(series.value)
    }
}

const goToSeries = (id) => {
    router.push(`/series/${id}`)
}

const actorProfileUrl = (actor) => {
    if (!actor.profile_path) return '/placeholder-avatar.jpg'
    return `https://image.tmdb.org/t/p/w200${actor.profile_path}`
}

const seasonPosterUrl = (season) => {
    if (!season.poster_path) return '/placeholder-poster.jpg'
    return `https://image.tmdb.org/t/p/w200${season.poster_path}`
}

const handleCastImageError = (event) => {
    event.target.src = '/placeholder-avatar.jpg'
}

const handleSeasonImageError = (event) => {
    event.target.src = '/placeholder-poster.jpg'
}

// Загрузка данных при монтировании и изменении ID
onMounted(() => {
    loadSeriesDetails()
})

watch(seriesId, (newId) => {
    if (newId) {
        loadSeriesDetails()
    }
})
</script>

<style scoped>
.series-details {
    min-height: 100vh;
    position: relative;
}

.series-backdrop {
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

.series-content {
    position: relative;
    z-index: 1;
    background: linear-gradient(transparent, var(--color-bg) 20%);
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.series-header {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
}

.poster-container {
    position: relative;
    width: 300px;
    height: 450px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--color-bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
}

.series-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease;
}

.series-poster.loaded {
    opacity: 1;
}

.series-poster.error {
    opacity: 0.5;
}

.poster-placeholder,
.poster-error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.series-info {
    color: var(--color-text);
}

.series-title {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: var(--font-weight-bold);
    font-family: var(--font-family-heading);
    color: var(--color-text);
}

.series-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    align-items: center;
}

.series-meta span {
    padding: 0.25rem 0.75rem;
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
}

.rating {
    color: var(--color-primary);
    font-weight: var(--font-weight-semibold);
}

.genres {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.genre-tag {
    padding: 0.25rem 0.75rem;
    background: var(--color-primary);
    color: white;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-weight: var(--font-weight-medium);
}

.action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--radius-md);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: var(--font-family-primary);
    font-size: 1rem;
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
    border: 1px solid var(--color-border);
}

.btn-secondary:hover {
    background: var(--color-border);
}

.btn-secondary.btn-active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
}

/* Секции */
section {
    margin-bottom: 3rem;
}

section h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
    border-bottom: 2px solid var(--color-primary);
    padding-bottom: 0.5rem;
}

.series-description p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--color-text);
}

/* Актерский состав */
.cast-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
}

.cast-card {
    background: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
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
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
}

.cast-info p {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
}

/* Сезоны */
.seasons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}

.season-card {
    background: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: transform 0.3s ease;
}

.season-card:hover {
    transform: translateY(-5px);
}

.season-poster {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.season-info {
    padding: 1rem;
}

.season-info h4 {
    margin: 0 0 0.5rem 0;
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
}

.season-info p {
    margin: 0 0 0.25rem 0;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
}

.season-overview {
    margin-top: 0.5rem !important;
    font-size: 0.8rem !important;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Похожие сериалы */
.similar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
}

/* Дополнительная информация */
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
}

.info-item {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    border-left: 4px solid var(--color-primary);
}

.info-item strong {
    color: var(--color-text);
    font-weight: var(--font-weight-semibold);
}

.info-item span {
    color: var(--color-text-secondary);
}

/* Загрузка и ошибки */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.loading-spinner {
    width: 50px;
    height: 50px;
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

.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
    color: var(--color-text);
}

.error-state h2 {
    margin-bottom: 1rem;
    color: var(--color-error);
}

.error-state p {
    margin-bottom: 2rem;
    color: var(--color-text-secondary);
}

/* Адаптивность */
@media (max-width: 768px) {
    .series-header {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .series-title {
        font-size: 2rem;
    }

    .action-buttons {
        justify-content: center;
    }

    .cast-grid,
    .seasons-grid,
    .similar-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .info-item {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>
