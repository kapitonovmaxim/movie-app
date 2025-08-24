import { defineStore } from 'pinia'
import { detectMediaType } from '@/utils/mediaType'

export const useMediaStore = defineStore('media', {
  state: () => ({
    favorites: [],
    currentMedia: null
  }),

  getters: {
    favoritesCount: (state) => state.favorites.length,

    isInFavorites: (state) => (mediaId) => {
      return state.favorites.some(media => media.id === mediaId)
    },

    // Получить только фильмы из избранного
    favoriteMovies: (state) => {
      return state.favorites.filter(media => detectMediaType(media) === 'movie')
    },

    // Получить только сериалы из избранного
    favoriteTV: (state) => {
      return state.favorites.filter(media => detectMediaType(media) === 'tv')
    }
  },

  actions: {
    // Инициализация избранного из localStorage при запуске приложения
    initFavorites() {
      try {
        const stored = localStorage.getItem('media-favorites')
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
        localStorage.setItem('media-favorites', JSON.stringify(this.favorites))
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error)
      }
    },

    // Добавление медиа в избранное
    addToFavorites(media) {
      if (!this.isInFavorites(media.id)) {
        this.favorites.push(media)
        this.saveFavorites()
      }
    },

    // Удаление медиа из избранного
    removeFromFavorites(mediaId) {
      this.favorites = this.favorites.filter(media => media.id !== mediaId)
      this.saveFavorites()
    },

    // Переключение состояния избранного (добавить/удалить)
    toggleFavorite(media) {
      if (this.isInFavorites(media.id)) {
        this.removeFromFavorites(media.id)
      } else {
        this.addToFavorites(media)
      }
    },

    // Очистка всего избранного
    clearFavorites() {
      this.favorites = []
      this.saveFavorites()
    },

    // Установка текущего медиа для детальной страницы
    setCurrentMedia(media) {
      this.currentMedia = media
    }
  }
})
