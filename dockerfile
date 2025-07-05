# 阶段1：构建 Vue 应用（使用 Node.js 环境）
FROM node:18-alpine as builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 以缓存依赖
COPY package*.json ./

# 安装依赖（使用淘宝镜像加速国内下载）
RUN npm install --registry=https://registry.npmmirror.com

# 复制项目源代码
COPY . .

# 构建生产环境版本（根据你的构建命令调整）
RUN npm run build


# 阶段2：运行 Nginx 服务器
FROM nginx:1.25-alpine

# 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/

# 从构建阶段复制打包好的文件到 Nginx 静态目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口（与 Nginx 配置中的监听端口一致）
EXPOSE 80

# 启动 Nginx（以前台模式运行，避免 Docker 容器退出）
CMD ["nginx", "-g", "daemon off;"]