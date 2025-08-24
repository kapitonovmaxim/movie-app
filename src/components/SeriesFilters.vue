<template>
    <div class="series-filters">
        <!-- Сортировка -->
        <div class="filter-group">
            <label class="filter-label">Сортировка</label>
            <select v-model="filters.sortBy" class="filter-select" @change="applyFilters">
                <option value="popularity.desc">По популярности (убыв.)</option>
                <option value="popularity.asc">По популярности (возр.)</option>
                <option value="vote_average.desc">По рейтингу (убыв.)</option>
                <option value="vote_average.asc">По рейтингу (возр.)</option>
                <option value="first_air_date.desc">По дате (новые)</option>
                <option value="first_air_date.asc">По дате (старые)</option>
                <option value="name.asc">По названию (А-Я)</option>
                <option value="name.desc">По названию (Я-А)</option>
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

        <!-- Язык -->
        <div class="filter-group">
            <label class="filter-label">Язык</label>
            <select v-model="filters.language" class="filter-select" @change="applyFilters">
                <option value="">Любой язык</option>
                <option value="en">Английский</option>
                <option value="ru">Русский</option>
                <option value="es">Испанский</option>
                <option value="fr">Французский</option>
                <option value="de">Немецкий</option>
                <option value="it">Итальянский</option>
                <option value="ja">Японский</option>
                <option value="ko">Корейский</option>
                <option value="zh">Китайский</option>
            </select>
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

                <span
                    v-if="filters.language"
                    class="active-tag"
                    @click="removeFilter('language')"
                >
                    Язык: {{ getLanguageName(filters.language) }} ❌
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import tmdbApi from '@/services/tmdbApi'

const emit = defineEmits(['filter'])

// Состояние компонента
const genres = ref([])
const currentYear = new Date().getFullYear()

// Параметры фильтрации
const filters = reactive({
    sortBy: 'popularity.desc',
    genres: [],
    yearFrom: null,
    yearTo: null,
    rating: 0,
    language: '',
    page: 1
})

// Загрузка жанров при монтировании
onMounted(async () => {
    try {
        genres.value = await tmdbApi.fetchTVGenres()
    } catch (error) {
        console.error('Error loading TV genres:', error)
    }
})

// Вычисляемые свойства
const hasActiveFilters = computed(() => {
    return (
        filters.genres.length > 0 ||
        filters.yearFrom !== null ||
        filters.yearTo !== null ||
        filters.rating > 0 ||
        filters.language !== '' ||
        filters.sortBy !== 'popularity.desc'
    )
})

// Методы
const getGenreName = (genreId) => {
    const genre = genres.value.find(g => g.id === genreId)
    return genre ? genre.name : 'Неизвестно'
}

const getLanguageName = (code) => {
    const languages = {
        en: 'Английский',
        ru: 'Русский',
        es: 'Испанский',
        fr: 'Французский',
        de: 'Немецкий',
        it: 'Итальянский',
        ja: 'Японский',
        ko: 'Корейский',
        zh: 'Китайский'
    }
    return languages[code] || code
}

const applyFilters = () => {
    const validatedFilters = { ...filters }

    if (validatedFilters.yearFrom && validatedFilters.yearTo) {
        if (validatedFilters.yearFrom > validatedFilters.yearTo) {
            [validatedFilters.yearFrom, validatedFilters.yearTo] =
            [validatedFilters.yearTo, validatedFilters.yearFrom]
        }
    }

    emit('filter', validatedFilters)
}

// Дебаунс для полей ввода
const debouncedApplyFilters = useDebounceFn(applyFilters, 500)

const resetFilters = () => {
    filters.sortBy = 'popularity.desc'
    filters.genres = []
    filters.yearFrom = null
    filters.yearTo = null
    filters.rating = 0
    filters.language = ''
    filters.page = 1

    applyFilters()
}

const removeFilter = (filterKey) => {
    if (filterKey === 'yearFrom') {
        filters.yearFrom = null
    } else if (filterKey === 'yearTo') {
        filters.yearTo = null
    } else if (filterKey === 'rating') {
        filters.rating = 0
    } else if (filterKey === 'language') {
        filters.language = ''
    }
    applyFilters()
}

const removeGenreFilter = (genreId) => {
    filters.genres = filters.genres.filter(id => id !== genreId)
    applyFilters()
}
</script>

<style scoped>
.series-filters {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.filter-label {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.filter-select,
.year-input {
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 0.9rem;
    font-family: var(--font-family-primary);
}

.filter-select:focus,
.year-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
}

.genres-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
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
    font-size: 0.85rem;
    cursor: pointer;
    font-weight: var(--font-weight-medium);
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
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin-top: 0.25rem;
}

.filter-actions {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
}

.btn {
    padding: 0.75rem 1rem;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: var(--font-weight-semibold);
    transition: all 0.2s ease;
    text-align: center;
    font-family: var(--font-family-primary);
    font-size: 0.9rem;
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
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
}

.active-filters h4 {
    margin-bottom: 0.5rem;
    color: var(--color-text);
    font-size: 0.9rem;
    font-weight: var(--font-weight-semibold);
}

.active-tags {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.active-tag {
    background: var(--color-primary);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-md);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    font-weight: var(--font-weight-medium);
}

.active-tag:hover {
    background: var(--color-primary-hover);
    transform: scale(1.02);
}
</style>
