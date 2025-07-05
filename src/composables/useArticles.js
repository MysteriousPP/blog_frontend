import { ref } from 'vue'
import http from '@/utils/http'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export default function useArticles(){
    const articles = ref([])
    const showArticles = ref(false)
    const router = useRouter()

    const fetchArticles = async () => {
    try
    {
        const response = await http.get('/api/v1/posts/')
        if (response.data.code === 0) {
        articles.value = response.data.data
        showArticles.value = true
        }
        if (response.data.code === 8000) {
        ElMessage.warning({
            message:'需要登录后才能查看文章',
            offset: 80,
            center: true,
            duration: 500
        })
        //router.push('/login') // 跳转到登录页
        return
      }
    } catch (error) {
        console.error('获取文章失败:', error)
        ElMessage.error({message:'获取文章失败',duration: 500})
    }
    }

    const goHome = () => {
    showArticles.value = false
    // 如果有需要可以添加路由跳转
    }
    return {
        articles,
        showArticles,
        fetchArticles,
        goHome
    }
}
