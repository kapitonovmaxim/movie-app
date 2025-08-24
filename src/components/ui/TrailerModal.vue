<template>
    <div class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop @keydown.escape="closeModal">
            <button class="close-button" @click="closeModal">×</button>

            <!-- Video Container -->
            <div v-if="videoKey" class="video-container">
                <iframe
                    :src="videoUrl"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    class="video-iframe"
                ></iframe>
            </div>

            <!-- Fallback when no trailer available -->
            <div v-else class="no-trailer">
                <div class="no-trailer-content">
                    <h3>Трейлер недоступен</h3>
                    <p>К сожалению, трейлер для этого фильма/сериала не найден.</p>
                    <div class="tmdb-info">
                        <p>Для получения полной информации о фильмах и сериалах:</p>
                        <a
                            href="https://www.themoviedb.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="tmdb-link"
                        >
                            <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                                 alt="TMDB"
                                 class="tmdb-logo" />
                            Перейти на TMDB
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
    videoKey: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['close'])

const videoUrl = computed(() => {
    if (!props.videoKey) return ''
    return `https://www.youtube.com/embed/${props.videoKey}?autoplay=1&mute=1&rel=0&modestbranding=1`
})

const closeModal = (event) => {
    if (event) {
        event.preventDefault()
        event.stopPropagation()
    }
    emit('close')
}

// Close modal on escape key
const handleEscape = (event) => {
    if (event.key === 'Escape') {
        event.preventDefault()
        closeModal()
    }
}

// Add event listener for escape key
onMounted(() => {
    document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
}

.modal-content {
    position: relative;
    background: var(--color-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    max-width: 90vw;
    max-height: 90vh;
    /* overflow: hidden; */
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.close-button {
    position: absolute;
    top: -15px;
    right: -15px;

    background: rgba(0, 0, 0, 0.8);
    color: white;
    border: 1px solid var(--color-border);
    border-radius: 50%;
    width: 45px;
    height: 45px;
    font-size: 28px;
    cursor: pointer;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-weight: bold;
    pointer-events: auto;
}

.close-button:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
}

.close-button:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

.close-button:active {
    transform: scale(0.95);
}

.video-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    flex: 1;
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: var(--radius-lg);
    pointer-events: auto;
}

.video-iframe {
    z-index: 1;
}

.no-trailer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    padding: 2rem;
    text-align: center;
}

.no-trailer-content {
    max-width: 500px;
}

.no-trailer-content h3 {
    font-size: 1.5rem;
    font-weight: var(--font-weight-bold);
    margin-bottom: 1rem;
    color: var(--color-text);
}

.no-trailer-content p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    color: var(--color-text-secondary);
}

.tmdb-info {
    background: var(--color-bg-secondary);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
}

.tmdb-info p {
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
}

.tmdb-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--color-primary);
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    font-weight: var(--font-weight-semibold);
    transition: all 0.3s ease;
}

.tmdb-link:hover {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
}

.tmdb-logo {
    height: 20px;
    width: auto;
}

@media (max-width: 768px) {
    .modal-content {
        max-width: 95vw;
        max-height: 95vh;
    }

    .close-button {
        width: 40px;
        height: 40px;
        font-size: 24px;
        top: 10px;
        right: 15px;
    }

    .no-trailer {
        min-height: 300px;
        padding: 1rem;
    }

    .no-trailer-content h3 {
        font-size: 1.3rem;
    }

    .no-trailer-content p {
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .modal-content {
        max-width: 100vw;
        max-height: 100vh;
        border-radius: 0;
    }

    .close-button {
        width: 35px;
        height: 35px;
        font-size: 20px;
    }

    .no-trailer {
        min-height: 250px;
    }
}
</style>