<template>
    <div class="search-input">
        <input type="text" v-model="inputValue" @input="handleInput" placeholder="Найти фильм..." />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const inputValue = ref('')
const emit = defineEmits(['search'])

// Дебаунс для поиска (500ms)
const debouncedSearch = useDebounceFn(() => {
    emit('search', inputValue.value)
}, 500)

const handleInput = () => {
    debouncedSearch()
}
</script>