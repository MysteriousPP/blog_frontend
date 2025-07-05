<template>
  <div class="markdown-editor">
    <el-card class="editor-card">
      <template #header>
        <div class="card-header">
          <el-input
            v-model="title"
            placeholder="输入文章标题"
            class="title-input"
          />
          <!-- <el-input
            v-model="communityId"
            type="number"
            placeholder="选择社区ID"
            class="community-input"
            :rules="[{ required: true, message: '社区ID不能为空', trigger: 'blur' }]"
            ref="communityInput"
          /> -->
          <el-select
            v-model="communityId"
            placeholder="选择社区"
            class="community-input"
            :rules="[{ required: true, message: '请选择社区', trigger: 'change' }]"
            ref="communitySelect"
          >
            <el-option v-for="community in COMMUNITIES" :key="community.id" :label="community.name" :value="community.id" />
          </el-select>
        </div>
      </template>
      
      <el-input
        v-model="markdown"
        type="textarea"
        :rows="12"
        placeholder="输入文章内容（支持Markdown）"
        class="markdown-textarea"
      />
      
      <div class="toolbar-container">
        <el-button type="primary" @click="insertImage">
          <el-icon><upload /></el-icon> 插入图片
        </el-button>
        <el-button type="success" @click="saveContent">
          <el-icon><save /></el-icon> 保存
        </el-button>
        <el-button type="danger" @click="clearContent">
          <el-icon><delete /></el-icon> 清空
        </el-button>
        <el-button @click="renderPreview">
          <el-icon><eye /></el-icon> 预览
        </el-button>
        <el-button type="success" @click="submitArticle">
          <el-icon><send /></el-icon> 发布文章
        </el-button>
      </div>
      
      <div v-if="showPreview" class="preview-container">
        <el-card class="preview-card">
          <template #header>
            <div class="preview-header">
              <el-icon><document /></el-icon> 预览效果 - 社区: {{ COMMUNITIES[communityId-1].name }}
            </div>
          </template>
          <div class="preview-content" v-html="renderedHtml"></div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted,watch } from 'vue'
import * as marked from 'marked'
//import { Upload, Eye, Send } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus';
import http from '@/utils/http';
const router = useRouter()
const title = ref('')
const markdown = ref('')
const renderedHtml = ref('')
const showPreview = ref(false)
const isSubmitting = ref(false)
const tempImages = ref([]); // 暂存的图片列表
const nextImageId = ref(0); // 图片ID计数器
const communityId = ref(1); // 默认社区ID为1

// 表单验证引用
const COMMUNITIES = [
  { id: 1, name: 'Go' },
  { id: 2, name: 'leetcode' },
  { id: 3, name: '瓦罗兰特' },
  { id: 4, name: '编程' }
];
watch(markdown, (newValue)=> {
  renderedHtml.value = marked.parse(newValue);
})

onMounted(() => {
  const savedTitle = localStorage.getItem('savedTitle');
  const savedMarkdown = localStorage.getItem('savedMarkdown');
  
  if (savedTitle) title.value = savedTitle;
  if (savedMarkdown) markdown.value = savedMarkdown;
});

// 保存内容到本地存储
const saveContent = () => {
  localStorage.setItem('savedTitle', title.value);
  localStorage.setItem('savedMarkdown', markdown.value);
  
  // 显示保存成功提示
  ElMessage({
    message: '内容已保存',
    type: 'success'
  });
};

// 清空内容
const clearContent = () => {
  // 确认对话框
  ElMessageBox.confirm(
    '确定要清空所有内容吗？此操作不可撤销。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 清空内容
    title.value = '';
    markdown.value = '';
    
    // 清除本地存储
    localStorage.removeItem('savedTitle');
    localStorage.removeItem('savedMarkdown');
    
    // 隐藏预览
    showPreview.value = false;

    // 清理图片
    tempImages.value.forEach(img => {
      URL.revokeObjectURL(img.tempUrl);
    });
    // 显示清空成功提示
    ElMessage({
      message: '内容已清空',
      type: 'success'
    });
  }).catch(() => {
    // 取消操作
    ElMessage({
      message: '已取消',
      type: 'info'
    });
  });
};

