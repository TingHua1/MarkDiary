/**
 * This is a API server with static file support
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import articlesRoutes from './routes/articles.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

// 配置项检查和默认值
const requiredEnv = {
  PORT: process.env.PORT || '3000',
  HOST: process.env.HOST || '0.0.0.0',
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key-please-change-in-production',
  USERNAME: process.env.USERNAME || 'admin',
  PASSWORD: process.env.PASSWORD || 'admin123'
};

// 验证必要的配置
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set, using default value. Please set it in .env file for production.');
}

if (!process.env.USERNAME || !process.env.PASSWORD) {
  console.warn('⚠️  USERNAME or PASSWORD not set, using default values. Please set them in .env file.');
}

// 导出配置供其他模块使用
export const config = requiredEnv;

const app: express.Application = express()

// 配置CORS，允许所有跨域请求
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/articles', articlesRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * Static files serving
 */
const staticPath = path.join(__dirname, '../dist')
if (fs.existsSync(staticPath)) {
  console.log('Serving static files from:', staticPath)
  app.use(express.static(staticPath))
  
  // Handle SPA routing - only for non-API routes
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(staticPath, 'index.html'))
  })
} else {
  console.warn('Static files not found. Please run "npm run build" first.')
}

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
