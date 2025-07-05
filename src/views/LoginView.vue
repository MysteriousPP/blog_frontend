<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>登录</h2>
      </template>
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="loginForm" 
        @submit.prevent="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码" 
            show-password 
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            native-type="submit" 
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        @close="clearError"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const loginForm = ref(null)

const form = ref({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = null
    
    // 验证表单
    await loginForm.value.validate()
    
    // 调用登录方法
    const success = await authStore.login(form.value)
    
    if (success) {
      // 登录成功后跳转
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const clearError = () => {
  error.value = null
  authStore.clearError()
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 20px;
}

h2 {
  text-align: center;
  margin: 0;
}
</style>