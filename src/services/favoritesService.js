import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export class FavoritesService {
  // Получить коллекцию избранного для пользователя
  static getUserFavoritesCollection(userId) {
    return collection(db, 'users', userId, 'favorites')
  }

  // Получить документ избранного для конкретного медиа
  static getFavoriteDoc(userId, mediaId) {
    return doc(db, 'users', userId, 'favorites', mediaId.toString())
  }

  // Добавить медиа в избранное
  static async addToFavorites(userId, media) {
    try {
      const favoriteDoc = this.getFavoriteDoc(userId, media.id)
      await setDoc(favoriteDoc, {
        ...media,
        addedAt: new Date().toISOString(),
        userId: userId
      })
      return true
    } catch (error) {
      console.error('Error adding to favorites:', error)
      throw error
    }
  }

  // Удалить медиа из избранного
  static async removeFromFavorites(userId, mediaId) {
    try {
      const favoriteDoc = this.getFavoriteDoc(userId, mediaId)
      await deleteDoc(favoriteDoc)
      return true
    } catch (error) {
      console.error('Error removing from favorites:', error)
      throw error
    }
  }

  // Получить все избранное пользователя
  static async getFavorites(userId) {
    try {
      const favoritesCollection = this.getUserFavoritesCollection(userId)
      const querySnapshot = await getDocs(favoritesCollection)

      const favorites = []
      querySnapshot.forEach((doc) => {
        favorites.push(doc.data())
      })

      return favorites
    } catch (error) {
      console.error('Error getting favorites:', error)
      throw error
    }
  }

  // Проверить, находится ли медиа в избранном
  static async isInFavorites(userId, mediaId) {
    try {
      const favoriteDoc = this.getFavoriteDoc(userId, mediaId)
      const docSnapshot = await getDoc(favoriteDoc)
      return docSnapshot.exists()
    } catch (error) {
      console.error('Error checking favorite status:', error)
      return false
    }
  }

  // Очистить все избранное пользователя
  static async clearFavorites(userId) {
    try {
      const favoritesCollection = this.getUserFavoritesCollection(userId)
      const querySnapshot = await getDocs(favoritesCollection)

      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)

      return true
    } catch (error) {
      console.error('Error clearing favorites:', error)
      throw error
    }
  }

  // Подписаться на изменения избранного в реальном времени
  static subscribeToFavorites(userId, callback) {
    const favoritesCollection = this.getUserFavoritesCollection(userId)

    return onSnapshot(favoritesCollection, (snapshot) => {
      const favorites = []
      snapshot.forEach((doc) => {
        favorites.push(doc.data())
      })
      callback(favorites)
    }, (error) => {
      console.error('Error subscribing to favorites:', error)
    })
  }

  // Синхронизировать локальное избранное с Firebase
  static async syncFavoritesWithFirebase(userId, localFavorites) {
    try {
      // Получить избранное из Firebase
      const firebaseFavorites = await this.getFavorites(userId)

      // Создать Map для быстрого поиска
      const firebaseMap = new Map(firebaseFavorites.map(fav => [fav.id, fav]))
      const localMap = new Map(localFavorites.map(fav => [fav.id, fav]))

      // Добавить локальные элементы, которых нет в Firebase
      for (const [id, media] of localMap) {
        if (!firebaseMap.has(id)) {
          await this.addToFavorites(userId, media)
        }
      }

      // Удалить элементы из Firebase, которых нет в локальном хранилище
      for (const [id, media] of firebaseMap) {
        if (!localMap.has(id)) {
          await this.removeFromFavorites(userId, id)
        }
      }

      return true
    } catch (error) {
      console.error('Error syncing favorites:', error)
      throw error
    }
  }
}
