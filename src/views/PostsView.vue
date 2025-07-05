<template>
  <div class="posts-page">
    <!-- 新增一个容器包裹标题和列表，统一控制宽度和对齐 -->
    <div class="articles-wrapper">
      <h2 class="article-list-title">文章列表</h2>
      <article-list v-if="showArticles" :articles="articles" />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import ArticleList from '@/components/ArticleList.vue'
import useArticles from '@/composables/useArticles' // 假设有封装好的API模块



const {
        articles,
        showArticles,
        fetchArticles,
        goHome
} = useArticles()
// 加载数据
const loadData = async () => {
  try {
    await fetchArticles()
  } catch (error) {
    console.error('加载文章失败:', error)
  }
}

// 组件挂载时自动加载
onMounted(loadData)
</script>

<style scoped>
.posts-page {
  /* 让内容居中，可根据需求调整 */
  display: flex;
  justify-content: center; 
}

/* 新增的包裹层，统一控制宽度和内边距 */
.articles-wrapper {
  width: 100%;
  max-width: 1200px; /* 和头部导航的 max-width 保持一致 */
  padding: 0 20px;   /* 左右留白，适配小屏幕 */
}

/* 标题样式：和文章卡片对齐 */
.article-list-title {
  font-size: 1.8rem;
  margin: 20px 0;    /* 与文章列表保持间距 */
  color: #333;
  /* 如果 ArticleList 有内边距，可通过 text-indent 或 padding 微调对齐 */
}
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