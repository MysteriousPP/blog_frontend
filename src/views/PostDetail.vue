<template>
  <div class="post-detail">

    <div class="button-group">
      <button class="back-button" @click="router.back()">
        ← 返回列表
      </button>
      <!-- 操作按钮：只有作者本人可见 -->
      <div class="post-actions" v-if="isAuthor">
        <el-button type="danger" icon="el-icon-delete" @click="handleDelete">
          删除文章
        </el-button>
      </div>
    </div>

    <h1 class="title">{{ article.title }}</h1>
    
    <div class="meta">
      <span class="author">作者：{{ article.author_name }}</span> <br>
      <span class="date">发布日期：{{ formatDate(article.create_date) }}</span>
    </div>
    
    <!-- 使用marked渲染的内容 -->
    <div class="content" v-html="renderedContent"></div>
    
    <div class="tags">
      <span 
        v-for="tag in article.tags" 
        :key="tag"
        class="tag"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/utils/http'
import * as marked from 'marked'
import DOMPurify from 'dompurify'
import { ElMessageBox, ElMessage } from 'element-plus'
const route = useRoute()
const router = useRouter()
const user_id = localStorage.getItem('user_id')
const isAuthor = computed(() => {
  // console.log('user_id 类型:', typeof user_id); // 输出 'string' 或 'number'
  // console.log('author_id 类型:', typeof article.value?.author_id);
  // 统一类型后比较
  const userIdNum = Number(user_id);
  const authorIdNum = Number(article.value?.author_id);
  return userIdNum === authorIdNum;
});
const article = ref({
  title: '',
  content: '',
  author_name: '',
  create_date: '',
  author_id: 0,
  tags: []
})

// 渲染后的HTML内容
const renderedContent = computed(() => {
  if (!article.value.content) return ''
  
  // 解析Markdown为HTML
  const rawHtml = marked.parse(article.value.content)
  
  // 安全过滤HTML，防止XSS攻击
  return DOMPurify.sanitize(rawHtml)
})

const postId = computed(() => route.params.postId)

const fetchArticle = async () => {
  try {
    console.log(postId.value)
    console.log('Params:', route.params.postId)
    console.log('Params:', route.params)
    
    const response = await http.get(`/api/v1/post/${postId.value}`)
    
    if (response.data.code === 0) {
      article.value = response.data.data
    }
    
    if (response.data.code === 8000) {
      ElMessage.warning({
        message: '需要登录后才能查看文章',
        offset: 80,
        center: true,
        duration: 500
      })
      //router.push('/login') // 跳转到登录页
      return
    }
  } catch (error) {
    console.error('获取文章失败:', error)
    ElMessage.error({ message: '获取文章失败', duration: 500 })
  }
}


onMounted(() => {
  fetchArticle()
})

// 处理删除操作
const handleDelete = async () => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      '确定要删除这篇文章吗？此操作不可撤销。',
      '警告',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    //console.log(route.params.postId);
    
    //发送删除请求
    const response = await http.delete(`/api/v1/post/${postId.value}`);

    if (response.data.code === 0) {
      ElMessage.success({message:'文章已成功删除', duration: 500});
      router.push('/posts'); // 跳转回文章列表
    } else {
      const errorData = await response.json();
      ElMessage.error(errorData.message || '删除失败，请稍后重试');
    }
  } catch (error) {
    // 用户取消删除
    if (error === 'cancel') {
      ElMessage.info('已取消删除操作');
    }
  }
};

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// 返回列表页
const goBack = () => {
  router.back();
};


</script>

<style scoped>
/* 重置顶级容器 */
body, html, #app {
  margin: 0;
  padding: 0;
  width: 100%;
}
.button-group {
  display: flex;         /* 横向排列子元素 */
  justify-content: space-between; /* 两端对齐 */
  align-items: center;   /* 垂直居中对齐（避免按钮高度不同导致错位） */
  margin-bottom: 20px;   /* 与下方内容保持间距 */
  width: 100%;           /* 占满父容器宽度，确保两端对齐生效 */
}
.post-detail {
  width: 75%;           /* 占屏幕宽度的75% */
  max-width: 1600px;     /* 最大宽度限制 */
  margin: 0 auto;       /* 水平居中 */
  padding: 40px 0;      /* 上下内边距 */
}

/* 返回按钮 */
.back-button {
  background: none;
  border: none;
  color: #1a73e8;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 20px;
  padding: 5px 0;
}

.back-button:hover {
  text-decoration: underline;
}

/* 文章标题（带下边框） */
.title {
  font-size: 2rem;
  color: #333;
  margin: 0 0 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e5e5; /* 浅灰色边框 */
}

/* 元信息（作者、日期） */
.meta {
  color: #666;
  margin-bottom: 30px;
  font-size: 0.9rem;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e5e5; /* 浅灰色边框 */
}

/* 文章内容容器 */
.content {
  line-height: 1.8;
  margin-top: 20px;
  margin-bottom: 40px;
}

/* 段落间分隔线 */
:deep(.content p) {
  margin-bottom: 1.5em;
  padding-bottom: 1.5em;
  border-bottom: 1px solid #e5e5e5; /*浅灰色边框*/
  /* border: 1px solid #e5e5e5; */
}

/* 最后一段不显示底部边框 */
:deep(.content p:last-child) {
  border-bottom: none;
  padding-bottom: 0;
}

/* 图片样式 */
:deep(.content img) {
  max-width: 95%;       /* 不超过容器宽度 */
  height: auto;          /* 保持比例 */
  margin: 20px auto;        /* 上下间距 */
  border-radius: 4px;
  display: block;        /* 防止底部间隙 */
}

/* 图片容器（添加边框和内边距） */
:deep(.content img) {
  padding: 5px;
  border: 1px solid #e5e5e5; /* 浅灰色边框 */
  background-color: white;   /* 图片背景色 */
}

/* 链接样式 */
:deep(.content a) {
  color: #0366d6;
  text-decoration: none;
}

:deep(.content a:hover) {
  text-decoration: underline;
}

/* 代码块样式 */
:deep(.content pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
  border: 1px solid #e5e5e5; /* 浅灰色边框 */
}

:deep(.content code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
}

/* 标签样式 */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #e5e5e5; /* 浅灰色边框 */
}

.tag {
  background: #f0f4f8;
  color: #1a73e8;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
}
</style>