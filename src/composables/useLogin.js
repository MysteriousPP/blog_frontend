import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
export default function useLogin() {
    const isLoggedIn = ref(false)
    const username = ref('')
    //const loginModal = ref(null)
    // 检查登录状态
    const checkLoginStatus = () => {
        const token = localStorage.getItem('access_token')
        const user_name = localStorage.getItem('user_name')
        isLoggedIn.value = !!token
        // 这里可以从token解析出用户名，或者调用API获取用户信息
        if (isLoggedIn.value) {
            username.value = user_name // 实际应从token或API获取
        }
    }

    // 登录成功回调
    const handleLoginSuccess = () => {
        checkLoginStatus()
    }

    // 退出登录
    const handleLogout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        isLoggedIn.value = false
        ElMessage.success('已退出登录')
    }

   
    return {
        isLoggedIn,
        username,
        //loginModal,
        checkLoginStatus,
        handleLoginSuccess,
        handleLogout,
    }
}