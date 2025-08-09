import { createWebHistory, createRouter } from 'vue-router'

const routes = [
        { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: '/movie/:id', name: 'movie-details', component: () => import('@/views/MovieDetails.vue') },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
