<template>
  <div class="upload-container">
    <input type="file" @change="handleUpload" accept="image/*" />
    <div v-if="loading" class="loading">上传中...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="imageUrl" class="preview">
      <img :src="imageUrl" alt="预览" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { uploadImage } from '@/utils/api';

const loading = ref(false);
const error = ref('');
const imageUrl = ref('');
const emit = defineEmits(['upload-success']);

const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  loading.value = true;
  error.value = '';

  try {
    const { url } = await uploadImage(file);
    imageUrl.value = url;
    emit('upload-success', url);
  } catch (err) {
    error.value = err.message || '上传失败';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.upload-container {
  margin: 1rem 0;
}

.loading {
  color: #666;
}

.error {
  color: red;
}

.preview img {
  max-width: 300px;
  margin-top: 10px;
  border-radius: 4px;
}
</style>