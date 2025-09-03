import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBGD82tnXp0gJwgmao6H9t_2lLOYbxoyQo",
  authDomain: "vue3-f4a67.firebaseapp.com",
  projectId: "vue3-f4a67",
  storageBucket: "vue3-f4a67.firebasestorage.app",
  messagingSenderId: "892233226582",
  appId: "1:892233226582:web:fc86e67c43a1946d2c9ef7"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig)

// Инициализация Auth
export const auth = getAuth(app)

export default app
