<template>
    <div class="movie-filters">
      <!-- Кнопка открытия/закрытия фильтров (мобильная версия) -->
      <button class="filters-toggle" @click="isOpen = !isOpen">
        <span>🎛️ Фильтры</span>
        <span class="toggle-icon">{{ isOpen ? '▲' : '▼' }}</span>
      </button>

      <!-- Основная панель фильтров -->
      <div class="filters-panel" :class="{ open: isOpen }">
        <!-- Поиск -->
        <div class="filter-group">
          <label class="filter-label">Поиск</label>
          <input
            v-model="filters.query"
            type="text"
            placeholder="Название фильма..."
            class="search-input"
            @input="debouncedApplyFilters"
          />
        </div>

        <!-- Сортировка -->
        <div class="filter-group">
          <label class="filter-label">Сортировка</label>
          <select v-model="filters.sortBy" class="filter-select" @change="applyFilters">
            <option value="popularity.desc">По популярности (убыв.)</option>
            <option value="popularity.asc">По популярности (возр.)</option>
            <option value="vote_average.desc">По рейтингу (убыв.)</option>
            <option value="vote_average.asc">По рейтингу (возр.)</option>
            <option value="release_date.desc">По дате (новые)</option>
            <option value="release_date.asc">По дате (старые)</option>
            <option value="title.asc">По названию (А-Я)</option>
            <option value="title.desc">По названию (Я-А)</option>
          </select>
        </div>

        <!-- Жанры -->
        <div class="filter-group">
          <label class="filter-label">Жанры</label>
          <div class="genres-grid">
            <label
              v-for="genre in genres"
              :key="genre.id"
              class="genre-checkbox"
              :class="{ active: filters.genres.includes(genre.id) }"
            >
              <input
                type="checkbox"
                :value="genre.id"
                v-model="filters.genres"
                @change="applyFilters"
                class="checkbox-input"
              />
              <span class="checkbox-label">{{ genre.name }}</span>
            </label>
          </div>
        </div>

        <!-- Год выпуска -->
        <div class="filter-group">
          <label class="filter-label">Год выпуска</label>
          <div class="year-range">
            <input
              v-model.number="filters.yearFrom"
              type="number"
              placeholder="От"
              min="1900"
              :max="currentYear"
              class="year-input"
              @input="debouncedApplyFilters"
            />
            <span class="range-separator">—</span>
            <input
              v-model.number="filters.yearTo"
              type="number"
              placeholder="До"
              min="1900"
              :max="currentYear"
              class="year-input"
              @input="debouncedApplyFilters"
            />
          </div>
        </div>

        <!-- Рейтинг -->
        <div class="filter-group">
          <label class="filter-label">Рейтинг от {{ filters.rating }} ⭐</label>
          <input
            v-model.number="filters.rating"
            type="range"
            min="0"
            max="10"
            step="0.5"
            class="rating-slider"
            @input="applyFilters"
          />
          <div class="rating-labels">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="filter-actions">
          <button class="btn btn-secondary" @click="resetFilters">
            🗑️ Сбросить
          </button>
          <button class="btn btn-primary" @click="applyFilters">
            🔍 Применить
          </button>
        </div>

        <!-- Активные фильтры -->
        <div v-if="hasActiveFilters" class="active-filters">
          <h4>Активные фильтры:</h4>
          <div class="active-tags">
            <span
              v-if="filters.query"
              class="active-tag"
              @click="removeFilter('query')"
            >
              Поиск: "{{ filters.query }}" ❌
            </span>

            <span
              v-for="genreId in filters.genres"
              :key="'genre-' + genreId"
              class="active-tag"
              @click="removeGenreFilter(genreId)"
            >
              {{ getGenreName(genreId) }} ❌
            </span>

            <span
              v-if="filters.yearFrom"
              class="active-tag"
              @click="removeFilter('yearFrom')"
            >
              Год от: {{ filters.yearFrom }} ❌
            </span>

            <span
              v-if="filters.yearTo"
              class="active-tag"
              @click="removeFilter('yearTo')"
            >
              Год до: {{ filters.yearTo }} ❌
            </span>

            <span
              v-if="filters.rating > 0"
              class="active-tag"
              @click="removeFilter('rating')"
            >
              Рейтинг: {{ filters.rating }} ⭐ ❌
            </span>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, reactive, computed, onMounted, watch } from 'vue'
  import { useDebounceFn } from '@vueuse/core'
  import tmdbApi from '@/services/tmdbApi'

  const emit = defineEmits(['filter'])

  // Состояние компонента
  const isOpen = ref(false)
  const genres = ref([])
  const currentYear = new Date().getFullYear()

  // Параметры фильтрации
  const filters = reactive({
    query: '',
    sortBy: 'popularity.desc',
    genres: [],
    yearFrom: null,
    yearTo: null,
    rating: 0,
    page: 1
  })

  // Загрузка жанров при монтировании
  onMounted(async () => {
    try {
      genres.value = await tmdbApi.fetchGenres()
    } catch (error) {
      console.error('Error loading genres:', error)
    }
  })

  // Вычисляемые свойства
  const hasActiveFilters = computed(() => {
    return (
      filters.query !== '' ||
      filters.genres.length > 0 ||
      filters.yearFrom !== null ||
      filters.yearTo !== null ||
      filters.rating > 0 ||
      filters.sortBy !== 'popularity.desc'
    )
  })

  // Методы
  const getGenreName = (genreId) => {
    const genre = genres.value.find(g => g.id === genreId)
    return genre ? genre.name : 'Неизвестно'
  }

  const applyFilters = () => {
    // Валидация годов
    const validatedFilters = { ...filters }

    if (validatedFilters.yearFrom && validatedFilters.yearTo) {
      if (validatedFilters.yearFrom > validatedFilters.yearTo) {
        // Меняем местами, если from > to
        [validatedFilters.yearFrom, validatedFilters.yearTo] =
        [validatedFilters.yearTo, validatedFilters.yearFrom]
      }
    }

    emit('filter', validatedFilters)
  }

  // Дебаунс для поиска и полей ввода
  const debouncedApplyFilters = useDebounceFn(applyFilters, 500)

  const resetFilters = () => {
    filters.query = ''
    filters.sortBy = 'popularity.desc'
    filters.genres = []
    filters.yearFrom = null
    filters.yearTo = null
    filters.rating = 0
    filters.page = 1

    applyFilters()
  }

  const removeFilter = (filterKey) => {
    if (filterKey === 'query') {
      filters.query = ''
    } else if (filterKey === 'yearFrom') {
      filters.yearFrom = null
    } else if (filterKey === 'yearTo') {
      filters.yearTo = null
    } else if (filterKey === 'rating') {
      filters.rating = 0
    }
    applyFilters()
  }

  const removeGenreFilter = (genreId) => {
    filters.genres = filters.genres.filter(id => id !== genreId)
    applyFilters()
  }

  // Следим за изменением isOpen для мобильной версии
  watch(isOpen, (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  })
  </script>

  <style scoped>
  .movie-filters {
    background: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .filters-toggle {
    display: none;
    width: 100%;
    padding: 1rem;
    background: var(--color-bg-tertiary);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: bold;
    justify-content: space-between;
    align-items: center;
  }

  .filters-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-label {
    font-weight: bold;
    color: var(--color-text);
    margin-bottom: 0.5rem;
  }

  .search-input,
  .filter-select,
  .year-input {
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 1rem;
  }

  .search-input:focus,
  .filter-select:focus,
  .year-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
  }

  .genres-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
  }

  .genre-checkbox {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
    background: var(--color-bg);
  }

  .genre-checkbox:hover {
    border-color: var(--color-primary);
  }

  .genre-checkbox.active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }

  .checkbox-input {
    display: none;
  }

  .checkbox-label {
    font-size: 0.9rem;
    cursor: pointer;
  }

  .year-range {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .year-input {
    width: 80px;
    text-align: center;
  }

  .range-separator {
    color: var(--color-text-secondary);
  }

  .rating-slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: var(--color-border);
    outline: none;
    -webkit-appearance: none;
  }

  .rating-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--color-primary);
    cursor: pointer;
  }

  .rating-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--color-primary);
    cursor: pointer;
    border: none;
  }

  .rating-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    margin-top: 0.25rem;
  }

  .filter-actions {
    display: flex;
    gap: 1rem;
    align-items: end;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s ease;
  }

  .btn-primary {
    background: var(--color-primary);
    color: white;
  }

  .btn-primary:hover {
    background: var(--color-primary-hover);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: var(--color-bg);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  .btn-secondary:hover {
    background: var(--color-bg-tertiary);
  }

  .active-filters {
    grid-column: 1 / -1;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }

  .active-filters h4 {
    margin-bottom: 0.5rem;
    color: var(--color-text);
  }

  .active-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .active-tag {
    background: var(--color-primary);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-md);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .active-tag:hover {
    background: var(--color-primary-hover);
    transform: scale(1.05);
  }

  /* Адаптивность */
  @media (max-width: 768px) {
    .filters-toggle {
      display: flex;
    }

    .filters-panel {
      display: none;
      grid-template-columns: 1fr;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);
    }

    .filters-panel.open {
      display: grid;
    }

    .genres-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .filter-actions {
      flex-direction: column;
    }

    .btn {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .movie-filters {
      padding: 0.5rem;
    }

    .genres-grid {
      grid-template-columns: 1fr;
    }

    .year-range {
      flex-direction: column;
      align-items: stretch;
    }

    .year-input {
      width: 100%;
    }

    .range-separator {
      text-align: center;
    }
  }
  </style>