const selectImageFile = async () => {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => resolve(input.files[0]);
    input.click();
  });
};

const insertImage = async () => {
  try {
    const file = await selectImageFile();
    if (!file) return;
    
    // 生成临时ID和URL
    const imageId = `temp_${nextImageId.value++}`;
    const tempUrl = URL.createObjectURL(file);
    
    // 暂存图片信息
    tempImages.value.push({
      id: imageId,
      file,
      tempUrl,
      alt: '图片'
    });
    
    // 插入临时Markdown语法
    const cursorPos = getCursorPosition();
    const imageMarkdown = `![${imageId}](${tempUrl})`;
    markdown.value = insertAtCursor(markdown.value, cursorPos, imageMarkdown);
    
    // 重新渲染预览
    renderPreview();
  } catch (err) {
    console.error('选择图片失败', err);
  }
};

const getCursorPosition = () => {
  const textarea = document.querySelector('textarea')
  return textarea?.selectionStart || 0
}

const insertAtCursor = (text, pos, insert) => {
  return text.substring(0, pos) + insert + text.substring(pos)
}

const renderPreview = () => {
  renderedHtml.value = marked.parse(markdown.value)
  showPreview.value = !showPreview.value
}

const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  return http.post('/api/v1/uploadimg', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => res.data.data);
};

const submitArticle = async () => {
  if (!title.value.trim() || !markdown.value.trim()) {
    ElMessage.error('标题和内容不能为空');
    return;
  }
  if (!communityId.value) {
    ElMessage.error('请选择社区');
    communitySelect.value?.focus();
    return;
  }

  isSubmitting.value = true;
  try {
    let finalContent = markdown.value;
    
    // 上传所有暂存图片
    for (const image of tempImages.value) {
      const { url } = await uploadImage(image.file);
      //const  url  = await uploadImage(image.file);
      console.log("url1",url)
      // 替换临时URL为真实URL
      //url = url.data.url
      console.log("url2",url)
      const tempPattern = new RegExp(`!\\[${image.id}\\]\\(${image.tempUrl}\\)`, 'g');
      finalContent = finalContent.replace(tempPattern, `![${image.alt}](${url})`);
    }
    const authorname = localStorage.getItem("user_name")
    const articleData = {
      author_name: authorname,
      title: title.value,
      content: finalContent,
      community_id: communityId.value,
      // 其他文章属性...
    };
    console.log(articleData)
    //提交文章
    const response = await http.post('/api/v1/post', articleData);
    console.log(response)
    ElMessage.success('文章发布成功');
    // router.push('/articles');
  } catch (err) {
    console.error('发布失败', err);
    ElMessage.error('发布失败，请重试');
  } finally {
    isSubmitting.value = false;
    
    // 释放临时URL资源
    tempImages.value.forEach(img => {
      URL.revokeObjectURL(img.tempUrl);
    });
    tempImages.value = [];
  }
};
// 组件卸载时释放临时URL
onUnmounted(() => {
  tempImages.value.forEach(img => {
    URL.revokeObjectURL(img.tempUrl);
  });
});
</script>

<style scoped>

.markdown-editor {
  max-width: 70%;  /* 限制最大宽度为浏览器宽度的70% */
  margin: 0 auto;  /* 水平居中 */
  padding: 20px 0; /* 调整上下内边距 */
}
:deep(.preview-content img) {
  max-width: 50%;
  height: auto;
  display: block;
  margin: 16px auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.markdown-editor {
  padding: 20px;
}

.editor-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.title-input {
  width: 100%;
}

.markdown-textarea {
  margin-bottom: 16px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}

.toolbar-container {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.preview-container {
  margin-top: 20px;
}

.preview-card {
  background-color: #f5f7fa;
}

.preview-content {
  padding: 20px;
  line-height: 1.8;
  color: #303133;
}

.preview-content p {
  margin-bottom: 16px;
}

.preview-content h2 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ebeef5;
}

.preview-content img {
  max-width: 100%;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin: 16px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toolbar-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .toolbar-container .el-button {
    width: 100%;
  }
}
</style>