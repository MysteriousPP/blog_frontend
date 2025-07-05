import axios from 'axios';

const service = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 5000,
});

// 图片上传
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  return service.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => res.data);
};

// 创建文章
export const createArticle = (data) => {
  return service.post('/articles', data).then(res => res.data);
};

// 获取文章
export const getArticle = (id) => {
  return service.get(`/articles/${id}`).then(res => res.data);
};