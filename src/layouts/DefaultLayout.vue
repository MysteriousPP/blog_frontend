<template>
  <div class="app-container">
    <header class="header">
      <!-- 头部内容与原App.vue相同 -->
      <div class="header-content">
        <h1 class="logo">我的技术博客</h1>
        <nav class="nav-links">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/posts" class="nav-link">文章</router-link>
          <router-link to="/about" class="nav-link">关于</router-link>
          <router-link to="/post/new" class="nav-link">新建文章</router-link>
        </nav>
        <div class="auth-section">
          <!-- 登录状态相关代码保持不变 -->
           <el-button 
            v-if="!isLoggedIn" 
            type="primary" 
            @click="loginModal.open()"
            class="login-btn"
          >
            登录
          </el-button>
          <el-dropdown v-else>
            <span class="user-info">
              <span class="username">{{ username }}</span>
              <el-icon class="dropdown-icon"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>
    
    <!-- 子页面内容插槽 -->
    <main>
      <router-view></router-view>
    </main>
    
    <!-- 登录模态框（全局） -->
    <login-modal ref="loginModal" @login-success="handleLoginSuccess" />
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import LoginModal from '@/components/LoginModal.vue'
import  useLogin  from '@/composables/useLogin.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginModal = ref(null)
const {
        isLoggedIn,
        username,
        //loginModal,
        checkLoginStatus,
        handleLoginSuccess,
        handleLogout,
} = useLogin()

// 暴露方法给子组件
defineExpose({
  openLoginModal: () => loginModal.value.open()
})
onMounted(() => {
        checkLoginStatus()
})
</script>

<!-- 原样式保持不变 -->
 <!-- src/layouts/DefaultLayout.vue -->
<style scoped>
/* 布局结构 */
.header {
  background-color: #1a73e8;
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
}

/* 导航相关 */
.nav-links {
  display: flex;
  gap: 20px;
  flex-grow: 1;
  justify-content: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>