<template>
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <!-- Лого и описание -->
                <div class="footer-section">
                    <router-link to="/" class="logo">
                        <img src="@/assets/logo.svg" alt="MovieFinder" />
                        <span>MovieFinder</span>
                    </router-link>
                    <p>Лучший способ найти фильмы и сериалы.</p>
                </div>

                <!-- Ссылки -->
                <div class="footer-section">
                    <h3>Навигация</h3>
                    <router-link to="/">Главная</router-link>
                    <router-link to="/favorites">Избранное</router-link>
                    <router-link to="/about">О проекте</router-link>
                </div>

                <!-- Соцсети -->
                <div class="footer-section">
                    <h3>Соцсети</h3>
                    <div class="social-links">
                        <a href="#" target="_blank">Twitter</a>
                        <a href="#" target="_blank">GitHub</a>
                    </div>
                </div>
            </div>

            <!-- Копирайт -->
            <div class="copyright">
                <p>
                    © 2024 MovieFinder. Использует API
                    <a href="https://www.themoviedb.org/" target="_blank">TMDb</a>.
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup>
// Можно добавить логику, например, текущий год для копирайта
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
    background: var(--color-footer-bg);
    color: var(--color-text);
    padding: 2rem 0;
    margin-top: auto;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.footer-section h3 {
    margin: 0;
    font-size: 1.2rem;
}

.footer-section a {
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color 0.3s;
}

.footer-section a:hover {
    color: var(--color-primary);
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    color: var(--color-text);
}

.logo img {
    height: 30px;
}

.social-links {
    display: flex;
    gap: 1rem;
}

.copyright {
    text-align: center;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
}

.copyright a {
    color: var(--color-primary);
}
</style>