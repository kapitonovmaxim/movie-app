<template>
    <div class="sidebar-container">
        <!-- Mobile toggle button -->
        <button class="sidebar-toggle" @click="toggleSidebar" v-if="isMobile">
            <span>🎛️ Фильтры</span>
            <span class="toggle-icon">{{ isOpen ? '×' : '☰' }}</span>
        </button>

        <!-- Sidebar overlay for mobile -->
        <div
            v-if="isMobile && isOpen"
            class="sidebar-overlay"
            @click="closeSidebar"
        ></div>

        <!-- Sidebar content -->
        <aside class="sidebar" :class="{ 'open': isOpen, 'mobile': isMobile }">
            <div class="sidebar-header">
                <h3>Фильтры</h3>
                <button v-if="isMobile" class="close-btn" @click="closeSidebar">×</button>
            </div>

            <div class="sidebar-content">
                <slot></slot>
            </div>
        </aside>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    defaultOpen: {
        type: Boolean,
        default: true
    }
})

const isOpen = ref(props.defaultOpen)
const isMobile = ref(false)

const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
    if (isMobile.value && isOpen.value) {
        isOpen.value = false
    }
}

const toggleSidebar = () => {
    isOpen.value = !isOpen.value
}

const closeSidebar = () => {
    isOpen.value = false
}

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.sidebar-container {
    position: relative;
}

.sidebar-toggle {
    display: none;
    width: 100%;
    padding: 1rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: bold;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    color: var(--color-text);
}

.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
}

.sidebar {
    width: 300px;
    background: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
    height: fit-content;
    position: sticky;
    top: 2rem;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
}

.sidebar-header h3 {
    margin: 0;
    color: var(--color-text);
    font-size: 1.2rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: 0.25rem;
    border-radius: var(--radius-sm);
}

.close-btn:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-text);
}

.sidebar-content {
    color: var(--color-text);
}

/* Mobile styles */
@media (max-width: 768px) {
    .sidebar-toggle {
        display: flex;
    }

    .sidebar {
        position: fixed;
        top: 0;
        left: -100%;
        width: 320px;
        height: 100vh;
        z-index: 999;
        border-radius: 0;
        transition: left 0.3s ease;
        overflow-y: auto;
    }

    .sidebar.open {
        left: 0;
    }

    .sidebar.mobile {
        position: fixed;
    }
}

@media (max-width: 480px) {
    .sidebar {
        width: 100%;
        left: -100%;
    }
}
</style>
