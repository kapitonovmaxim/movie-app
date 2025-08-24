import { createWebHistory, createRouter } from 'vue-router'

const routes = [
        { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: '/movies', name: 'movies', component: () => import('@/views/MoviesView.vue') },
        { path: '/series', name: 'series', component: () => import('@/views/SeriesView.vue') },
        { path: '/favorites', name: 'favorites', component: () => import('@/views/FavoritesView.vue') },
        { path: '/search', name: 'search', component: () => import('@/views/SearchView.vue') },
        { path: '/movie/:id', name: 'MovieDetails', component: () => import('@/views/MovieDetails.vue') },
        { path: '/series/:id', name: 'SeriesDetails', component: () => import('@/views/SeriesDetails.vue') },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
