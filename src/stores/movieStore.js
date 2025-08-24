import { defineStore } from 'pinia'

export const useMovieStore = defineStore('movies', {
  state: () => ({
    favorites: [],
    currentMovie: null
  }),

  getters: {
    favoritesCount: (state) => state.favorites.length,

    isInFavorites: (state) => (movieId) => {
      return state.favorites.some(movie => movie.id === movieId)
    }
  },

  actions: {
    // Инициализация избранного из localStorage при запуске приложения
    initFavorites() {
      try {
        const stored = localStorage.getItem('movie-favorites')
        if (stored) {
          this.favorites = JSON.parse(stored)
        }
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error)
        this.favorites = []
      }
    },

    // Сохранение избранного в localStorage при каждом изменении
    saveFavorites() {
      try {
        localStorage.setItem('movie-favorites', JSON.stringify(this.favorites))
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error)
      }
    },

    // Добавление фильма в избранное
    addToFavorites(movie) {
      if (!this.isInFavorites(movie.id)) {
        this.favorites.push(movie)
        this.saveFavorites()
      }
    },

    // Удаление фильма из избранного
    removeFromFavorites(movieId) {
      this.favorites = this.favorites.filter(movie => movie.id !== movieId)
      this.saveFavorites()
    },

    // Переключение состояния избранного (добавить/удалить)
    toggleFavorite(movie) {
      if (this.isInFavorites(movie.id)) {
        this.removeFromFavorites(movie.id)
      } else {
        this.addToFavorites(movie)
      }
    },

    // Очистка всего избранного
    clearFavorites() {
      this.favorites = []
      this.saveFavorites()
    },

    // Установка текущего фильма для детальной страницы
    setCurrentMovie(movie) {
      this.currentMovie = movie
    }
  }
})