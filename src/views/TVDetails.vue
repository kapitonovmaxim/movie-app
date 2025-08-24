<template>
    <div class="tv-details" v-if="tv">
        <div class="tv-backdrop" :style="backdropStyle"></div>

        <div class="tv-content">
            <!-- Основная информация -->
            <div class="tv-header">
                <div class="poster-container">
                    <img
                        :src="posterUrl"
                        :alt="tv.name"
                        class="tv-poster"
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

                <div class="tv-info">
                    <h1 class="tv-title">{{ tv.name }}</h1>

                    <div class="tv-meta">
                        <span class="air-year">{{ airYear }}</span>
                        <span class="seasons-count" v-if="tv.number_of_seasons">{{ tv.number_of_seasons }} сезонов</span>
                        <span class="episodes-count" v-if="tv.number_of_episodes">{{ tv.number_of_episodes }} эпизодов</span>
                        <span class="rating">⭐ {{ tv.vote_average?.toFixed(1) }}</span>
                        <span class="vote-count">({{ tv.vote_count }} оценок)</span>
                    </div>

                    <div class="genres" v-if="tv.genres">
                        <span
                            v-for="genre in tv.genres"
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
            <section class="tv-description">
                <h2>Описание</h2>
                <p>{{ tv.overview || 'Описание отсутствует' }}</p>
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
            <section class="seasons-section" v-if="tv.seasons && tv.seasons.length > 0">
                <h2>Сезоны</h2>
                <div class="seasons-grid">
                    <div v-for="season in tv.seasons" :key="season.id" class="season-card">
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
                        </div>
                    </div>
                </div>
            </section>

            <!-- Похожие сериалы -->
            <section class="similar-tv" v-if="similarTV.length > 0">
                <h2>Похожие сериалы</h2>
                <div class="similar-grid">
                    <MediaCard
                        v-for="similarShow in similarTV.slice(0, 6)"
                        :key="similarShow.id"
                        :media="similarShow"
                        @click="goToTV(similarShow.id)"
                    />
                </div>
            </section>

            <!-- Дополнительная информация -->
            <section class="additional-info">
                <h2>Детали</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Статус:</strong>
                        <span>{{ tv.status }}</span>
                    </div>
                    <div class="info-item" v-if="tv.networks && tv.networks.length > 0">
                        <strong>Сеть:</strong>
                        <span>{{ tv.networks.map(network => network.name).join(', ') }}</span>
                    </div>
                    <div class="info-item" v-if="tv.type">
                        <strong>Тип:</strong>
                        <span>{{ tv.type }}</span>
                    </div>
                    <div class="info-item" v-if="tv.original_name && tv.original_name !== tv.name">
                        <strong>Оригинальное название:</strong>
                        <span>{{ tv.original_name }}</span>
                    </div>
                    <div class="info-item" v-if="tv.first_air_date">
                        <strong>Премьера:</strong>
                        <span>{{ new Date(tv.first_air_date).toLocaleDateString('ru-RU') }}</span>
                    </div>
                    <div class="info-item" v-if="tv.last_air_date">
                        <strong>Последний эпизод:</strong>
                        <span>{{ new Date(tv.last_air_date).toLocaleDateString('ru-RU') }}</span>
                    </div>
                    <div class="info-item" v-if="tv.episode_run_time && tv.episode_run_time.length > 0">
                        <strong>Длительность эпизода:</strong>
                        <span>{{ tv.episode_run_time[0] }} мин</span>
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
import { useMediaStore } from '@/stores/mediaStore'
import tmdbApi from '@/services/tmdbApi'
import MediaCard from '@/components/MediaCard.vue'
import TrailerModal from '@/components/ui/TrailerModal.vue'

const route = useRoute()
const router = useRouter()
const mediaStore = useMediaStore()

const tv = ref(null)
const loading = ref(true)
const error = ref(null)
const showTrailer = ref(false)
const posterLoaded = ref(false)
const posterError = ref(false)

// Получаем ID сериала из параметров маршрута
const tvId = computed(() => route.params.id)

// Вычисляемые свойства
const backdropStyle = computed(() => ({
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backdropUrl})`,
}))

const backdropUrl = computed(() => {
    if (!tv.value?.backdrop_path) return '/placeholder-backdrop.jpg'
    return `https://image.tmdb.org/t/p/w1280${tv.value.backdrop_path}`
})

