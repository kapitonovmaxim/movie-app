import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export default {
  // Получить трендовые фильмы
  async fetchTrending() {
    const response = await axios.get(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
    );
    return response.data.results;
  },

  // Поиск фильмов
  async searchMovies(query, page = 1) {
    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
    );
    return response.data;
  },

  // Получить жанры
  async fetchGenres() {
    const response = await axios.get(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    return response.data.genres;
  },
};