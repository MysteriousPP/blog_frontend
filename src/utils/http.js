import axios from 'axios'

const http = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  timeout: 5000
})

// 请求拦截器 - 添加token
http.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理token过期
http.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post('/auth/refresh', { refresh_token: refreshToken })
        
        if (response.data.code === 0) {
          const { access_token } = response.data.data
          localStorage.setItem('access_token', access_token)
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return http(originalRequest)
        }
      } catch (e) {
        console.error('刷新token失败', e)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.reload()
      }
    }
    
    return Promise.reject(error)
  }
)

export default http