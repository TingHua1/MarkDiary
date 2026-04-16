import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiFetch, useAppStore } from '../store';
import MarkdownViewer from '../components/MarkdownViewer';
import { ArrowLeft, Calendar, Edit2, Trash2 } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppStore();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        const response = await apiFetch(`/api/articles/${id}`);
        if (!response.ok) {
          throw new Error('文章不存在');
        }
        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('确定要删除这篇文章吗？')) return;
    
    try {
      const response = await apiFetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        navigate('/');
      }
    } catch (err) {
      console.error('删除失败:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500 text-lg mb-4">{error || '文章不存在'}</p>
        <Link to="/" className="text-[#1e3a5f] hover:text-[#ff6b35]">
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-[#1e3a5f] mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回首页
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#1e3a5f] mb-4">{article.title}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>发布于 {formatDate(article.createdAt)}</span>
              {article.updatedAt !== article.createdAt && (
                <span className="ml-4">更新于 {formatDate(article.updatedAt)}</span>
              )}
            </div>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center space-x-2 ml-4">
              <Link
                to={`/admin/edit/${article.id}`}
                className="p-2 text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit2 className="h-5 w-5" />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <MarkdownViewer content={article.content} />
      </div>
    </div>
  );
};

export default ArticleDetail;
