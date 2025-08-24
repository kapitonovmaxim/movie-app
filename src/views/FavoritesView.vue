<template>
    <div class="favorites-page">
        <div class="container">
            <div class="page-header">
                <div class="header-content">
                    <div>
                        <h1>Избранное</h1>
                        <p v-if="favorites.length === 0" class="empty-state">
                            У вас пока нет избранных фильмов. Добавьте фильмы в избранное, чтобы они появились здесь.
                        </p>
                        <p v-else class="favorites-count">
                            {{ favorites.length }} {{ getFavoritesCountText(favorites.length) }}
                        </p>
                    </div>
                    <button
                        v-if="favorites.length > 0"
                        @click="clearFavorites"
                        class="clear-btn"
                        title="Очистить избранное"
                    >
                        Очистить все
                    </button>
                </div>
            </div>

            <div v-if="favorites.length > 0" class="favorites-grid">
                <MovieCard
                    v-for="movie in favorites"
                    :key="movie.id"
                    :movie="movie"
                    @remove-from-favorites="removeFromFavorites"
                    :show-remove-button="true"
                    @click="goToMovie(movie.id)"
                />
            </div>

            <div v-else class="empty-favorites">
                <div class="empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                              fill="var(--color-primary)" opacity="0.3"/>
                    </svg>
                </div>
                <h3>Нет избранных фильмов</h3>
                <p>Перейдите в раздел фильмов и добавьте понравившиеся фильмы в избранное</p>
                <router-link to="/movies" class="btn-primary">
                    Перейти к фильмам
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMovieStore } from '@/stores/movieStore'
import MovieCard from '@/components/MovieCard.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const movieStore = useMovieStore()

const favorites = computed(() => movieStore.favorites)

const removeFromFavorites = (movieId) => {
    movieStore.removeFromFavorites(movieId)
}

const clearFavorites = () => {
    if (confirm('Вы уверены, что хотите очистить все избранное?')) {
        movieStore.clearFavorites()
    }
}

const getFavoritesCountText = (count) => {
    if (count === 1) return 'фильм'
    if (count >= 2 && count <= 4) return 'фильма'
    return 'фильмов'
}
const goToMovie = (id) => {
    router.push(`/movie/${id}`)
}
</script>

<style scoped>
.favorites-page {
    padding: 2rem 0;
    min-height: calc(100vh - 200px);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.page-header {
    margin-bottom: 2rem;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.header-content > div {
    flex: 1;
}

.page-header h1 {
    text-align: left;
    margin-bottom: 0.5rem;
}

.page-header h1 {
    font-size: 2.5rem;
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
    margin-bottom: 0.5rem;
    font-family: var(--font-family-heading);
}

.favorites-count {
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    margin: 0;
}

.empty-state {
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    margin: 1rem 0;
}

.favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.empty-favorites {
    text-align: center;
    padding: 4rem 2rem;
    max-width: 500px;
    margin: 0 auto;
}

.empty-icon {
    margin-bottom: 1.5rem;
}

.empty-favorites h3 {
    font-size: 1.5rem;
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    margin-bottom: 1rem;
}

.empty-favorites p {
    color: var(--color-text-secondary);
    margin-bottom: 2rem;
    line-height: 1.6;
}

.btn-primary {
    display: inline-block;
    background: var(--color-primary);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    transition: background-color 0.3s;
}

.btn-primary:hover {
    background: var(--color-primary-dark);
}

.clear-btn {
    background: var(--color-error);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: var(--font-weight-medium);
    transition: background-color 0.3s;
}

.clear-btn:hover {
    background: var(--color-error-dark);
}

@media (max-width: 768px) {
    .favorites-page {
        padding: 1rem 0;
    }

    .header-content {
        flex-direction: column;
        align-items: stretch;
    }

    .page-header h1 {
        font-size: 2rem;
        text-align: center;
    }

    .favorites-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }
}
</style>
