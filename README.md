# MarkDiary - 个人日记/博客平台

一个支持Markdown编写的个人日记/博客平台，支持登录管理，访客无需登录即可查看。

## 功能特性

- ✅ 无需登录即可查看文章
- ✅ 登录后可编写、编辑、删除文章
- ✅ 支持Markdown语法，代码高亮
- ✅ 响应式设计，支持移动端
- ✅ 文件系统存储，无需数据库
- ✅ 支持Windows/Linux部署

## 技术栈

- **前端**: React 18 + TypeScript + Tailwind CSS + Vite
- **后端**: Express.js + TypeScript
- **Markdown渲染**: react-markdown + remark-gfm + highlight.js
- **认证**: JWT + bcrypt

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

项目根目录已创建 `.env` 文件，您可以修改以下配置：

```
PORT=3000
JWT_SECRET=your-secret-key-change-this-in-production
USERNAME=admin
PASSWORD=admin123
# SSL证书配置（可选）
# SSL_KEY_PATH=./ssl/private.key
# SSL_CERT_PATH=./ssl/certificate.crt
# TLS加密配置
# TLS_ENABLED=false
```

- `PORT`: 服务器端口（默认3000）
- `JWT_SECRET`: JWT密钥，生产环境请修改为强密钥
- `USERNAME`: 登录用户名
- `PASSWORD`: 登录密码
- `SSL_KEY_PATH`: SSL私钥文件路径（可选）
- `SSL_CERT_PATH`: SSL证书文件路径（可选）
- `TLS_ENABLED`: 是否强制启用TLS加密（true/false，默认false）

### 3. 启动方式

#### 开发模式
```bash
npm run dev
```
这将同时启动前端开发服务器（默认端口5173）和后端API服务器（端口3000）。

#### 生产模式（推荐）
```bash
# 首先构建前端
npm run build

# 启动HTTP服务器（跨平台兼容）
npm start

# 启动HTTPS服务器（需要SSL证书）
npm run start:ssl
```

### 4. 访问应用

- 开发模式: http://localhost:5173
- 生产模式: http://localhost:3000（或 https://localhost:3000）

默认登录账号：
- 用户名: `admin`
- 密码: `admin123`

## 生产部署

### 1. 构建前端

```bash
npm run build
```

### 2. 配置生产环境

修改 `.env` 文件中的配置：
- 修改 `JWT_SECRET` 为强密钥
- 修改 `USERNAME` 和 `PASSWORD` 为安全的账号密码

### 3. 启动生产服务器

您可以使用以下任一方式启动：

#### 方式一：直接启动（推荐用于测试）

```bash
npm run server:dev
```

#### 方式二：使用PM2（推荐用于生产）

首先安装PM2：
```bash
npm install -g pm2
```

创建 `ecosystem.config.js` 文件：
```javascript
module.exports = {
  apps: [{
    name: 'diary-app',
    script: 'api/server.ts',
    interpreter: 'tsx',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

启动：
```bash
pm2 start ecosystem.config.js
```

### 4. 配置反向代理（Nginx）

使用Nginx作为反向代理，配置示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 数据存储

所有数据存储在 `data/` 目录下：

```
data/
├── config.json          # 网站配置
├── articles/
│   ├── index.json       # 文章索引
│   ├── article-1.md     # 文章内容
│   └── ...
```

## 目录结构

```
.
├── api/                 # 后端代码
│   ├── middleware/      # 中间件
│   ├── routes/          # 路由
│   ├── services/        # 业务逻辑
│   ├── app.ts           # Express应用
│   └── server.ts        # 服务器入口
├── src/                 # 前端代码
│   ├── components/      # 组件
│   ├── pages/           # 页面
│   ├── store.ts         # 状态管理
│   └── App.tsx          # 应用入口
├── data/                # 数据存储
├── .env                 # 环境变量
└── package.json
```

## 开发命令

- `npm run dev`: 启动前后端开发服务器
- `npm run client:dev`: 仅启动前端开发服务器
- `npm run server:dev`: 仅启动后端开发服务器
- `npm run build`: 构建前端
- `npm run check`: TypeScript类型检查
- `npm run lint`: 代码检查

## 许可证

MIT
