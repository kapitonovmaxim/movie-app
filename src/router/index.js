import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/movies', name: 'movies', component: () => import('@/views/MoviesView.vue') },
  { path: '/tv', name: 'tv', component: () => import('@/views/TVView.vue') },
  { path: '/search', name: 'search', component: () => import('@/views/SearchView.vue') },
  { path: '/favorites', name: 'favorites', component: () => import('@/views/FavoritesView.vue') },
  { path: '/movie/:id', name: 'MovieDetails', component: () => import('@/views/MovieDetails.vue') },
  { path: '/tv/:id', name: 'TVDetails', component: () => import('@/views/TVDetails.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