const posterUrl = computed(() => {
    if (!tv.value?.poster_path) return '/placeholder-poster.jpg'
    return `https://image.tmdb.org/t/p/w500${tv.value.poster_path}`
})

const airYear = computed(() => {
    return tv.value?.first_air_date?.split('-')[0] || 'Неизвестно'
})

const cast = computed(() => {
    return tv.value?.credits?.cast || []
})

const mainCast = computed(() => {
    return cast.value.slice(0, 12) // Первые 12 актеров
})

const similarTV = computed(() => {
    return tv.value?.similar?.results || []
})

const hasTrailer = computed(() => {
    return !!trailerKey.value
})

const trailerKey = computed(() => {
    const trailer = tv.value?.videos?.results?.find((video) => video.type === 'Trailer' && video.site === 'YouTube')
    return trailer?.key || null
})

const isFavorited = computed(() => {
    return mediaStore.favorites.some((fav) => fav.id === tv.value?.id)
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
    return languages[tv.value?.original_language] || tv.value?.original_language || 'Неизвестно'
})

// Методы
const loadTVDetails = async () => {
    loading.value = true
    error.value = null

    try {
        const data = await tmdbApi.fetchTVShowDetails(tvId.value)
        tv.value = data
        mediaStore.setCurrentMedia(data)
    } catch (err) {
        console.error('Error loading TV details:', err)
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
    if (!tv.value) return

    if (isFavorited.value) {
        mediaStore.removeFromFavorites(tv.value.id)
    } else {
        mediaStore.addToFavorites(tv.value)
    }
}

const goToTV = (id) => {
    router.push(`/tv/${id}`)
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
    loadTVDetails()
})

watch(tvId, (newId) => {
    if (newId) {
        loadTVDetails()
    }
})
</script>

<style scoped>
.tv-details {
    min-height: 100vh;
    position: relative;
}

.tv-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -1;
    filter: blur(8px);
    opacity: 0.3;
}

.tv-content {
    position: relative;
    z-index: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.tv-header {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
    align-items: start;
}

.poster-container {
    position: relative;
    width: 300px;
    height: 450px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.tv-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.tv-poster.loaded {
    opacity: 1;
}

.tv-poster.error {
    opacity: 0;
}

.poster-placeholder,
.poster-error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.tv-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.tv-title {
    font-size: 3rem;
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
    margin: 0;
    line-height: 1.2;
    font-family: var(--font-family-heading);
}

.tv-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    color: var(--color-text-secondary);
    font-size: 1rem;
}

.tv-meta span {
    padding: 0.25rem 0.75rem;
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    font-weight: var(--font-weight-medium);
}

.genres {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.genre-tag {
    padding: 0.5rem 1rem;
    background: var(--color-primary);
    color: white;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-weight: var(--font-weight-medium);
}

.action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: var(--font-weight-semibold);
    transition: all 0.2s ease;
    font-family: var(--font-family-primary);
    font-size: 1rem;
}

.btn-primary {
    background: var(--color-primary);
    color: white;
}

.btn-primary:hover {
    background: var(--color-primary-hover);
    transform: translateY(-1px);
}

.btn-secondary {
    background: var(--color-bg);
    color: var(--color-text);
    border: 1px solid var(--color-border);
}

.btn-secondary:hover {
    background: var(--color-bg-tertiary);
}

.btn-active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

section {
    margin-bottom: 3rem;
}

section h2 {
    font-size: 1.8rem;
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
    margin-bottom: 1.5rem;
    font-family: var(--font-family-heading);
}

.tv-description p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--color-text);
    margin: 0;
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

.seasons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
}

.season-card {
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: all 0.2s ease;
}

.season-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.season-poster {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.season-info {
    padding: 1rem;
}

.season-info h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
}

.season-info p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
}

.similar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
}

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
}

.info-item strong {
    color: var(--color-text);
    font-weight: var(--font-weight-semibold);
}

.info-item span {
    color: var(--color-text-secondary);
}

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
    border: 4px solid var(--color-border);
    border-top: 4px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--color-text);
}

.error-state h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--color-error);
}

.error-state p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    color: var(--color-text-secondary);
}

/* Mobile responsive */
@media (max-width: 768px) {
    .tv-header {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .poster-container {
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
    }

    .tv-title {
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

    .info-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .tv-content {
        padding: 1rem;
    }

    .tv-title {
        font-size: 1.8rem;
    }

    .tv-meta {
        flex-direction: column;
        align-items: flex-start;
    }

    .cast-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .similar-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
