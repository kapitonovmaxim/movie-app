<template>
    <div class="lazy-image-container" :style="containerStyle">
        <!-- Placeholder -->
        <div v-if="!imageLoaded && !imageError" class="placeholder">
            <svg width="100%" height="100%" viewBox="0 0 300 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="450" fill="var(--color-bg-secondary)"/>
                <rect x="0" y="0" width="300" height="450" fill="var(--color-border)" opacity="0.3"/>

                <!-- Film icon -->
                <g transform="translate(125, 175)">
                    <rect x="0" y="0" width="50" height="50" rx="8" fill="var(--color-text-secondary)"/>
                    <rect x="8" y="8" width="34" height="34" rx="4" fill="var(--color-text-muted)"/>
                    <circle cx="25" cy="25" r="8" fill="var(--color-bg)"/>
                    <circle cx="25" cy="25" r="4" fill="var(--color-text-secondary)"/>
                </g>

                <!-- Loading text -->
                <text x="150" y="280" text-anchor="middle" font-family="var(--font-family-primary)" font-size="14" fill="var(--color-text-secondary)">
                    Загрузка...
                </text>
            </svg>
        </div>

        <!-- Error placeholder -->
        <div v-if="imageError" class="error-placeholder">
            <svg width="100%" height="100%" viewBox="0 0 300 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="450" fill="var(--color-bg-secondary)"/>
                <rect x="0" y="0" width="300" height="450" fill="var(--color-border)" opacity="0.3"/>

                <!-- Error icon -->
                <g transform="translate(125, 175)">
                    <circle cx="25" cy="25" r="25" fill="var(--color-error)" opacity="0.1"/>
                    <circle cx="25" cy="25" r="20" fill="var(--color-error)" opacity="0.2"/>
                    <path d="M15 15 L35 35 M35 15 L15 35" stroke="var(--color-error)" stroke-width="2" stroke-linecap="round"/>
                </g>

                <!-- Error text -->
                <text x="150" y="280" text-anchor="middle" font-family="var(--font-family-primary)" font-size="14" fill="var(--color-text-secondary)">
                    Ошибка загрузки
                </text>
            </svg>
        </div>

        <!-- Actual image -->
        <img
            v-show="imageLoaded && !imageError"
            :src="src"
            :alt="alt"
            :class="imageClass"
            @load="onImageLoad"
            @error="onImageError"
            :style="imageStyle"
        />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    src: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        default: ''
    },
    width: {
        type: [String, Number],
        default: 'auto'
    },
    height: {
        type: [String, Number],
        default: 'auto'
    },
    aspectRatio: {
        type: String,
        default: null // e.g., "16/9", "4/3", "1/1"
    },
    objectFit: {
        type: String,
        default: 'cover' // cover, contain, fill, none, scale-down
    },
    borderRadius: {
        type: String,
        default: 'var(--radius-md)'
    },
    imageClass: {
        type: String,
        default: ''
    }
})

const imageLoaded = ref(false)
const imageError = ref(false)

const containerStyle = computed(() => {
    const style = {
        width: typeof props.width === 'number' ? `${props.width}px` : props.width,
        height: typeof props.height === 'number' ? `${props.height}px` : props.height,
        borderRadius: props.borderRadius,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'var(--color-bg-secondary)'
    }

    if (props.aspectRatio) {
        const [width, height] = props.aspectRatio.split('/').map(Number)
        style.aspectRatio = `${width}/${height}`
    }

    return style
})

const imageStyle = computed(() => ({
    width: '100%',
    height: '100%',
    objectFit: props.objectFit,
    display: 'block'
}))

const onImageLoad = () => {
    imageLoaded.value = true
    imageError.value = false
}

const onImageError = () => {
    imageError.value = true
    imageLoaded.value = false
}
</script>

<style scoped>
.lazy-image-container {
    display: block;
    background: var(--color-bg-secondary);
}

.placeholder,
.error-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

img {
    transition: opacity 0.3s ease;
}
</style>
