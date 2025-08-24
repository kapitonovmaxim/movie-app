<template>
    <div class="media-card" @click="handleCardClick">
        <div class="poster-container">
            <img
                :src="posterUrl"
                :alt="mediaTitle"
                class="poster"
                @load="imageLoaded = true"
                @error="imageError = true"
                :class="{ 'loaded': imageLoaded, 'error': imageError }"
            />

            <!-- Loading placeholder -->
            <div v-if="!imageLoaded && !imageError" class="placeholder">
                <svg width="100%" height="100%" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="300" fill="var(--color-bg-secondary)"/>
                    <rect x="0" y="0" width="200" height="300" fill="var(--color-border)" opacity="0.3"/>
                    <g transform="translate(75, 125)">
                        <rect x="0" y="0" width="50" height="50" rx="8" fill="var(--color-text-secondary)"/>
                        <rect x="8" y="8" width="34" height="34" rx="4" fill="var(--color-text-muted)"/>
                        <circle cx="25" cy="25" r="8" fill="var(--color-bg)"/>
                        <circle cx="25" cy="25" r="4" fill="var(--color-text-secondary)"/>
                    </g>
                </svg>
            </div>

            <!-- Error placeholder -->
            <div v-if="imageError" class="error-placeholder">
                <svg width="100%" height="100%" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="300" fill="var(--color-bg-secondary)"/>
                    <rect x="0" y="0" width="200" height="300" fill="var(--color-border)" opacity="0.3"/>
                    <g transform="translate(75, 125)">
                        <circle cx="25" cy="25" r="25" fill="var(--color-error)" opacity="0.1"/>
                        <circle cx="25" cy="25" r="20" fill="var(--color-error)" opacity="0.2"/>
                        <path d="M15 15 L35 35 M35 15 L15 35" stroke="var(--color-error)" stroke-width="2" stroke-linecap="round"/>
                    </g>
                </svg>
            </div>

            <!-- Favorite button -->
            <button
                v-if="showFavoriteButton"
                class="favorite-btn"
                @click.stop="toggleFavorite"
                :class="{ 'favorited': isInFavorites }"
                :title="isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          :fill="isInFavorites ? 'var(--color-primary)' : 'none'"
                          stroke="var(--color-primary)"
                          stroke-width="2"/>
                </svg>
            </button>

            <!-- Remove button -->
            <button
                v-if="showRemoveButton"
                class="remove-btn"
                @click.stop="removeFromFavorites"
                title="Удалить из избранного"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="var(--color-error)" opacity="0.9"/>
                    <path d="M8 8 L16 16 M16 8 L8 16" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>

        <div class="details">
            <h3>{{ mediaTitle }}</h3>
            <p class="year">{{ releaseYear }}</p>
            <p class="rating">⭐ {{ media.vote_average?.toFixed(1) }}</p>
            <p v-if="isTV && tvInfo" class="episodes">
    {{ tvInfo }}
</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMediaStore } from '@/stores/mediaStore'
import { detectMediaType } from '@/utils/mediaType'

const props = defineProps({
    media: { type: Object, required: true },
    type: { type: String, default: null, validator: (value) => value === null || ['movie', 'tv'].includes(value) },
    showFavoriteButton: { type: Boolean, default: true },
    showRemoveButton: { type: Boolean, default: false }
})

const emit = defineEmits(['click', 'remove-from-favorites'])

const mediaStore = useMediaStore()
const imageLoaded = ref(false)
const imageError = ref(false)

const detectedType = computed(() => props.type || detectMediaType(props.media))
const isTV = computed(() => detectedType.value === 'tv')
const isMovie = computed(() => detectedType.value === 'movie')

const posterUrl = computed(() =>
    props.media.poster_path ? `https://image.tmdb.org/t/p/w300${props.media.poster_path}` : '/placeholder-poster.jpg'
)

const mediaTitle = computed(() => {
    if (isTV.value) {
        return props.media.name
    }
    return props.media.title
})

const releaseYear = computed(() => {
    const dateField = isTV.value ? 'first_air_date' : 'release_date'
    return props.media[dateField]?.split('-')[0]
})

const tvInfo = computed(() => {
    if (!isTV.value) return null

    const seasons = props.media.number_of_seasons
    const episodes = props.media.number_of_episodes

    if (seasons && episodes) {
        return `${seasons} сезон(ов), ${episodes} эпизод(ов)`
    } else if (seasons) {
        return `${seasons} сезон(ов)`
    }
    return null
})

const isInFavorites = computed(() => mediaStore.isInFavorites(props.media.id))

const handleCardClick = () => {
    emit('click')
}

const toggleFavorite = () => {
    mediaStore.toggleFavorite(props.media)
}

const removeFromFavorites = () => {
    mediaStore.removeFromFavorites(props.media.id)
    emit('remove-from-favorites', props.media.id)
}
</script>

<style scoped>
.media-card {
    cursor: pointer;
    transition: transform 0.2s;
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.media-card:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
}

.poster-container {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    background: var(--color-bg-secondary);
}

.poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.poster.loaded {
    opacity: 1;
}

.poster.error {
    opacity: 0;
}

.placeholder,
.error-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.details {
    padding: 1rem;
    color: var(--color-text);
    flex: 1;
    display: flex;
    flex-direction: column;
}

.details h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: var(--font-weight-semibold);
    font-family: var(--font-family-heading);
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.details p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-normal);
}

.details .year {
    font-weight: var(--font-weight-medium);
}

.details .rating {
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
}

.details .episodes {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    font-weight: var(--font-weight-medium);
}

.favorite-btn,
.remove-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.favorite-btn:hover,
.remove-btn:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
}

.favorite-btn.favorited {
    background: rgba(var(--color-primary-rgb), 0.9);
}

.favorite-btn.favorited:hover {
    background: rgba(var(--color-primary-rgb), 1);
}

.remove-btn {
    background: rgba(var(--color-error-rgb), 0.9);
}

.remove-btn:hover {
    background: rgba(var(--color-error-rgb), 1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .poster-container {
        height: 250px;
    }
}

@media (max-width: 480px) {
    .poster-container {
        height: 200px;
    }
}
</style>
