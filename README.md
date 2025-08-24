# Watchary - Movie App

Современное веб-приложение для просмотра информации о фильмах и сериалах, построенное на Vue 3 с использованием Firebase Authentication.

## 🚀 Возможности

- 📺 Просмотр фильмов и сериалов
- 🔍 Поиск по названию
- ❤️ Избранное (требует авторизации)
- 🌙 Темная/светлая тема
- 🔐 Авторизация через Firebase
  - Регистрация и вход по email/паролю
  - Вход через Google
- 📱 Адаптивный дизайн

## 🛠️ Технологии

- **Frontend**: Vue 3, Vite, Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Authentication**: Firebase Auth
- **API**: TMDB (The Movie Database)

## 📦 Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd movie-app
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте Firebase (см. [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))

4. Запустите приложение:
```bash
npm run dev
```

## 🔐 Настройка Firebase

Для работы авторизации необходимо настроить Firebase. Подробные инструкции см. в файле [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

## 📁 Структура проекта

```
src/
├── components/
│   ├── auth/          # Компоненты авторизации
│   ├── layout/        # Компоненты макета
│   └── ui/           # UI компоненты
├── composables/      # Vue composables
├── firebase/         # Конфигурация Firebase
├── router/           # Настройки маршрутизации
├── services/         # API сервисы
├── stores/           # Pinia stores
├── utils/            # Утилиты
└── views/            # Страницы приложения
```

## 🚀 Скрипты

- `npm run dev` - Запуск в режиме разработки
- `npm run build` - Сборка для продакшена
- `npm run preview` - Предварительный просмотр сборки
