<template>
  <div class="article-container">
    <div v-for="article in articles" :key="article.post_id" class="article-card" @click="viewDetail(article.post_id)">
      <div class="article-header">
        <h3 class="article-title">{{ article.title }}</h3>
        <span class="article-author">作者: {{ article.author_name }}</span>
      </div>
      
      <div class="article-meta">
        <span class="community">社区: {{ article.community.community_name }}</span>
        <span class="votes">点赞: {{ article.vote_num }}</span>
      </div>
      
      <div class="article-excerpt">
        {{ truncateContent(article.content, 100) }}
      </div>
      
      <el-button type="text" @click="viewDetail(article.post_id)">查看详情</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  articles: {
    type: Array,
    required: true
  }
})

const router = useRouter()

const truncateContent = (content, length) => {
  return content.length > length 
    ? content.substring(0, length) + '...' 
    : content
}

const viewDetail = (postId) => {
  // router.push(`/post/${postId}`)
  router.push({
    name: 'PostDetail',
    params: { postId: postId } // 必须和路由配置的参数名一致
  })
}
</script>

<style scoped>
.article-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.article-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateY(-2px);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.article-title {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.article-author {
  color: #666;
  font-size: 0.9rem;
}

.article-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  color: #888;
  font-size: 0.85rem;
}

.article-excerpt {
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
}
</style>