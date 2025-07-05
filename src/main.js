import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/global.css' // 导入全局样式
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 在组件中直接使用

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
// 全局注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}