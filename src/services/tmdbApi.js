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

  // Получить жанры фильмов
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

  // Подборка фильмов по фильтрам (discover)
  async discoverMovies(params = {}) {
    try {
      const {
        sortBy = 'popularity.desc',
        genres = [],
        yearFrom = null,
        yearTo = null,
        rating = 0,
        language = '',
        duration = '',
        includeAdult = false,
        page = 1
      } = params

      const query = {
        sort_by: sortBy,
        include_adult: includeAdult,
        page
      }

      if (genres && genres.length > 0) {
        query.with_genres = genres.join(',')
      }

      if (yearFrom) {
        query['primary_release_date.gte'] = `${yearFrom}-01-01`
      }

      if (yearTo) {
        query['primary_release_date.lte'] = `${yearTo}-12-31`
      }

      if (typeof rating === 'number' && rating > 0) {
        query['vote_average.gte'] = rating
      }

      if (language) {
        query.with_original_language = language
      }

      if (duration) {
        switch (duration) {
          case 'short':
            query['with_runtime.lte'] = 90
            break
          case 'medium':
            query['with_runtime.gte'] = 90
            query['with_runtime.lte'] = 120
            break
          case 'long':
            query['with_runtime.gte'] = 120
            break
        }
      }

      const response = await apiClient.get('/discover/movie', { params: query })
      return response.data
    } catch (error) {
      console.error('Error discovering movies:', error)
      throw error
    }
  },

  // === TV METHODS ===

  // Получить трендовые сериалы
  async fetchTrendingTV() {
    try {
      const response = await apiClient.get('/trending/tv/week');
      return response.data.results;
    } catch (error) {
      console.error('Error fetching trending TV shows:', error);
      throw error;
    }
  },

  // Получить детальную информацию о сериале
  async fetchTVShowDetails(showId) {
    try {
      const response = await apiClient.get(`/tv/${showId}`, {
        params: {
          append_to_response: 'credits,videos,similar' // Получаем актеров, трейлеры и похожие сериалы
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching TV show details for ID ${showId}:`, error);
      throw error;
    }
  },

  // Поиск сериалов
  async searchTVShows(query, page = 1) {
    try {
      const response = await apiClient.get('/search/tv', {
        params: { query, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching TV shows:', error);
      throw error;
    }
  },

  // Получить жанры сериалов
  async fetchTVGenres() {
    try {
      const response = await apiClient.get('/genre/tv/list');
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching TV genres:', error);
      throw error;
    }
  },

  // Получить популярные сериалы
  async fetchPopularTV(page = 1) {
    try {
      const response = await apiClient.get('/tv/popular', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw error;
    }
  },

  // Получить сериалы в эфире
  async fetchOnTheAirTV(page = 1) {
    try {
      const response = await apiClient.get('/tv/on_the_air', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching on the air TV shows:', error);
      throw error;
    }
  },

  // Подборка сериалов по фильтрам (discover)
  async discoverTVShows(params = {}) {
    try {
      const {
        sortBy = 'popularity.desc',
        genres = [],
        yearFrom = null,
        yearTo = null,
        rating = 0,
        language = '',
        status = '',
        type = '',
        page = 1
      } = params

      const query = {
        sort_by: sortBy,
        page
      }

      if (genres && genres.length > 0) {
        query.with_genres = genres.join(',')
      }

      if (yearFrom) {
        query['first_air_date.gte'] = `${yearFrom}-01-01`
      }

      if (yearTo) {
        query['first_air_date.lte'] = `${yearTo}-12-31`
      }

      if (typeof rating === 'number' && rating > 0) {
        query['vote_average.gte'] = rating
      }

      if (language) {
        query.with_original_language = language
      }

      if (status !== '') {
        query.with_status = status
      }

      if (type !== '') {
        query.with_type = type
      }

      const response = await apiClient.get('/discover/tv', { params: query })
      return response.data
    } catch (error) {
      console.error('Error discovering TV shows:', error)
      throw error
    }
  }
};