<template>
    <div class="movie-banner" :style="bannerStyle">
        <div class="banner-overlay"></div>

        <div class="banner-content">
            <h1 class="banner-title">{{ movie.title }}</h1>

            <div class="banner-meta">
                <span class="rating">⭐ {{ movie.vote_average?.toFixed(1) }}</span>
                <span class="year">{{ releaseYear }}</span>
                <span class="genres">{{ genresList }}</span>
            </div>

            <p class="banner-description" :title="movie.overview">{{ truncatedOverview }}</p>

            <div class="banner-actions">
                <button class="btn btn-primary" @click="goToMovie">
                    <span>Смотреть подробнее</span>
                </button>

                <button
                    v-if="hasTrailer"
                    class="btn btn-secondary"
                    @click="watchTrailer"
                >
                    <span>▶️ Смотреть трейлер</span>
                </button>

                <button
                    class="btn btn-secondary"
                    @click="toggleFavorite"
                    :class="{ favorited: isFavorited }"
                >
                    <span v-if="isFavorited">❤️</span>
                    <span v-else>🤍</span>
                    {{ isFavorited ? 'В избранном' : 'В избранное' }}
                </button>
            </div>
        </div>

        <div v-if="loading || isLoading" class="loading-indicator">Загрузка...</div>

        <!-- Hidden image for backdrop preloading -->
        <img
            :src="backdropUrl"
            @load="backdropLoaded = true"
            @error="backdropError = true"
            style="display: none;"
            alt=""
        />
    </div>

    <!-- Trailer Modal -->
    <Teleport to="body">
        <TrailerModal v-if="showTrailer" :video-key="trailerKey" @close="showTrailer = false" />
    </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movieStore'
import TrailerModal from '@/components/ui/TrailerModal.vue'

const props = defineProps({
    movie: {
        type: Object,
        required: true,
        default: () => ({}),
    },
    loading: {
        type: Boolean,
        default: false,
    },
})

const router = useRouter()
const movieStore = useMovieStore()
const isLoading = ref(false)
const showTrailer = ref(false)
const backdropLoaded = ref(false)
const backdropError = ref(false)

// Вычисляемые свойства
const bannerStyle = computed(() => ({
    backgroundImage: backdropLoaded.value && !backdropError.value
        ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backdropUrl.value})`
        : 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))',
}))

const backdropUrl = computed(() => {
    if (!props.movie.backdrop_path) return '/placeholder-backdrop.jpg'
    return `https://image.tmdb.org/t/p/w1280${props.movie.backdrop_path}`
})

const releaseYear = computed(() => {
    return props.movie.release_date?.split('-')[0] || 'Неизвестно'
})

const genresList = computed(() => {
    if (!props.movie.genres) return 'Жанры не указаны'
    return props.movie.genres
        .slice(0, 3)
        .map((genre) => genre.name)
        .join(', ')
})

const truncatedOverview = computed(() => {
    const overview = props.movie.overview || 'Описание отсутствует'
    return overview.length > 150 ? overview.substring(0, 150) + '...' : overview
})

const isFavorited = computed(() => {
    return movieStore.favorites.some((fav) => fav.id === props.movie.id)
})

const hasTrailer = computed(() => {
    return !!trailerKey.value
})

const trailerKey = computed(() => {
    const trailer = props.movie.videos?.results?.find((video) => video.type === 'Trailer' && video.site === 'YouTube')
    return trailer?.key || null
})

// Методы
const goToMovie = () => {
    router.push(`/movie/${props.movie.id}`)
}

const watchTrailer = () => {
    if (trailerKey.value) {
        showTrailer.value = true
    }
}

const toggleFavorite = async () => {
    isLoading.value = true
    try {
        if (isFavorited.value) {
            await movieStore.removeFromFavorites(props.movie.id)
        } else {
            await movieStore.addToFavorites(props.movie)
        }
    } catch (error) {
        console.error('Ошибка при работе с избранным:', error)
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.movie-banner {
    position: relative;
    height: 70vh;
    min-height: 500px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    overflow: hidden;
}

.banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.8) 0%,
        rgba(0, 0, 0, 0.6) 50%,
        rgba(0, 0, 0, 0.3) 100%
    );
}

.banner-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    padding: 2rem;
    text-align: center;
}

.banner-title {
    font-size: 3.5rem;
    font-weight: var(--font-weight-bold);
    margin-bottom: 1rem;
    line-height: 1.2;
    font-family: var(--font-family-heading);
}

.banner-meta {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.banner-meta span {
    font-size: 0.9rem;
    font-weight: var(--font-weight-medium);
    opacity: 0.9;
}

.banner-description {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    opacity: 0.9;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.banner-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn {
    padding: 1rem 2rem;
    border: none;
    border-radius: var(--radius-md);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
    font-family: var(--font-family-primary);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary {
    background: var(--color-primary);
    color: white;
}

.btn-primary:hover {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3);
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}

.btn-secondary.favorited {
    background: var(--color-primary);
    border-color: var(--color-primary);
}

.loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.2rem;
    font-weight: var(--font-weight-medium);
    z-index: 3;
}

/* Адаптивность */
@media (max-width: 768px) {
    .banner-title {
        font-size: 2.5rem;
    }

    .banner-meta {
        gap: 1rem;
    }

    .banner-description {
        font-size: 1rem;
    }

    .banner-actions {
        flex-direction: column;
        align-items: center;
    }

    .btn {
        width: 100%;
        max-width: 300px;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .banner-title {
        font-size: 2rem;
    }

    .banner-content {
        padding: 1rem;
    }

    .banner-meta {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>