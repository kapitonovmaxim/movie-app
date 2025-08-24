<template>
    <div v-if="showStatus" class="sync-status" :class="statusClass">
        <div class="sync-icon">
            <svg v-if="isLoading" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="currentColor"/>
            </svg>
            <svg v-else-if="hasError" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
            </svg>
        </div>
        <span class="sync-text">{{ statusText }}</span>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMediaStore } from '@/stores/mediaStore'
import { useAuth } from '@/composables/useAuth'

const mediaStore = useMediaStore()
const { user } = useAuth()

const isLoading = computed(() => mediaStore.favoritesLoading)
const hasError = computed(() => mediaStore.favoritesError)
const isAuthenticated = computed(() => !!user.value)

const showStatus = computed(() => {
    return isAuthenticated.value && (isLoading.value || hasError.value)
})

const statusClass = computed(() => {
    if (isLoading.value) return 'loading'
    if (hasError.value) return 'error'
    return 'success'
})

const statusText = computed(() => {
    if (isLoading.value) return 'Синхронизация...'
    if (hasError.value) return 'Ошибка синхронизации'
    return 'Синхронизировано'
})
</script>

<style scoped>
.sync-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    font-size: 0.875rem;
    font-weight: var(--font-weight-medium);
    transition: all 0.3s ease;
}

.sync-status.loading {
    background: var(--color-primary);
    color: white;
}

.sync-status.loading .sync-icon svg {
    animation: spin 1s linear infinite;
}

.sync-status.error {
    background: var(--color-error);
    color: white;
}

.sync-status.success {
    background: var(--color-success);
    color: white;
}

.sync-icon {
    display: flex;
    align-items: center;
}

.sync-text {
    white-space: nowrap;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .sync-status {
        padding: 0.375rem 0.75rem;
        font-size: 0.8rem;
    }
}
</style>
