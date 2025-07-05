<!-- <template>
  <div id="app">
    <header class="header">
      <div class="header-content">
        <h1 class="logo">我的技术博客</h1>
        <nav class="nav-links">
          <a href="#" class="nav-link" @click.prevent="goHome">首页</a>
          <a href="#" class="nav-link" @click.prevent="fetchArticles">文章</a>
          <a href="#" class="nav-link">关于</a>
        </nav>
        <div class="auth-section">
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
    
 
    <article-list v-if="showArticles" :articles="articles" />
    <router-view v-if="!showArticles" />
    <login-modal ref="loginModal" @login-success="handleLoginSuccess" />
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import LoginModal from '@/components/LoginModal.vue'
import ArticleList from '@/components/ArticleList.vue'
import useArticles from './composables/useArticles'
import useLogin from './composables/userLogin'
//import { useRouter } from 'vue-router'

//const router = useRouter()
const loginModal = ref(null)
const {articles,showArticles,fetchArticles,goHome} = useArticles()
const {
        isLoggedIn,
        username,
        checkLoginStatus,
        handleLoginSuccess,
        handleLogout,
    } = useLogin()

onMounted(() => {
        checkLoginStatus()
})

// const goToPosts = () => {
//   router.push('/posts')
// }
</script> -->

<style scoped>
.header {
  background-color: #1a73e8; /* 谷歌蓝 */
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

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: white;
}

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

<template>
  <router-view />
</template>

<script setup>
// 不需要任何逻辑，仅作为路由容器
</script>