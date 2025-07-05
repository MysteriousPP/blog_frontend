import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const isAuthenticated = ref(false) // 初始化为false
  const error = ref(null)

  // 初始化方法
  const initialize = async () => {
    if (token.value) {
      try {
        const response = await axios.get('http://your-backend-api/auth/me', {
          headers: { Authorization: `Bearer ${token.value}` }
        })
        if (response.data.code === 0) {
          user.value = response.data.data
          isAuthenticated.value = true
        }
      } catch (err) {
        logout()
      }
    }
    return isAuthenticated.value
  }


  // 登录
  const login = async (credentials) => {
    error.value = null
    try {
      const response = await axios.post('http://127.0.0.1:8080/auth/login', credentials)
      if (response.data.code === 0) {
        token.value = response.data.data.token
        user.value = response.data.data.user
        isAuthenticated.value = true
        
        // 存储token到localStorage
        localStorage.setItem('token', token.value)
        
        return true
      } else {
        error.value = response.data.msg
        return false
      }
    } catch (err) {
      error.value = err.response?.data?.msg || err.message
      return false
    }
  }

  // 登出
  const logout = () => {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
    router.push({ name: 'login' })
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  return { user, token, isAuthenticated, error, initialize, login, logout, clearError }
})