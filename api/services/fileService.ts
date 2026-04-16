import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const ARTICLES_DIR = path.join(DATA_DIR, 'articles');

export interface ArticleMeta {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article extends ArticleMeta {
  content: string;
}

export interface Config {
  siteName: string;
  siteDescription: string;
}

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getConfig(): Config {
  const configPath = path.join(DATA_DIR, 'config.json');
  ensureDirExists(DATA_DIR);
  if (!fs.existsSync(configPath)) {
    const defaultConfig: Config = {
      siteName: '我的日记',
      siteDescription: '记录生活点滴'
    };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

export function getArticles(): ArticleMeta[] {
  const indexPath = path.join(ARTICLES_DIR, 'index.json');
  ensureDirExists(ARTICLES_DIR);
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, JSON.stringify({ articles: [] }, null, 2));
    return [];
  }
  const data = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  return data.articles.sort((a: ArticleMeta, b: ArticleMeta) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getArticle(id: string): Article | null {
  const articles = getArticles();
  const meta = articles.find(a => a.id === id);
  if (!meta) return null;

  const contentPath = path.join(ARTICLES_DIR, `${id}.md`);
  if (!fs.existsSync(contentPath)) return null;

  const content = fs.readFileSync(contentPath, 'utf-8');
  return { ...meta, content };
}

export function saveArticle(article: Omit<Article, 'createdAt' | 'updatedAt'>): Article {
  const now = new Date().toISOString();
  const existing = getArticle(article.id);
  const fullArticle: Article = {
    ...article,
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };

  const contentPath = path.join(ARTICLES_DIR, `${article.id}.md`);
  fs.writeFileSync(contentPath, article.content);

  let articles = getArticles();
  if (existing) {
    articles = articles.map(a => a.id === article.id ? fullArticle : a);
  } else {
    articles.unshift(fullArticle);
  }

  const indexPath = path.join(ARTICLES_DIR, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify({ articles }, null, 2));

  return fullArticle;
}

export function deleteArticle(id: string): boolean {
  const contentPath = path.join(ARTICLES_DIR, `${id}.md`);
  if (fs.existsSync(contentPath)) {
    fs.unlinkSync(contentPath);
  }

  let articles = getArticles();
  articles = articles.filter(a => a.id !== id);
  const indexPath = path.join(ARTICLES_DIR, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify({ articles }, null, 2));
  return true;
}

export function generateId(): string {
  return `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
