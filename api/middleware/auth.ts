import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService.js';

export interface AuthRequest extends Request {
  user?: { username: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '未授权' });
  }

  const token = authHeader.slice(7);
  const result = verifyToken(token);
  
  if (!result.valid) {
    return res.status(401).json({ success: false, message: '无效的token' });
  }

  req.user = { username: result.username! };
  next();
}
