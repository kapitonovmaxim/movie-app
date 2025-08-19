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

        <div v-if="isLoading" class="loading-indicator">Загрузка...</div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movieStore'

const props = defineProps({
    movie: {
        type: Object,
        required: true,
        default: () => ({}),
    },
})

const router = useRouter()
const movieStore = useMovieStore()
const isLoading = ref(false)

// Вычисляемые свойства
const bannerStyle = computed(() => ({
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backdropUrl})`,
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

// Методы
const goToMovie = () => {
    router.push(`/movie/${props.movie.id}`)
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
    height: 500px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: var(--radius-lg);
    overflow: hidden;
    margin: 2rem 0;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
}

.banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.4) 100%);
}

.banner-content {
    position: relative;
    z-index: 2;
    color: white;
    padding: 2rem;
    max-width: 600px;
}

.banner-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    line-height: 1.2;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.banner-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.rating,
.year,
.genres {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-md);
    backdrop-filter: blur(10px);
}

.banner-description {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    opacity: 0.9;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.banner-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--radius-md);
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
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
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    backdrop-filter: blur(10px);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.3);
}

.btn-secondary.favorited {
    background: var(--color-primary);
}

.loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    z-index: 3;
}

/* Адаптивность */
@media (max-width: 768px) {
    .movie-banner {
        height: 400px;
    }

    .banner-title {
        font-size: 2rem;
    }

    .banner-content {
        padding: 1rem;
    }

    .banner-actions {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .movie-banner {
        height: 350px;
    }

    .banner-title {
        font-size: 1.5rem;
    }

    .banner-meta {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>