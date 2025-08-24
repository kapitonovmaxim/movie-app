<template>
    <div class="search-input">
        <div class="search-icon">🔍</div>
        <input
            type="text"
            v-model="inputValue"
            @input="handleInput"
            @keydown.enter="handleSearch"
            @focus="isFocused = true"
            @blur="handleBlur"
            placeholder="Найти фильм..."
            class="search-field"
        />
        <button
            v-if="inputValue"
            @click="clearSearch"
            class="clear-button"
            type="button"
        >
            ✕
        </button>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Найти фильм...'
    },
    debounceMs: {
        type: Number,
        default: 500
    }
})

const emit = defineEmits(['search', 'update:modelValue', 'clear'])

const inputValue = ref(props.modelValue)
const isFocused = ref(false)

// Синхронизация с внешним значением
watch(() => props.modelValue, (newValue) => {
    inputValue.value = newValue
})

// Дебаунс для поиска
const debouncedSearch = useDebounceFn(() => {
    if (inputValue.value.trim()) {
        emit('search', inputValue.value.trim())
        emit('update:modelValue', inputValue.value.trim())
    }
}, props.debounceMs)

const handleInput = () => {
    debouncedSearch()
}

const handleSearch = () => {
    if (inputValue.value.trim()) {
        emit('search', inputValue.value.trim())
        emit('update:modelValue', inputValue.value.trim())
    }
}

const clearSearch = () => {
    inputValue.value = ''
    emit('search', '')
    emit('update:modelValue', '')
    emit('clear')
}

const handleBlur = () => {
    setTimeout(() => {
        isFocused.value = false
    }, 150)
}
</script>

<style scoped>
.search-input {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 200px;
}

.search-icon {
    position: absolute;
    left: 12px;
    color: var(--color-text-muted);
    font-size: 14px;
    pointer-events: none;
    z-index: 2;
}

.search-field {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 0.9rem;
    font-family: var(--font-family-primary);
    transition: all 0.3s ease;
    outline: none;
}

.search-field:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
}

.search-field::placeholder {
    color: var(--color-text-muted);
    font-weight: var(--font-weight-normal);
}

.clear-button {
    position: absolute;
    right: 8px;
    background: none;
    border: none;
    color: var(--color-text-muted);
    font-size: 16px;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    width: 24px;
    height: 24px;
}

.clear-button:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-text);
}

/* Адаптивность */
@media (max-width: 768px) {
    .search-input {
        min-width: 150px;
    }

    .search-field {
        font-size: 0.85rem;
        padding: 0.6rem 0.8rem 0.6rem 2.2rem;
    }

    .search-icon {
        left: 10px;
        font-size: 12px;
    }

    .clear-button {
        right: 6px;
        width: 20px;
        height: 20px;
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .search-input {
        min-width: 120px;
    }

    .search-field {
        padding: 0.5rem 0.7rem 0.5rem 2rem;
        font-size: 0.8rem;
    }
}
</style>