import { ref, onMounted } from 'vue'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth } from '@/firebase/config'

export function useAuth() {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Отслеживание состояния аутентификации
  onMounted(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser
      loading.value = false
    })

    return unsubscribe
  })

  // Вход с email и паролем
  const login = async (email, password) => {
    try {
      error.value = null
      loading.value = true
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (err) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Регистрация с email и паролем
  const register = async (email, password) => {
    try {
      error.value = null
      loading.value = true
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return result
    } catch (err) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Вход через Google
  const loginWithGoogle = async () => {
    try {
      error.value = null
      loading.value = true
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result
    } catch (err) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Выход
  const logout = async () => {
    try {
      error.value = null
      await signOut(auth)
    } catch (err) {
      error.value = getErrorMessage(err.code)
      throw err
    }
  }

  // Получение сообщения об ошибке
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Пользователь не найден'
      case 'auth/wrong-password':
        return 'Неверный пароль'
      case 'auth/email-already-in-use':
        return 'Email уже используется'
      case 'auth/weak-password':
        return 'Пароль слишком слабый'
      case 'auth/invalid-email':
        return 'Неверный формат email'
      case 'auth/too-many-requests':
        return 'Слишком много попыток. Попробуйте позже'
      case 'auth/popup-closed-by-user':
        return 'Окно авторизации было закрыто'
      default:
        return 'Произошла ошибка при авторизации'
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    logout
  }
}
