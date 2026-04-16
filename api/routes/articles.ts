import { Router, type Request, type Response } from 'express';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { getArticles, getArticle, saveArticle, deleteArticle, generateId, type Article } from '../services/fileService.js';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const articles = getArticles();
  res.json({ articles });
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const article = getArticle(req.params.id);
  if (!article) {
    res.status(404).json({ success: false, message: '文章不存在' });
    return;
  }
  res.json({ article });
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, summary, content } = req.body;
  
  if (!title || !content) {
    res.status(400).json({ success: false, message: '标题和内容不能为空' });
    return;
  }

  const article: Omit<Article, 'createdAt' | 'updatedAt'> = {
    id: generateId(),
    title,
    summary: summary || title.substring(0, 100),
    content
  };

  const saved = saveArticle(article);
  res.json({ success: true, article: saved });
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, summary, content } = req.body;
  const existing = getArticle(req.params.id);
  
  if (!existing) {
    res.status(404).json({ success: false, message: '文章不存在' });
    return;
  }

  if (!title || !content) {
    res.status(400).json({ success: false, message: '标题和内容不能为空' });
    return;
  }

  const article: Omit<Article, 'createdAt' | 'updatedAt'> = {
    id: req.params.id,
    title,
    summary: summary || title.substring(0, 100),
    content
  };

  const saved = saveArticle(article);
  res.json({ success: true, article: saved });
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const existing = getArticle(req.params.id);
  
  if (!existing) {
    res.status(404).json({ success: false, message: '文章不存在' });
    return;
  }

  deleteArticle(req.params.id);
  res.json({ success: true });
});

export default router;
