<template>
    <div class="tv">
        <h1 class="page-title">Сериалы</h1>

        <div class="tv-layout">
            <!-- Sidebar with filters -->
            <Sidebar>
                <TVFilters @filter="handleFilter" />
            </Sidebar>

            <!-- Main content -->
            <div class="tv-content">
                <div class="summary" v-if="totalResults > 0">
                    Найдено: {{ totalResults.toLocaleString() }}
                </div>

                <div v-if="loading" class="loading">
                    <div class="loading-spinner"></div>
                    <p>Загрузка сериалов...</p>
                </div>

                <div v-else-if="tv.length === 0" class="no-results">
                    <p>Сериалы не найдены</p>
                    <p>Попробуйте изменить фильтры</p>
                </div>

                <div v-else class="tv-list">
                    <MediaCard
                        v-for="show in tv"
                        :key="show.id"
                        :media="show"
                        :show-favorite-button="true"
                        @click="goToTV(show.id)"
                    />
                </div>

                <div class="pagination" v-if="totalPages > 1">
                    <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Назад</button>
                    <span>{{ currentPage }} / {{ totalPages }}</span>
                    <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Вперед</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import tmdbApi from '@/services/tmdbApi'
import TVFilters from '@/components/TVFilters.vue'
import MediaCard from '@/components/MediaCard.vue'
import Sidebar from '@/components/layout/Sidebar.vue'

const router = useRouter()

const tv = ref([])
const totalResults = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const currentFilters = ref({})
const loading = ref(false)

const handleFilter = async (filters) => {
    currentFilters.value = filters
    currentPage.value = 1
    await loadTV()
}

const changePage = async (page) => {
    currentPage.value = page
    await loadTV()
}

onMounted(() => {
    loadTV()
})

const loadTV = async () => {
    loading.value = true

    try {
        const params = {
            ...currentFilters.value,
            page: currentPage.value
        }
        const data = await tmdbApi.discoverTVShows(params)

        tv.value = data.results || []
        totalResults.value = data.total_results || 0
        totalPages.value = data.total_pages || 1

    } catch (error) {
        console.error('Error loading TV shows:', error)
        tv.value = []
        totalResults.value = 0
        totalPages.value = 1
    } finally {
        loading.value = false
    }
}

const goToTV = (id) => {
    router.push(`/tv/${id}`)
}
</script>

<style scoped>
.tv {
    padding: 20px 0;
    color: var(--color-text);
}

.page-title {
    margin-bottom: 1.5rem;
    color: var(--color-text);
    font-size: 2.5rem;
    font-weight: var(--font-weight-bold);
    font-family: var(--font-family-heading);
}

.tv-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 2rem;
    align-items: start;
}

.tv-content {
    min-height: 500px;
}

.summary {
    margin: 0 0 1.5rem 0;
    opacity: 0.8;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: var(--color-text-secondary);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-border);
    border-top: 3px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.no-results {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary);
}

.no-results p {
    margin: 0.5rem 0;
}

.tv-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.pagination {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
}

.pagination button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg-secondary);
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: var(--font-family-primary);
    font-weight: var(--font-weight-medium);
}

.pagination button:hover:not(:disabled) {
    background: var(--color-bg-tertiary);
    border-color: var(--color-border-hover);
}

.pagination button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination span {
    color: var(--color-text-secondary);
    font-weight: 500;
}

/* Mobile responsive */
@media (max-width: 768px) {
    .tv-layout {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .page-title {
        margin-bottom: 1rem;
        font-size: 2rem;
    }

    .tv-list {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }
}

@media (max-width: 480px) {
    .tv {
        padding: 10px 0;
    }

    .tv-list {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
