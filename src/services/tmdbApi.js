import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'ru-RU' // Можно изменить на 'en-US' если нужен английский
  },
  timeout: 10000
});


export default {
  // Получить трендовые фильмы
  async fetchTrending() {
    try {
      const response = await apiClient.get('/trending/movie/week');
      return response.data.results;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // Получить детальную информацию о фильме
  async fetchMovieDetails(movieId) {
    try {
      const response = await apiClient.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'credits,videos,similar' // Получаем актеров, трейлеры и похожие фильмы
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie details for ID ${movieId}:`, error);
      throw error;
    }
  },

  // Поиск фильмов
  async searchMovies(query, page = 1) {
    try {
      const response = await apiClient.get('/search/movie', {
        params: { query, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Получить жанры
  async fetchGenres() {
    try {
      const response = await apiClient.get('/genre/movie/list');
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },
   // Получить популярные фильмы
  async fetchPopular(page = 1) {
    try {
      const response = await apiClient.get('/movie/popular', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // Получить фильмы в прокате
  async fetchNowPlaying(page = 1) {
    try {
      const response = await apiClient.get('/movie/now_playing', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  },

  async discoverMovies(params = {}) {
    try {
      const response = await apiClient.get('/discover/movie', {
        params: {
          sort_by: params.sortBy || 'popularity.desc',
          with_genres: params.genres?.join(',') || '',
          'vote_average.gte': params.rating || 0,
          'primary_release_date.gte': params.yearFrom ? `${params.yearFrom}-01-01` : '',
          'primary_release_date.lte': params.yearTo ? `${params.yearTo}-12-31` : '',
          page: params.page || 1,
          ...params
        }
      })
      return response.data
    } catch (error) {
      console.error('Error discovering movies:', error)
      throw error
    }
  }
};