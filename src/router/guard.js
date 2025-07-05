import { useAuthStore } from '@/stores/auth'

export function setupRouterGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    // 等待store初始化完成
    await authStore.initialize()
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
    
    if (to.meta.guestOnly && authStore.isAuthenticated) {
      next({ name: 'home' })
      return
    }
    
    next()
  })
}