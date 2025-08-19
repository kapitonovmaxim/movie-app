import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useMovieStore = defineStore('movies', {
  state: () => ({
    favorites: useStorage('movie-favorites', []),
    currentMovie: null
  }),

  actions: {
    async addToFavorites(movie) {
      this.favorites.push(movie)
    },

    async removeFromFavorites(movieId) {
      this.favorites = this.favorites.filter(movie => movie.id !== movieId)
    },

    setCurrentMovie(movie) {
      this.currentMovie = movie
    }
  }
})