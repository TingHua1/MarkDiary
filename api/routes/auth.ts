import { Router, type Request, type Response } from 'express';
import { authenticate } from '../services/authService.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    return;
  }

  const result = await authenticate(username, password);
  if (result.success) {
    res.json({ success: true, token: result.token });
  } else {
    res.status(401).json({ success: false, message: result.message });
  }
});

router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true });
});

router.get('/me', authMiddleware, (req: AuthRequest, res: Response): void => {
  res.json({ authenticated: true, username: req.user?.username });
});

export default router;
