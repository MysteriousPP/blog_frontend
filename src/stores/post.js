import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth'

export const usePostStore = defineStore('post', () => {
  const authStore = useAuthStore()
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getAuthHeader = () => {
    return authStore.isAuthenticated 
      ? { headers: { Authorization: `Bearer ${authStore.token}` } }
      : {}
  }

  const fetchPosts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(
        'http://127.0.0.1:8080/posts',
        getAuthHeader()
      )
      if (response.data.code === 0) {
        posts.value = response.data.data
      } else {
        error.value = response.data.msg
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchPostById = async (postId) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(
        `http://127.0.0.1:8080/post/${postId}`,
        getAuthHeader()
      )
      if (response.data.code === 0) {
        return response.data.data
      } else {
        error.value = response.data.msg
        return null
      }
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return { posts, loading, error, fetchPosts, fetchPostById, clearError }
})