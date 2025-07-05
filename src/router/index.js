import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView from '@/views/HomeView.vue'
import ArticleEditor from '@/components/ArticleEditor.vue'
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: HomeView
      },
      {
        path: 'posts',
        component: () => import('@/views/PostsView.vue') // 懒加载
      },
      {
        path: 'post/:postId',
        component: () => import('@/views/PostDetail.vue'), // 懒加载
        name: 'PostDetail'
      },
      {
        path: '/post/new',
        component: ArticleEditor,
        name: 'ArticleEditor',
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router