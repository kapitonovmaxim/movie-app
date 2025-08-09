<template>
    <div class="movie-card" @click="$emit('click')">
        <img :src="posterUrl" :alt="movie.title" class="poster" />
        <div class="details">
            <h3>{{ movie.title }}</h3>
            <p>{{ movie.release_date?.split('-')[0] }}</p>
            <p>⭐ {{ movie.vote_average?.toFixed(1) }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    movie: { type: Object, required: true },
})

const posterUrl = computed(() =>
    props.movie.poster_path ? `https://image.tmdb.org/t/p/w300${props.movie.poster_path}` : '/placeholder-poster.jpg'
)
</script>

<style scoped>
.movie-card {
    cursor: pointer;
    transition: transform 0.2s;
}
.movie-card:hover {
    transform: scale(1.05);
}
.poster {
    width: 100%;
    border-radius: 8px;
}
</style>