import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// 加载 .env 文件，确保优先使用文件配置
dotenv.config({
  override: true // 强制覆盖系统环境变量
});

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-please-change-in-production';
const USERNAME = process.env.USERNAME || 'admin';
const PASSWORD = process.env.PASSWORD || 'admin123';

console.log('Auth config:', {
  USERNAME,
  PASSWORD: '***', // 不显示密码
  JWT_SECRET: '***' // 不显示密钥
});

export async function authenticate(username: string, password: string): Promise<{ success: boolean; token?: string; message?: string }> {
  console.log('Login attempt:', { username, password: '***' });
  
  // 简化认证逻辑，直接比较用户名和密码
  if (username !== USERNAME) {
    console.log('Username mismatch:', { provided: username, expected: USERNAME });
    return { success: false, message: '用户名或密码错误' };
  }

  if (password !== PASSWORD) {
    console.log('Password mismatch');
    return { success: false, message: '用户名或密码错误' };
  }

  console.log('Login successful:', username);
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
  return { success: true, token };
}

export function verifyToken(token: string): { valid: boolean; username?: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    return { valid: true, username: decoded.username };
  } catch {
    return { valid: false };
  }
}
