<template>
    <div class="series-card" @click="$emit('click')">
        <div class="poster-container">
            <img
                :src="posterUrl"
                :alt="series.name"
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
        </div>

        <div class="details">
            <h3>{{ series.name }}</h3>
            <p class="year">{{ series.first_air_date?.split('-')[0] }}</p>
            <p class="rating">⭐ {{ series.vote_average?.toFixed(1) }}</p>
            <p v-if="series.episode_run_time?.length" class="episodes">
                {{ series.number_of_seasons }} сезон(ов)
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    series: { type: Object, required: true },
})

const imageLoaded = ref(false)
const imageError = ref(false)

const posterUrl = computed(() =>
    props.series.poster_path ? `https://image.tmdb.org/t/p/w300${props.series.poster_path}` : '/placeholder-poster.jpg'
)
</script>

<style scoped>
.series-card {
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

.series-card:hover {
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
