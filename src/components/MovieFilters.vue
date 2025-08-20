<template>
    <div class="filters">
        <div class="filters-row">
            <div class="field">
                <label>Жанры</label>
                <select v-model="selectedGenreIds" multiple size="6">
                    <option v-for="genre in genres" :key="genre.id" :value="genre.id">
                        {{ genre.name }}
                    </option>
                </select>
            </div>

            <div class="field">
                <label>Год (от - до)</label>
                <div class="inline">
                    <input type="number" v-model.number="yearFrom" placeholder="От" min="1900" max="2100" />
                    <span class="dash">—</span>
                    <input type="number" v-model.number="yearTo" placeholder="До" min="1900" max="2100" />
                </div>
            </div>

            <div class="field">
                <label>Мин. рейтинг</label>
                <input type="number" v-model.number="minRating" step="0.5" min="0" max="10" placeholder="Напр. 7.5" />
            </div>

            <div class="field">
                <label>Сортировка</label>
                <select v-model="sortBy">
                    <option value="popularity.desc">Популярность ↓</option>
                    <option value="popularity.asc">Популярность ↑</option>
                    <option value="vote_average.desc">Рейтинг ↓</option>
                    <option value="vote_average.asc">Рейтинг ↑</option>
                    <option value="release_date.desc">Дата релиза ↓</option>
                    <option value="release_date.asc">Дата релиза ↑</option>
                    <option value="original_title.asc">Название A→Я</option>
                    <option value="original_title.desc">Название Я→A</option>
                </select>
            </div>
        </div>

        <div class="actions">
            <button class="btn" @click="emitFilters">Применить</button>
            <button class="btn light" @click="resetFilters">Сбросить</button>
        </div>
    </div>

</template>

<script setup>
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
    genres: { type: Array, required: true }
})

const emit = defineEmits(['filter'])

// State
const selectedGenreIds = ref([])
const yearFrom = ref()
const yearTo = ref()
const minRating = ref()
const sortBy = ref('popularity.desc')

const buildFilters = () => ({
    genres: selectedGenreIds.value,
    yearFrom: yearFrom.value || null,
    yearTo: yearTo.value || null,
    minRating: typeof minRating.value === 'number' ? minRating.value : null,
    sortBy: sortBy.value
})

const emitFilters = () => {
    emit('filter', buildFilters())
}

const debouncedEmit = useDebounceFn(emitFilters, 300)

watch([selectedGenreIds, yearFrom, yearTo, minRating, sortBy], () => {
    debouncedEmit()
})

const resetFilters = () => {
    selectedGenreIds.value = []
    yearFrom.value = undefined
    yearTo.value = undefined
    minRating.value = undefined
    sortBy.value = 'popularity.desc'
    emitFilters()
}
</script>

<style scoped>
.filters {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: rgba(0, 0, 0, 0.03);
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
}

.filters-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 12px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field label {
    font-size: 0.9rem;
    opacity: 0.8;
}

select[multiple] {
    min-height: 148px;
}

.inline {
    display: flex;
    align-items: center;
    gap: 8px;
}

.dash {
    opacity: 0.6;
}

input, select {
    padding: 8px 10px;
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: 6px;
    background: white;
}

.actions {
    display: flex;
    gap: 8px;
}

.btn {
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid transparent;
    cursor: pointer;
    background: #0ea5e9;
    color: white;
}

.btn.light {
    background: transparent;
    color: inherit;
    border-color: rgba(0,0,0,0.15);
}

@media (max-width: 900px) {
    .filters-row {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 600px) {
    .filters-row {
        grid-template-columns: 1fr;
    }
}
</style>


