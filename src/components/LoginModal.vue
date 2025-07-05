<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="30%">
    <!-- 登录/注册表单 -->
    <el-form :model="form" :rules="currentRules" ref="formRef">
      <!-- 公共字段 -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"/>
      </el-form-item>
      
      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password/>
      </el-form-item>
      
      <!-- 注册专用字段 -->
      <el-form-item v-if="isRegister" label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" show-password/>
      </el-form-item>
      <!-- <el-form-item v-if="isRegister" label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱"/>
      </el-form-item> -->
    </el-form>
    
    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        
        <!-- 根据当前模式显示登录/注册按钮 -->
        <el-button 
          v-if="isRegister" 
          type="primary" 
          @click="handleRegister"
        >
          注册
        </el-button>
        <el-button 
          v-else 
          type="primary" 
          @click="handleLogin"
        >
          登录
        </el-button>
        
        <!-- 切换模式按钮 -->
        <el-button 
          type="text" 
          @click="toggleMode"
        >
          {{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const emit = defineEmits(['login-success'])

// 对话框状态
const visible = ref(false)
const isRegister = ref(false) // 是否为注册模式

// 表单数据
const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: ''
})

// 动态标题
const dialogTitle = computed(() => {
  return isRegister.value ? '注册账号' : '登录'
})

// 表单验证规则
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, trigger: 'blur' }
  ],
  // email: [
  //   { required: true, message: '请输入邮箱', trigger: 'blur' },
  //   { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  // ]
}

// 当前使用的规则
const currentRules = computed(() => {
  return isRegister.value ? registerRules : loginRules
})

const formRef = ref(null)

// 打开对话框
const open = () => {
  visible.value = true
  isRegister.value = false // 默认显示登录
  resetForm()
}

// 切换登录/注册模式
const toggleMode = () => {
  isRegister.value = !isRegister.value
  resetForm()
}

// 重置表单
const resetForm = () => {
  form.value = {
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  }
  
  // 重置验证状态
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 登录处理
const handleLogin = async () => {
  try {
    await formRef.value.validate()
    const response = await axios.post('/api/v1/login', {
      username: form.value.username,
      password: form.value.password
    })
    
    if (response.data.code === 0) {
      // 存储登录信息
      localStorage.setItem('access_token', response.data.data.access_token)
      localStorage.setItem('refresh_token', response.data.data.refresh_token)
      localStorage.setItem('user_name', response.data.data.user_name)
      localStorage.setItem('user_id', response.data.data.user_id)
      
      ElMessage.success({message:'登录成功', duration:500})
      visible.value = false
      emit('login-success')
    } else {
      ElMessage.error(response.data.msg || '登录失败')
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.msg || error.message || '登录失败')
  }
}

// 注册处理
const handleRegister = async () => {
  try {
    await formRef.value.validate()
    const response = await axios.post('/api/v1/signup', {
      username: form.value.username,
      password: form.value.password,
      re_password: form.value.password,
      //email: form.value.email
    })
    
    if (response.data.code === 0) {
      ElMessage.success('注册成功，请登录')
      toggleMode() // 自动切换到登录模式
    } else {
      ElMessage.error(response.data.msg || '注册失败')
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.msg || error.message || '注册失败')
  }
}

defineExpose({ open })
</script>

<!-- src/components/LoginModal.vue -->
<style scoped>
.auth-section {
  display: flex;
  align-items: center;
}

.login-btn {
  background-color: white;
  color: #1a73e8;
  border: none;
}

.login-btn:hover {
  background-color: #f1f3f4;
}


</style>

<!-- src/components/UserDropdown.vue -->
<style scoped>
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.username {
  margin-right: 8px;
}

.dropdown-icon {
  transition: transform 0.3s;
}

.el-dropdown:hover .dropdown-icon {
  transform: rotate(180deg);
}
</style>