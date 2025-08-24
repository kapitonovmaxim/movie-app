/**
 * Определяет тип медиа-контента на основе структуры данных
 * @param {Object} media - объект с данными фильма или сериала
 * @returns {'movie'|'tv'} тип контента
 */
export function detectMediaType(media) {
    if (!media || typeof media !== 'object') {
        return 'movie' // fallback
    }

    // Проверяем наличие специфичных полей сериалов
    if (media.name ||
        media.first_air_date ||
        media.number_of_seasons ||
        media.number_of_episodes ||
        media.episode_run_time ||
        media.status === 'Returning Series' ||
        media.status === 'Ended' ||
        media.status === 'Canceled') {
        return 'tv'
    }

    // Проверяем наличие специфичных полей фильмов
    if (media.title ||
        media.release_date ||
        media.runtime ||
        media.budget ||
        media.revenue) {
        return 'movie'
    }

    // Дополнительные проверки для edge cases
    if (media.media_type) {
        return media.media_type === 'tv' ? 'tv' : 'movie'
    }

    // Если есть overview, но нет явных признаков, проверяем по контексту
    if (media.overview) {
        // Простая эвристика: если в описании есть слова, связанные с сериалами
        const tvKeywords = ['сезон', 'эпизод', 'сериал', 'season', 'episode', 'series']
        const hasTVKeywords = tvKeywords.some(keyword =>
            media.overview.toLowerCase().includes(keyword)
        )
        if (hasTVKeywords) {
            return 'tv'
        }
    }

    // По умолчанию считаем фильмом
    return 'movie'
}

/**
 * Проверяет, является ли объект фильмом
 * @param {Object} media - объект с данными
 * @returns {boolean}
 */
export function isMovie(media) {
    return detectMediaType(media) === 'movie'
}

/**
 * Проверяет, является ли объект сериалом
 * @param {Object} media - объект с данными
 * @returns {boolean}
 */
export function isTV(media) {
    return detectMediaType(media) === 'tv'
}
